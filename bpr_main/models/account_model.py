"""
账号数据模型
author：phx
"""
from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, DateTime

from bpr_main import db


# 用户信息类，继承UserMixin类，支持flask-login组件
class AccountModel(db.Model, UserMixin):
    id = Column(Integer, primary_key=True)
    username = Column(String(32), unique=True, nullable=False)
    password = Column(String(32))
    board_id = Column(String(8))
    is_admin = Column(Integer)
    create_time = Column(DateTime)
    update_time = Column(DateTime)

    """
    id: int 主键
    username: varchar 用户名
    password: varchar 密码
    board_id: varchar 所属舰船
    is_admin: int 是否是管理员，{1：是，0：不是}
    create_time: datetime 创建时间
    update_time: datetime 更新时间
    """
    def get_id(self):
        return self.username

    # 查找所有用户方法
    @staticmethod
    def get_all_account():
        return db.session.query(AccountModel).all()

    # 按舰船查找所有用户方法
    @staticmethod
    def get_account_by_board_id(board_id):
        return db.session.query(AccountModel).filter_by(board_id=board_id).all()

    # 按用户名查找用户方法
    @staticmethod
    def get_account_by_username(username):
        return db.session.query(AccountModel).filter_by(username=username).first()

    # 新增用户方法
    @staticmethod
    def add_account(account):
        db.session.add(account)
        db.session.commit()

    # 删除用户方法
    @staticmethod
    def delete_account(account):
        db.session.delete(account)
        db.session.commit()

    # 更新用户方法
    @staticmethod
    def update_account():
        db.session.commit()
