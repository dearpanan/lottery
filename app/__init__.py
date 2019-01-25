# -*- coding: utf-8 -*-

from flask import Flask

from flask_login import LoginManager
from flask_mail import Mail
from app.models import mydb
from app.libs.utils import get_logger
from app.models.lotteries import LotterySsc, Lottery5In11

login_manager = LoginManager()
my_mail = Mail()


def create_app():
    app = Flask(__name__)
    app.config.from_object('app.setting')
    app.config.from_object('app.secure')
    register_blueprints(app)

    # init lottery data
    LotterySsc.init_lottery_info()
    Lottery5In11.init_lottery_info()

    # init db
    mydb.init_app(app)
    mydb.create_all(app=app)
    my_mail.init_app(app)

    # init login manager
    login_manager.init_app(app)
    login_manager.login_view = 'web.login'
    login_manager.login_message = '请先登陆或注册！'

    return app


def register_blueprints(app):
    from app.web.auth import web
    app.register_blueprint(web)

