"""
登录表单
author：phx
"""

from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField, PasswordField


class LoginForm(FlaskForm):
    username = StringField('用户名')
    password = PasswordField('密码')
    submit = SubmitField('登录')
