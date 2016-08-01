# -*- encoding=UTF-8 -*-

from mystagram import app, db
from flask_script import Manager
from sqlalchemy import or_,and_
from mystagram.models import User, Image, Comment
import random, unittest, tests

manager = Manager(app)

def get_image_url():
    return 'http://images.nowcoder.com/head/' + str(random.randint(0,1000)) +  'm.png'

@manager.command
def run_test():
    #init_database()
    db.drop_all()
    db.create_all()
    tests = unittest.TestLoader().discover('./')
    unittest.TextTestRunner().run(tests)

@manager.command
def init_database():
    db.drop_all()
    db.create_all()
    db.session.commit()


if __name__ == '__main__':
    manager.run()