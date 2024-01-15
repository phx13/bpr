"""
北斗消息模型
author：phx
"""
from sqlalchemy import Column, Integer, String, DateTime

from bpr_main import db


# 北斗消息model类
class BeidouMessageModel(db.Model):
    id = Column(Integer, primary_key=True)
    host_card_id = Column(String(8))
    target_card_id = Column(String(8))
    message = Column(String(8))
    create_time = Column(DateTime)
    update_time = Column(DateTime)

    """
    id: int 主键
    host_card_id: varchar 主机卡号
    target_card_id: varchar 目标卡号
    message：varchar 消息
    create_time: datetime 创建时间
    update_time: datetime 更新时间
    """

    # 查找所有北斗数传方法
    @staticmethod
    def get_all_message():
        return db.session.query(BeidouMessageModel).all()

    # 获取指定北斗卡号发出的所有消息
    @staticmethod
    def get_message_by_host_card_id(host_card_id):
        return db.session.query(BeidouMessageModel).filter_by(host_card_id=host_card_id).all()

    # 获取指定北斗卡号接收的所有消息
    @staticmethod
    def get_message_by_target_card_id(target_card_id):
        return db.session.query(BeidouMessageModel).filter_by(target_card_id=target_card_id).all()

    # 新增北斗消息方法
    @staticmethod
    def add_beidou_message(beidou_message):
        db.session.add(beidou_message)
        db.session.commit()

    # 删除北斗消息方法
    @staticmethod
    def delete_beidou_message(beidou_message):
        db.session.delete(beidou_message)
        db.session.commit()

    # 更新北斗消息方法
    @staticmethod
    def update_beidou_message():
        db.session.commit()
