"""
北斗卡模型
author：phx
"""
from sqlalchemy import Column, Integer, String, DateTime, Float

from bpr_main import db


# 北斗卡model类，定义北斗卡属性
class CardModel(db.Model):
    id = Column(Integer, primary_key=True)
    card_id = Column(String(8), unique=True, nullable=False)
    beidou_id = Column(String(8))
    interval = Column(Integer)
    create_time = Column(DateTime)
    update_time = Column(DateTime)

    """
    id: int 主键
    card_id: varchar 北斗卡id
    beidou_id: varchar 北斗数传id
    interval：int 频度
    create_time: datetime 创建时间
    update_time: datetime 更新时间
    """

    # 查找所有北斗卡方法
    @staticmethod
    def get_all_card():
        return db.session.query(CardModel).all()

    # 获取指定北斗卡
    @staticmethod
    def get_card_by_card_id(card_id):
        return db.session.query(CardModel).filter_by(card_id=card_id).first()
