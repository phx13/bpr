from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField, PasswordField


class LoginForm(FlaskForm):
    username = StringField()
    password = PasswordField()
    submit = SubmitField('登录')
