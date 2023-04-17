from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, DateTime

from bpr_main import db


# 用户信息类，继承UserMixin类，支持flask-login组件
class AccountModel(db.Model, UserMixin):
    id = Column(Integer, primary_key=True)
    username = Column(String(64), unique=True, nullable=False)
    password = Column(String(64))
    create_time = Column(DateTime)
    update_time = Column(DateTime)

    """
    id: int 主键
    username: varchar 用户名
    password: varchar 密码
    create_time: datetime 创建时间
    update_time: datetime 更新时间
    """

    # 按用户名查找用户方法
    @staticmethod
    def search_account_by_username(username):
        return db.session.query(AccountModel).filter_by(username=username).first()


