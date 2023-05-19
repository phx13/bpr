"""
应用初始化程序
author：phx
"""
import os

from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

"""
数据库初始化部分
"""
# 创建sqlalchemy实例
db = SQLAlchemy()

# 创建app实例，设置文件夹路径
app = Flask(__name__, template_folder='views', static_url_path='/', static_folder='resources')

# 配置mysql
app.config['SECRET_KEY'] = os.urandom(32)
# app.config['SECRET_KEY'] = '\xca\x0c\x86\x04\x98@\x02b\x1b7\x8c\x88]\x1b\xd7"+\xe6px@\xc3#\\'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI')
# app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql+pymysql://root:123456@localhost:3306/bpr?charset=utf8'
app.config['SQLALCHEMY_POOL_SIZE'] = 1000
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 使用app集成化的方式初始化sqlalchemy
db.init_app(app)

# 引入所有数据表
from bpr_main.models.account_model import AccountModel
from bpr_main.models.board_model import BoardModel
from bpr_main.models.board_info_model import BoardInfoModel

with app.app_context():
    db.create_all()

"""
请求初始化部分
"""
# 解决跨域
CORS(app, supports_credentials=True)

# 注册登录管理模块
login_manager = LoginManager()
login_manager.init_app(app)

"""
蓝图初始化部分
"""
# 注册所有蓝图
from bpr_main.controllers.index_controller import index_bp
from bpr_main.controllers.account_controller import account_bp
from bpr_main.controllers.authenticate_controller import authenticate_bp
from bpr_main.controllers.indoor_controller import indoor_bp
from bpr_main.controllers.earth_controller import earth_bp
from bpr_main.controllers.map_controller import map_bp

app.register_blueprint(index_bp)
app.register_blueprint(account_bp)
app.register_blueprint(authenticate_bp)
app.register_blueprint(indoor_bp)
app.register_blueprint(earth_bp)
app.register_blueprint(map_bp)
