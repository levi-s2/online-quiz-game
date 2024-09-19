from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, Integer, String, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship, validates
from flask_bcrypt import Bcrypt

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)
bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(Integer, primary_key=True)
    username = db.Column(String(80), unique=True, nullable=False)
    _password_hash = db.Column(String(128), nullable=False)
    dark_mode = db.Column(Boolean, default=False)

    quizzes = relationship('Quiz', back_populates='user')
    scores = relationship('Score', back_populates='user')

    @property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters long")
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)

    @validates('username')
    def validate_username(self, key, username):
        assert username is not None and len(username) > 0, "Username must not be empty"
        return username

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'dark_mode': self.dark_mode,
            'quizzes': [quiz.to_dict_basic() for quiz in self.quizzes],
            'scores': [score.to_dict() for score in self.scores]
        }

    def __repr__(self):
        return f'<User {self.id}. {self.username}>'


class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(Integer, primary_key=True)
    name = db.Column(String(50), unique=True, nullable=False)

    # Class attribute containing approved categories
    approved_categories = ['math', 'science', 'history', 'music', 'general knowledge']

    quizzes = relationship('Quiz', back_populates='category')

    @validates('name')
    def validate_name(self, key, name):
        assert name.lower() in Category.approved_categories, f"Category {name} is not an approved category"
        return name.lower()

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

    def __repr__(self):
        return f'<Category {self.id}. {self.name}>'


class Quiz(db.Model):
    __tablename__ = 'quizzes'
    
    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey('users.id'), nullable=True)  # user_id is nullable now
    category_id = db.Column(Integer, ForeignKey('categories.id'), nullable=False)

    user = relationship('User', back_populates='quizzes')
    category = relationship('Category', back_populates='quizzes')
    questions = relationship('Question', back_populates='quiz', cascade="all, delete-orphan")
    score = relationship('Score', uselist=False, back_populates='quiz')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category': self.category.to_dict(),
            'questions': [question.to_dict() for question in self.questions],
            'score': self.score.to_dict() if self.score else None
        }

    def to_dict_basic(self):
        return {
            'id': self.id,
            'category': self.category.to_dict()
        }

    def __repr__(self):
        return f'<Quiz {self.id}. User: {self.user_id}, Category: {self.category_id}>'


class Question(db.Model):
    __tablename__ = 'questions'
    
    id = db.Column(Integer, primary_key=True)
    quiz_id = db.Column(Integer, ForeignKey('quizzes.id'), nullable=False)
    text = db.Column(Text, nullable=False)

    quiz = relationship('Quiz', back_populates='questions')
    answers = relationship('Answer', back_populates='question', cascade="all, delete-orphan")

    @validates('text')
    def validate_text(self, key, text):
        assert text is not None and len(text) > 0, "Question text must not be empty"
        return text

    def to_dict(self):
        return {
            'id': self.id,
            'quiz_id': self.quiz_id,
            'text': self.text,
            'answers': [answer.to_dict() for answer in self.answers]
        }

    def __repr__(self):
        return f'<Question {self.id}. Quiz: {self.quiz_id}>'


class Answer(db.Model):
    __tablename__ = 'answers'
    
    id = db.Column(Integer, primary_key=True)
    question_id = db.Column(Integer, ForeignKey('questions.id'), nullable=False)
    text = db.Column(Text, nullable=False)
    is_correct = db.Column(Boolean, default=False)

    question = relationship('Question', back_populates='answers')

    @validates('text')
    def validate_text(self, key, text):
        assert text is not None and len(text) > 0, "Answer text must not be empty"
        return text

    def to_dict(self):
        return {
            'id': self.id,
            'question_id': self.question_id,
            'text': self.text,
            'is_correct': self.is_correct
        }

    def __repr__(self):
        return f'<Answer {self.id}. Question: {self.question_id}, Correct: {self.is_correct}>'


class Score(db.Model):
    __tablename__ = 'scores'
    
    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    quiz_id = db.Column(Integer, ForeignKey('quizzes.id'), nullable=False, unique=True)
    points = db.Column(Integer, nullable=False)

    user = relationship('User', back_populates='scores')
    quiz = relationship('Quiz', back_populates='score')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'quiz_id': self.quiz_id,
            'points': self.points
        }

    def __repr__(self):
        return f'<Score {self.id}. User: {self.user_id}, Quiz: {self.quiz_id}, Points: {self.points}>'