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
    time_interval = Column(Integer)
    create_time = Column(DateTime)
    update_time = Column(DateTime)

    """
    id: int 主键
    username: varchar 用户名
    tile_map_ip: varchar 瓦片地图ip
    tile_map_port: varchar 瓦片地图端口
    map_init_lon: float 地图初始经度
    map_init_lat: float 地图初始纬度
    map_init_zoom: float 地图初始层级
    map_init_height: float 地图初始高度（三维）
    time_interval: int 数据更新频度
    create_time: datetime 创建时间
    update_time: datetime 更新时间
    """

    # 根据用户获取当前配置
    @staticmethod
    def get_config_by_username(username):
        return db.session.query(ConfigModel).filter_by(username=username).first()

    # 新增配置方法
    @staticmethod
    def add_config(config):
        db.session.add(config)
        db.session.commit()

    # 删除配置方法
    @staticmethod
    def delete_config(config):
        db.session.delete(config)
        db.session.commit()

    # 更新配置方法
    @staticmethod
    def update_config():
        db.session.commit()
