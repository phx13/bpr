"""
注册表单
author：phx
"""

from flask_wtf import FlaskForm
from wtforms import StringField


class TerminalForm(FlaskForm):
    terminal_id = StringField('终端编号')
    board_id = StringField('所属舰船')
    mode = StringField('工作模式')
    battery = StringField('剩余电量')
    # submit = SubmitField('注册')
