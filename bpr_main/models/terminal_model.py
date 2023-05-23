"""
终端索引模型
author：phx
"""
from sqlalchemy import Column, Integer, String, DateTime

from bpr_main import db


# 终端模型类，定义终端自身属性
class TerminalModel(db.Model):
    id = Column(Integer, primary_key=True)
    terminal_id = Column(String(8), unique=True, nullable=False)
    board_id = Column(String(8))
    create_time = Column(DateTime)
    update_time = Column(DateTime)

    """
    id: int 主键
    terminal_id: varchar 终端号
    board_id: varchar 舷号
    create_time: datetime 创建时间
    update_time: datetime 更新时间
    """

    # 查找所有终端方法
    @staticmethod
    def get_all_terminal():
        return db.session.query(TerminalModel).all()

    # 根据终端号查找终端方法
    @staticmethod
    def get_terminal_by_terminal_id(terminal_id):
        return db.session.query(TerminalModel).filter_by(terminal_id=terminal_id).first()

    # 根据舷号查找终端方法
    @staticmethod
    def get_terminal_by_board_id(board_id):
        return db.session.query(TerminalModel).filter_by(board_id=board_id).all()

    # 新增终端方法
    @staticmethod
    def add_terminal(terminal):
        db.session.add(terminal)
        db.session.commit()

    # 删除终端方法
    @staticmethod
    def delete_terminal(terminal):
        db.session.delete(terminal)
        db.session.commit()

    # 更新终端方法
    @staticmethod
    def update_terminal():
        db.session.commit()
