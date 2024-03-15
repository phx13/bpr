"""
北斗数传模型
author：phx
"""
from sqlalchemy import Column, Integer, String, DateTime, Float

from bpr_main import db
from bpr_main.models.card_model import CardModel


# 北斗model类，定义北斗数传属性
class BeidouModel(db.Model):
    id = Column(Integer, primary_key=True)
    beidou_id = Column(String(8), unique=True, nullable=False)
    board_id = Column(String(8))
    position_x = Column(Float(2))
    position_y = Column(Float(2))
    position_z = Column(Float(2))
    mode = Column(Integer)
    create_time = Column(DateTime)
    update_time = Column(DateTime)

    """
    id: int 主键
    beidou_id: varchar 北斗数传id
    board_id: varchar 舷号
    position_x：float 北斗数传x坐标
    position_y：float 北斗数传y坐标
    position_z：float 北斗数传z坐标
    mode: int 0不在线，1在线
    create_time: datetime 创建时间
    update_time: datetime 更新时间
    """

    # 查找所有北斗数传方法
    @staticmethod
    def get_all_beidou():
        return db.session.query(BeidouModel).all()

    # 获取指定北斗数传设备
    @staticmethod
    def get_beidou_by_beidou_id(beidou_id):
        return db.session.query(BeidouModel).filter_by(beidou_id=beidou_id).first()

    # 获取指定舰船的北斗数传设备
    @staticmethod
    def get_beidou_by_board_id(board_id):
        return db.session.query(BeidouModel, CardModel).join(CardModel,
                                                             BeidouModel.beidou_id == CardModel.beidou_id).filter(
            BeidouModel.board_id == board_id).all()

    # 新增北斗数传方法
    @staticmethod
    def add_beidou(beidou):
        db.session.add(beidou)
        db.session.commit()

    # 删除北斗数传方法
    @staticmethod
    def delete_beidou(beidou):
        db.session.delete(beidou)
        db.session.commit()

    # 更新北斗数传方法
    @staticmethod
    def update_beidou():
        db.session.commit()
