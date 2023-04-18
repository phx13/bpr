"""
舰船数据模型
author：phx
"""
from sqlalchemy import Column, Integer, String, DateTime

from bpr_main import db


# 舰船model类，定义舰船自身属性
class BoardModel(db.Model):
    id = Column(Integer, primary_key=True)
    board_id = Column(String(64), unique=True, nullable=False)
    board_name = Column(String(64))
    create_time = Column(DateTime)
    update_time = Column(DateTime)

    """
    id: int 主键
    board_id: int 舷号
    board_name: varchar 舰名
    create_time: datetime 创建时间
    update_time: datetime 更新时间
    """
