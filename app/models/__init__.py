# -*- coding: utf-8 -*-

from flask_sqlalchemy import SQLAlchemy, BaseQuery
from contextlib import contextmanager


class MySqlAlchemy(SQLAlchemy):
    @contextmanager
    def auto_commit(self):
        try:
            yield
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise e


class MyQuery(BaseQuery):
    def filter_by(self, **kwargs):
        if 'status' not in kwargs.keys():
            kwargs['status'] = 1
        return super(MyQuery, self).filter_by(**kwargs)


mydb = MySqlAlchemy(query_class=MyQuery)

