from models import db, User, Category, Quiz, Question, Answer, Score
from app import app, bcrypt

def seed_database():
    with app.app_context():
        db.drop_all()
        db.create_all()

        categories = [
            Category(name="math"),
            Category(name="science"),
            Category(name="history"),
            Category(name="music"),
            Category(name="general knowledge")
        ]
        db.session.add_all(categories)
        db.session.commit()

        user1 = User(username="johndoe")
        user1.password_hash = "securepassword" 
        db.session.add(user1)
        db.session.commit()


        math_category = Category.query.filter_by(name="math").first()
        science_category = Category.query.filter_by(name="science").first()

        quiz1 = Quiz(user_id=user1.id, category_id=math_category.id)  
        quiz2 = Quiz(user_id=None, category_id=science_category.id)  
        
        db.session.add_all([quiz1, quiz2])
        db.session.commit()

        question1 = Question(quiz_id=quiz1.id, text="What is 2 + 2?")
        db.session.add(question1)
        db.session.commit()

        answer1 = Answer(question_id=question1.id, text="3", is_correct=False)
        answer2 = Answer(question_id=question1.id, text="4", is_correct=True)
        answer3 = Answer(question_id=question1.id, text="5", is_correct=False)

        db.session.add_all([answer1, answer2, answer3])
        db.session.commit()

        question2 = Question(quiz_id=quiz2.id, text="What planet is known as the Red Planet?")
        db.session.add(question2)
        db.session.commit()

        answer4 = Answer(question_id=question2.id, text="Earth", is_correct=False)
        answer5 = Answer(question_id=question2.id, text="Mars", is_correct=True)
        answer6 = Answer(question_id=question2.id, text="Jupiter", is_correct=False)

        db.session.add_all([answer4, answer5, answer6])
        db.session.commit()

        print("Database seeded successfully!")


if __name__ == "__main__":
    seed_database()
