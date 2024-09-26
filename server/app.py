from flask import Flask, jsonify, request, make_response
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import db, bcrypt, User, Category, Quiz, Question, Option, Score
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


api.add_resource(Home, '/')


class QuizResource(Resource):
    def get(self):
        try:
            quizzes = Quiz.query.all()
            quiz_list = [quiz.to_dict() for quiz in quizzes]
            return make_response(jsonify(quiz_list), 200)
        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 500)

api.add_resource(QuizResource, '/quizzes')


class CategoryResource(Resource):
    def get(self):
        try:
            categories = Category.query.all()
            category_list = [category.to_dict() for category in categories]
            return make_response(jsonify(category_list), 200)
        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 500)

api.add_resource(CategoryResource, '/categories')


class QuizByCategoryResource(Resource):
    def get(self):
        try:
            category_name = request.args.get('category')
            if not category_name:
                return make_response(jsonify({"error": "Category is required"}), 400)

            category = Category.query.filter_by(name=category_name.lower()).first()
            if not category:
                return make_response(jsonify({"error": "Category not found"}), 404)

            quizzes = Quiz.query.filter_by(category_id=category.id).all()
            quiz_list = [quiz.to_dict() for quiz in quizzes]
            return make_response(jsonify(quiz_list), 200)
        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 500)

api.add_resource(QuizByCategoryResource, '/quizzes/by_category')


class QuestionOptionsResource(Resource):
    def get(self, question_id):
        try:
            question = Question.query.get(question_id)
            if not question:
                return make_response(jsonify({"error": "Question not found"}), 404)

            options = Option.query.filter_by(question_id=question.id).all()
            options_list = [option.to_dict() for option in options]
            return make_response(jsonify(options_list), 200)
        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 500)

api.add_resource(QuestionOptionsResource, '/questions/<int:question_id>/options')


class LeaderboardResource(Resource):
    def get(self):
        users = User.query.all()
        leaderboard = sorted(
            [
                {
                    'username': user.username,
                    'average_score': user.calculate_average_score(),
                    'total_quizzes_completed': len(user.scores)  # Add total quizzes completed
                }
                for user in users
            ],
            key=lambda x: x['average_score'],
            reverse=True
        )
        return make_response(jsonify(leaderboard), 200)

api.add_resource(LeaderboardResource, '/leaderboard')



class SubmitScoreResource(Resource):
    @jwt_required()
    def post(self):
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            quiz_id = data.get('quiz_id')
            points = data.get('points')

            existing_score = Score.query.filter_by(user_id=user_id, quiz_id=quiz_id).first()

            if existing_score:
                existing_score.points = points
                db.session.commit()
                return make_response(jsonify({"message": "Score updated successfully"}), 200)
            else:
                new_score = Score(user_id=user_id, quiz_id=quiz_id, points=points)
                db.session.add(new_score)
                db.session.commit()
                return make_response(jsonify({"message": "Score submitted successfully"}), 201)

        except Exception as e:
            print(f"Error saving score: {e}")
            return make_response(jsonify({"error": str(e)}), 500)

api.add_resource(SubmitScoreResource, '/submit_score')


class SubmitQuizResource(Resource):
    @jwt_required()
    def post(self):
        try:
            data = request.get_json()
            category_name = data.get('category')
            questions_data = data.get('questions')

            if not category_name or not questions_data:
                return make_response(jsonify({"error": "Category and questions are required"}), 400)

            if len(questions_data) < 3 or len(questions_data) > 10:
                return make_response(jsonify({"error": "Quiz must have between 3 and 10 questions"}), 400)

            # Get current user from JWT token
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user:
                return make_response(jsonify({"error": "User not found"}), 404)

            # Check if category exists
            category = Category.query.filter_by(name=category_name.lower()).first()
            if not category:
                return make_response(jsonify({"error": "Category not found"}), 404)

            # Create a new quiz
            new_quiz = Quiz(user_id=user.id, category_id=category.id)
            db.session.add(new_quiz)
            db.session.flush()  # Flush to generate quiz ID

            # Loop through each question and create the question and options
            for question_data in questions_data:
                question_text = question_data.get('text')
                options_data = question_data.get('options')

                if not question_text or len(options_data) != 5:
                    return make_response(jsonify({"error": "Each question must have text and exactly 5 options"}), 400)

                # Check that exactly one option is marked as correct
                correct_options_count = sum([1 for option in options_data if option.get('is_correct')])
                if correct_options_count != 1:
                    return make_response(jsonify({"error": "Each question must have exactly one correct option"}), 400)

                # Create a new question
                new_question = Question(quiz_id=new_quiz.id, text=question_text)
                db.session.add(new_question)
                db.session.flush()

                # Create the options for the question
                for option_data in options_data:
                    option_text = option_data.get('text')
                    is_correct = option_data.get('is_correct', False)
                    new_option = Option(question_id=new_question.id, text=option_text, is_correct=is_correct)
                    db.session.add(new_option)

            db.session.commit()
            return make_response(jsonify({"message": "Quiz submitted successfully", "quiz_id": new_quiz.id}), 201)
        
        except Exception as e:
            db.session.rollback()  # Rollback any changes if an error occurs
            print(f"Error submitting quiz: {e}")
            return make_response(jsonify({"error": "Internal Server Error"}), 500)

api.add_resource(SubmitQuizResource, '/submit_quiz')

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
                return {"message": "User with the provided username already exists"}, 400

            new_user = User(username=username)
            new_user.password_hash = password

            db.session.add(new_user)
            db.session.commit()

            return {"message": "User created successfully"}, 201
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


class Protected(Resource):
    @jwt_required()
    def get(self):
        try:
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            return {"username": user.username}, 200
        except Exception as e:
            print(f"Error in protected resource: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500


class Authenticate(Resource):
    @jwt_required()
    def post(self):
        try:
            data = request.get_json()
            password = data.get('password')

            if not password:
                return {"message": "Password is required"}, 400

            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)

            if not user or not user.authenticate(password):
                return {"message": "Invalid password"}, 401

            return {"authenticated": True}, 200
        except Exception as e:
            print(f"Error during authentication: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500


api.add_resource(Register, '/register', endpoint='register_endpoint')
api.add_resource(Login, '/login', endpoint='login_endpoint')
api.add_resource(TokenRefresh, '/refresh', endpoint='refresh_endpoint')
api.add_resource(Protected, '/protected', endpoint='protected_endpoint')
api.add_resource(Authenticate, '/authenticate', endpoint='authenticate')


class UserResource(Resource):
    @jwt_required()
    def get(self, id):
        try:
            user = User.query.get(id)
            if not user:
                return {"message": "User not found"}, 404
            return user.to_dict(), 200
        except Exception as e:
            return {"error": str(e)}, 500
        
api.add_resource(UserResource, '/users/<int:id>')



with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)