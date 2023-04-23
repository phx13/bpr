"""
舰船数据模型
author：phx
"""
from sqlalchemy import Column, Integer, String, DateTime, Float

from bpr_main import db


# 舰船model类，定义舰船自身属性
class BoardInfoModel(db.Model):
    id = Column(Integer, primary_key=True)
    board_id = Column(String(64), nullable=False)
    lon = Column(Float(4))
    lat = Column(Float(4))
    create_time = Column(DateTime)
    update_time = Column(DateTime)

    """
    id: int 主键
    board_id: varchar 舷号
    lon: float 经度
    lat: float 纬度
    create_time: datetime 创建时间
    update_time: datetime 更新时间
    """

    @staticmethod
    def get_board_info_by_board_id(board_id):
        return db.session.query(BoardInfoModel).filter_by(board_id=board_id).order_by(BoardInfoModel.update_time).all()
