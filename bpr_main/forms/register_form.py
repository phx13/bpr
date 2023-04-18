"""
注册表单
author：phx
"""
from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField, PasswordField


class RegisterForm(FlaskForm):
    username = StringField('用户名')
    password = PasswordField('密码')
    confirm = PasswordField('确认密码')
    submit = SubmitField('注册')
