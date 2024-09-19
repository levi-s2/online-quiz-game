from flask import Flask, jsonify, request, make_response
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import db, bcrypt, User, Category, Quiz, Question, Answer, Score
import os
import traceback

app = Flask(__name__)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'quiz_game.db')}")
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your_default_secret_key')
migrate = Migrate(app, db)
db.init_app(app)
bcrypt.init_app(app)
api = Api(app)
CORS(app, resources={r"*": {"origins": "*"}}, supports_credentials=True)
jwt = JWTManager(app)


class Home(Resource):
    def get(self):
        response_dict = {"message": "Welcome to the Quiz Game API"}
        return make_response(jsonify(response_dict), 200)


class QuizResource(Resource):
    def get(self):
        try:
            quizzes = Quiz.query.all()
            quiz_list = [quiz.to_dict() for quiz in quizzes]
            return make_response(jsonify(quiz_list), 200)
        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 500)


class Register(Resource):
    def post(self):
        try:
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')

            if not username or not password:
                return {"message": "Username and password are required"}, 400

            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                return {"message": "User with provided username already exists"}, 400

            new_user = User(username=username)
            new_user.password_hash = password

            db.session.add(new_user)
            db.session.commit()

            return new_user.to_dict(), 201
        except Exception as e:
            print(f"Error during registration: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500


class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')

            user = User.query.filter_by(username=username).first()
            if not user or not user.authenticate(password):
                return {"message": "Invalid username or password"}, 401

            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)
            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": user.to_dict()
            }, 200
        except Exception as e:
            print(f"Error during login: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500


class TokenRefresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user_id = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user_id)
        return {"access_token": new_access_token}, 200


class UserDetail(Resource):
    @jwt_required()
    def get(self, user_id):
        try:
            user = User.query.get(user_id)
            if not user:
                return {"message": "User not found"}, 404
            return user.to_dict(), 200
        except Exception as e:
            print(f"Error fetching user: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

    @jwt_required()
    def patch(self, user_id):
        try:
            user = User.query.get(user_id)
            if not user:
                return {"message": "User not found"}, 404

            data = request.get_json()
            dark_mode = data.get('dark_mode')
            username = data.get('username')

            if dark_mode is not None:
                user.dark_mode = dark_mode

            if username:
                user.username = username

            db.session.commit()
            return user.to_dict(), 200

        except Exception as e:
            print(f"Error updating user: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500


class Protected(Resource):
    @jwt_required()
    def get(self):
        try:
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            return user.to_dict(), 200
        except Exception as e:
            print(f"Error in protected resource: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500


api.add_resource(Home, '/')
api.add_resource(QuizResource, '/quizzes')
api.add_resource(Register, '/register', endpoint='register_endpoint')
api.add_resource(Login, '/login', endpoint='login_endpoint')
api.add_resource(TokenRefresh, '/refresh', endpoint='refresh_endpoint')
api.add_resource(UserDetail, '/users/<int:user_id>', endpoint='user_detail_endpoint')
api.add_resource(Protected, '/protected', endpoint='protected_endpoint')


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
