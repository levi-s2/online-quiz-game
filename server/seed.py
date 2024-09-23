from models import db, User, Category, Quiz, Question, Option
from app import app

def seed_database():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Create Categories
        categories = [
            Category(name="math"),
            Category(name="science"),
            Category(name="history"),
            Category(name="music"),
            Category(name="general knowledge")
        ]
        db.session.add_all(categories)
        db.session.commit()

        # Create Users
        user = User(username="test_user")
        user.password_hash = "password123"
        db.session.add(user)
        db.session.commit()

        # Create a quiz for each category
        quizzes = []
        
        # Math Quiz
        math_quiz = Quiz(user_id=user.id, category_id=categories[0].id)
        db.session.add(math_quiz)
        db.session.commit()

        math_question = Question(text="What is 2 + 2?", quiz_id=math_quiz.id)
        db.session.add(math_question)
        db.session.commit()

        math_options = [
            Option(text="3", is_correct=False, question_id=math_question.id),
            Option(text="4", is_correct=True, question_id=math_question.id),
            Option(text="5", is_correct=False, question_id=math_question.id),
            Option(text="6", is_correct=False, question_id=math_question.id),
            Option(text="7", is_correct=False, question_id=math_question.id)
        ]
        db.session.add_all(math_options)
        db.session.commit()

        # Science Quiz
        science_quiz = Quiz(user_id=user.id, category_id=categories[1].id)
        db.session.add(science_quiz)
        db.session.commit()

        science_question = Question(text="What planet is closest to the Sun?", quiz_id=science_quiz.id)
        db.session.add(science_question)
        db.session.commit()

        science_options = [
            Option(text="Earth", is_correct=False, question_id=science_question.id),
            Option(text="Mars", is_correct=False, question_id=science_question.id),
            Option(text="Venus", is_correct=False, question_id=science_question.id),
            Option(text="Mercury", is_correct=True, question_id=science_question.id),
            Option(text="Jupiter", is_correct=False, question_id=science_question.id)
        ]
        db.session.add_all(science_options)
        db.session.commit()

        # History Quiz
        history_quiz = Quiz(user_id=user.id, category_id=categories[2].id)
        db.session.add(history_quiz)
        db.session.commit()

        history_question = Question(text="Who was the first president of the United States?", quiz_id=history_quiz.id)
        db.session.add(history_question)
        db.session.commit()

        history_options = [
            Option(text="Thomas Jefferson", is_correct=False, question_id=history_question.id),
            Option(text="Abraham Lincoln", is_correct=False, question_id=history_question.id),
            Option(text="George Washington", is_correct=True, question_id=history_question.id),
            Option(text="John Adams", is_correct=False, question_id=history_question.id),
            Option(text="James Madison", is_correct=False, question_id=history_question.id)
        ]
        db.session.add_all(history_options)
        db.session.commit()

        # Music Quiz
        music_quiz = Quiz(user_id=user.id, category_id=categories[3].id)
        db.session.add(music_quiz)
        db.session.commit()

        music_question = Question(text="Who composed The Four Seasons?", quiz_id=music_quiz.id)
        db.session.add(music_question)
        db.session.commit()

        music_options = [
            Option(text="Bach", is_correct=False, question_id=music_question.id),
            Option(text="Vivaldi", is_correct=True, question_id=music_question.id),
            Option(text="Mozart", is_correct=False, question_id=music_question.id),
            Option(text="Beethoven", is_correct=False, question_id=music_question.id),
            Option(text="Schubert", is_correct=False, question_id=music_question.id)
        ]
        db.session.add_all(music_options)
        db.session.commit()

        # General Knowledge Quiz
        general_knowledge_quiz = Quiz(user_id=user.id, category_id=categories[4].id)
        db.session.add(general_knowledge_quiz)
        db.session.commit()

        general_knowledge_question = Question(text="What is the capital of France?", quiz_id=general_knowledge_quiz.id)
        db.session.add(general_knowledge_question)
        db.session.commit()

        general_knowledge_options = [
            Option(text="Berlin", is_correct=False, question_id=general_knowledge_question.id),
            Option(text="Rome", is_correct=False, question_id=general_knowledge_question.id),
            Option(text="Paris", is_correct=True, question_id=general_knowledge_question.id),
            Option(text="Madrid", is_correct=False, question_id=general_knowledge_question.id),
            Option(text="London", is_correct=False, question_id=general_knowledge_question.id)
        ]
        db.session.add_all(general_knowledge_options)
        db.session.commit()

if __name__ == "__main__":
    seed_database()
