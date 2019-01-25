# -*- coding: utf-8 -*-

from . import web
from flask import render_template
from flask_login import login_required, current_user


@web.route('/', methods=['GET', 'POST'])
@login_required
def index():
    return render_template('main.html')


@web.route('/personal')
@login_required
def personal_center():
    return render_template('personal.html', user=current_user.summary)

