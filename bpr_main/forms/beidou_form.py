"""
北斗表单
author：phx
"""

from flask_wtf import FlaskForm
from wtforms import StringField


class BeidouForm(FlaskForm):
    beidou_id = StringField('北斗编号')
    board_id = StringField('所属舰船')
    position_x = StringField('x坐标')
    position_y = StringField('y坐标')
    position_z = StringField('z坐标')
    mode = StringField('工作模式')
