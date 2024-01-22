"""
蓝牙基站数据模型
author：phx
"""
from sqlalchemy import Column, Integer, String, DateTime

from bpr_main import db


# 蓝牙数据模型类，定义蓝牙数据
class BluetoothInfoModel(db.Model):
    id = Column(Integer, primary_key=True)
    bluetooth_id = Column(String(8), nullable=False)
    terminal_list = Column(String(256))
    create_time = Column(DateTime)
    update_time = Column(DateTime)

    """
    id: int 主键
    bluetooth_id: varchar 蓝牙号
    terminal_list：varchar 蓝牙接收到的终端列表{terminal_id: RSSI, ...}
    create_time: datetime 创建时间
    update_time: datetime 更新时间
    """

    # 获取指定蓝牙基站的全部蓝牙基站信息
    @staticmethod
    def get_bluetooth_info_by_bluetooth_id(bluetooth_id):
        return db.session.query(BluetoothInfoModel).filter_by(bluetooth_id=bluetooth_id).order_by(
            BluetoothInfoModel.update_time).all()

    # 新增蓝牙方法
    @staticmethod
    def add_bluetooth_info(bluetooth_info):
        db.session.add(bluetooth_info)
        db.session.commit()
