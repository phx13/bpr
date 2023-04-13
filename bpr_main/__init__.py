from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# 创建sqlalchemy实例
db = SQLAlchemy()
# 创建app实例
app = Flask(__name__, template_folder='views', static_url_path='/', static_folder='resources')
# 配置mysql
app.config['SECRET_KEY'] = '\xca\x0c\x86\x04\x98@\x02b\x1b7\x8c\x88]\x1b\xd7"+\xe6px@\xc3#\\'
app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql+pymysql://root:123456@localhost:3306/bpr?charset=utf8'
app.config['SQLALCHEMY_POOL_SIZE'] = 1000
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# 使用app集成化的方式初始化sqlalchemy
db.init_app(app)


@app.before_request
def before_request():
    pass


from bpr_main.controllers.index_controller import index_bp

app.register_blueprint(index_bp)
