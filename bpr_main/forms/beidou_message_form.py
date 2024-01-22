"""
北斗短报文表单
author：phx
"""

from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField, TextAreaField


class BeidouMessageForm(FlaskForm):
    target_card_id = StringField('目标北斗卡号')
    host_card_id = StringField('主机北斗卡号')
    interval = StringField('消息频度')
    message = TextAreaField('北斗短报文')
    submit = SubmitField('发送')
