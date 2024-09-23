from models import db, User, Category, Quiz, Question, Option
from app import app

def seed_database():
    # First, drop all tables and recreate them
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Create categories
        math_category = Category(name="math")
        science_category = Category(name="science")
        history_category = Category(name="history")
        music_category = Category(name="music")
        general_knowledge_category = Category(name="general knowledge")

        db.session.add_all([math_category, science_category, history_category, music_category, general_knowledge_category])
        db.session.commit()

        # Create a sample user
        user = User(username="testuser")
        user.password_hash = "password123"
        db.session.add(user)
        db.session.commit()

        # Create quizzes with questions and options
        def create_quiz_with_questions_and_options(category, quiz_text, questions):
            quiz = Quiz(category_id=category.id, user_id=user.id)
            db.session.add(quiz)
            db.session.commit()

            for question_text, options_data in questions:
                question = Question(quiz_id=quiz.id, text=question_text)
                db.session.add(question)
                db.session.commit()

                for option_text, is_correct in options_data:
                    option = Option(question_id=question.id, text=option_text, is_correct=is_correct)
                    db.session.add(option)

        # Seed quizzes for each category
        create_quiz_with_questions_and_options(
            math_category,
            "Math Quiz",
            [
                ("What is 2 + 2?", [("1", False), ("2", False), ("3", False), ("4", True), ("5", False)]),
                ("What is 5 * 5?", [("10", False), ("15", False), ("20", False), ("25", True), ("30", False)])
            ]
        )

        create_quiz_with_questions_and_options(
            science_category,
            "Science Quiz",
            [
                ("What planet is known as the Red Planet?", [("Earth", False), ("Mars", True), ("Jupiter", False), ("Venus", False), ("Saturn", False)]),
                ("What is the chemical symbol for water?", [("H2O", True), ("O2", False), ("CO2", False), ("N2", False), ("HO", False)])
            ]
        )

        create_quiz_with_questions_and_options(
            history_category,
            "History Quiz",
            [
                ("Who was the first President of the United States?", [("George Washington", True), ("Abraham Lincoln", False), ("Thomas Jefferson", False), ("John Adams", False), ("Alexander Hamilton", False)]),
                ("In which year did World War II end?", [("1940", False), ("1942", False), ("1945", True), ("1950", False), ("1955", False)])
            ]
        )

        create_quiz_with_questions_and_options(
            music_category,
            "Music Quiz",
            [
                ("Who is known as the 'King of Pop'?", [("Elvis Presley", False), ("Michael Jackson", True), ("Prince", False), ("Madonna", False), ("Whitney Houston", False)]),
                ("What musical instrument has 88 keys?", [("Piano", True), ("Guitar", False), ("Violin", False), ("Drums", False), ("Saxophone", False)])
            ]
        )

        create_quiz_with_questions_and_options(
            general_knowledge_category,
            "General Knowledge Quiz",
            [
                ("What is the capital of France?", [("Berlin", False), ("Madrid", False), ("Paris", True), ("Rome", False), ("London", False)]),
                ("Which is the largest ocean on Earth?", [("Atlantic Ocean", False), ("Indian Ocean", False), ("Pacific Ocean", True), ("Southern Ocean", False), ("Arctic Ocean", False)])
            ]
        )

        # Commit all changes to the database
        db.session.commit()

if __name__ == '__main__':
    seed_database()
