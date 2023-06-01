"""
配置表单
author：phx
"""
from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField


class ConfigForm(FlaskForm):
    tile_map_url = StringField('地图服务地址')
    tile_map_port = StringField('地图服务端口号')
    map_init_lon = StringField('初始化经度')
    map_init_lat = StringField('初始化纬度')
    map_init_zoom = StringField('初始化层级')
    map_init_height = StringField('初始化高度')
    submit = SubmitField('更新')
