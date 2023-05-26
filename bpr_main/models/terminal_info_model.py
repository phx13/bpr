"""
终端数据模型
author：phx
"""
from sqlalchemy import Column, Integer, String, DateTime, Float

from bpr_main import db


# 终端数据模型
class TerminalInfoModel(db.Model):
    id = Column(Integer, primary_key=True)
    terminal_id = Column(String(8), unique=True, nullable=False)
    position_x = Column(Float(2))
    position_y = Column(Float(2))
    position_z = Column(Float(2))
    lon = Column(Float(2))
    lat = Column(Float(2))
    create_time = Column(DateTime)
    update_time = Column(DateTime)

    """
    id: int 主键
    terminal_id: varchar 终端号
    position_x: float 室内定位x坐标
    position_y: float 室内定位y坐标
    position_z: float 室内定位z坐标
    lon: float 室外定位经度
    lat: float 室外定位纬度
    create_time: datetime 创建时间
    update_time: datetime 更新时间
    """

    # 根据终端号查找终端方法
    @staticmethod
    def get_terminal_info_by_terminal_id(terminal_id):
        return db.session.query(TerminalInfoModel).filter_by(terminal_id=terminal_id).all()

    # 新增终端方法
    @staticmethod
    def add_terminal_info(terminal_info):
        db.session.add(terminal_info)
        db.session.commit()

    # 删除终端方法
    @staticmethod
    def delete_terminal_info(terminal_info):
        db.session.delete(terminal_info)
        db.session.commit()

    # 更新终端方法
    @staticmethod
    def update_terminal_info():
        db.session.commit()
