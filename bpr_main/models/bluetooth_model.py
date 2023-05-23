"""
蓝牙基站模型
author：phx
"""
from sqlalchemy import Column, Integer, String, DateTime, Float

from bpr_main import db


# 蓝牙model类，定义蓝牙自身属性
class BluetoothModel(db.Model):
    id = Column(Integer, primary_key=True)
    bluetooth_id = Column(String(8), unique=True, nullable=False)
    board_id = Column(String(8))
    position_x = Column(Float(2))
    position_y = Column(Float(2))
    position_z = Column(Float(2))
    create_time = Column(DateTime)
    update_time = Column(DateTime)

    """
    id: int 主键
    bluetooth_id: varchar 蓝牙号
    board_id: varchar 舷号
    position_x：float 蓝牙x坐标
    position_y：float 蓝牙y坐标
    position_z：float 蓝牙z坐标
    create_time: datetime 创建时间
    update_time: datetime 更新时间
    """

    # 查找所有蓝牙方法
    @staticmethod
    def get_all_bluetooth():
        return db.session.query(BluetoothModel).all()

    # 根据蓝牙号查找蓝牙方法
    @staticmethod
    def get_bluetooth_by_bluetooth_id(bluetooth_id):
        return db.session.query(BluetoothModel).filter_by(bluetooth_id=bluetooth_id).first()

    # 根据舷号查找蓝牙方法
    @staticmethod
    def get_bluetooth_by_board_id(board_id):
        return db.session.query(BluetoothModel).filter_by(board_id=board_id).all()

    # 新增蓝牙方法
    @staticmethod
    def add_bluetooth(bluetooth):
        db.session.add(bluetooth)
        db.session.commit()

    # 删除蓝牙方法
    @staticmethod
    def delete_bluetooth(bluetooth):
        db.session.delete(bluetooth)
        db.session.commit()

    # 更新蓝牙方法
    @staticmethod
    def update_bluetooth():
        db.session.commit()
