"""
终端室内定位数据模型
author：phx
"""
from sqlalchemy import Column, Integer, String, DateTime, Float

from bpr_main import db


# 终端数据模型
class TerminalIndoorInfoModel(db.Model):
    id = Column(Integer, primary_key=True)
    terminal_id = Column(String(24), nullable=False)
    position_x = Column(Float(2))
    position_y = Column(Float(2))
    position_z = Column(Float(2))
    create_time = Column(DateTime)
    update_time = Column(DateTime)

    """
    id: int 主键
    terminal_id: varchar 终端号
    position_x: float 室内定位x坐标
    position_y: float 室内定位y坐标
    position_z: float 室内定位z坐标
    create_time: datetime 创建时间
    update_time: datetime 更新时间
    """

    # 根据终端号查找该终端全部室内定位信息方法
    @staticmethod
    def get_terminal_indoor_info_by_terminal_id(terminal_id):
        return db.session.query(TerminalIndoorInfoModel).filter_by(terminal_id=terminal_id).order_by(
            TerminalIndoorInfoModel.update_time).all()

    # 新增终端方法
    @staticmethod
    def add_terminal_indoor_info(terminal_indoor_info):
        db.session.add(terminal_indoor_info)
        db.session.commit()

    # 删除终端方法
    @staticmethod
    def delete_terminal_indoor_info(terminal_indoor_info):
        db.session.delete(terminal_indoor_info)
        db.session.commit()

    # 更新终端方法
    @staticmethod
    def update_terminal_indoor_info():
        db.session.commit()
