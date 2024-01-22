"""
终端室外定位数据模型
author：phx
"""
from sqlalchemy import Column, Integer, String, DateTime, Float

from bpr_main import db


# 终端数据模型
class TerminalGISInfoModel(db.Model):
    id = Column(Integer, primary_key=True)
    terminal_id = Column(String(8), unique=True, nullable=False)
    lon = Column(Float(2))
    lat = Column(Float(2))
    create_time = Column(DateTime)
    update_time = Column(DateTime)

    """
    id: int 主键
    terminal_id: varchar 终端号
    lon: float 室外定位经度
    lat: float 室外定位纬度
    create_time: datetime 创建时间
    update_time: datetime 更新时间
    """

    # 根据终端号查找终端方法
    @staticmethod
    def get_terminal_gis_info_by_terminal_id(terminal_id):
        return db.session.query(TerminalGISInfoModel).filter_by(terminal_id=terminal_id).all()

    # 新增终端方法
    @staticmethod
    def add_terminal_gis_info(terminal_gis_info):
        db.session.add(terminal_gis_info)
        db.session.commit()

    # 删除终端方法
    @staticmethod
    def delete_terminal_gis_info(terminal_gis_info):
        db.session.delete(terminal_gis_info)
        db.session.commit()

    # 更新终端方法
    @staticmethod
    def update_terminal_gis_info():
        db.session.commit()
