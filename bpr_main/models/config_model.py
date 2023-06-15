"""
全局配置模型
author：phx
"""
from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy_serializer import SerializerMixin

from bpr_main import db


# 全局配置类，储存用户的全局配置
class ConfigModel(db.Model, SerializerMixin):
    id = Column(Integer, primary_key=True)
    username = Column(String(32), unique=True, nullable=False)
    tile_map_ip = Column(String(32))
    tile_map_port = Column(String(8))
    map_init_lon = Column(Float(4))
    map_init_lat = Column(Float(4))
    map_init_zoom = Column(Float(4))
    map_init_height = Column(Float(4))
    create_time = Column(DateTime)
    update_time = Column(DateTime)

    """
    id: int 主键
    board_id: varchar 舷号
    board_name: varchar 舰名
    create_time: datetime 创建时间
    update_time: datetime 更新时间
    """

    @staticmethod
    def get_config_by_username(username):
        return db.session.query(ConfigModel).filter_by(username=username).first().to_dict()
