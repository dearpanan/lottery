# -*- coding: utf-8 -*-

from math import floor
from . import mydb
from datetime import datetime
from flask import current_app
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer

from sqlalchemy import Column, Integer, String, SmallInteger
from flask_login import UserMixin
from app import login_manager


class User(UserMixin, mydb.Model):
    id = Column(Integer, primary_key=True)
    create_time = Column('create_time', Integer)
    status = Column(SmallInteger, default=1)
    rank = Column(SmallInteger, default=0)
    group = Column(SmallInteger, default=0)
    nickname = Column(String(24), nullable=False)
    phone_number = Column(String(18), unique=True)
    _password = Column('password', String(128), nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    wx_open_id = Column(String(50))
    wx_name = Column(String(32))

    def __init__(self):
        self.create_time = int(datetime.now().timestamp())

    def set_attrs(self, attrs_dict):
        for key, value in attrs_dict.items():
            if hasattr(self, key) and key != 'id':
                setattr(self, key, value)

    @property
    def create_datetime(self):
        if self.create_time:
            return datetime.fromtimestamp(self.create_time)
        else:
            return None

    def delete(self):
        self.status = 0

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, raw):
        self._password = generate_password_hash(raw)

    def check_password(self, raw):
        return check_password_hash(self._password, raw)

    def generate_token(self, expiration=600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps({'id': self.id}).decode('utf-8')

    @staticmethod
    def reset_password(token, new_password):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token.encode('utf-8'))
        except:
            return False
        uid = data.get('id')
        with mydb.auto_commit():
            user = User.query.get(uid)
            user.password = new_password
        return True

    @property
    def summary(self):
        return dict(
            nickname=self.nickname,
            email=self.email,
            rank=self.rank,
            group=self.group
        )


@login_manager.user_loader
def get_user(uid):
    return User.query.get(int(uid))

