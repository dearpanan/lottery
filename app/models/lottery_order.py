# -*- coding: utf-8 -*-

from math import floor
from . import mydb
from datetime import datetime


from sqlalchemy import Column, Integer, String, SmallInteger
from flask_login import UserMixin
from app import login_manager


class User(UserMixin, mydb.Model):
    id = Column(Integer, primary_key=True)
    order_time = Column('create_time', Integer)
    lottery_type = Column(Integer, nullable=False)
    play_type = Column(Integer, nullable=False)
    content = Column(String(100), unique=True, nullable=False)

    status = Column(SmallInteger, default=1)
    _password = Column('password', String(128), nullable=False)

    balance = Column(Integer, default=0)

    wx_open_id = Column(String(50))
    wx_name = Column(String(32))