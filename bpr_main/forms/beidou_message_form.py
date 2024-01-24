"""
北斗短报文表单
author：phx
"""

from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField, TextAreaField


class BeidouMessageForm(FlaskForm):
    target_card_id = StringField('发送地址')
    host_card_id = StringField('主机地址', render_kw={'readonly': True})
    interval = StringField('消息频度', render_kw={'readonly': True})
    stars = StringField('星力指数', render_kw={'readonly': True})
    message = TextAreaField('报文消息')
    submit = SubmitField('发送')
