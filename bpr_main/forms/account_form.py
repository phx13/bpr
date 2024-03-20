"""
个人信息表单
author：phx
"""

from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField, PasswordField, BooleanField


class AccountForm(FlaskForm):
    username = StringField('用户名')
    password = PasswordField('密码')
    confirm = PasswordField('确认密码')
    board_id = StringField('所属舰船')
    is_admin = BooleanField('是否是管理员')
    submit = SubmitField('更新')
