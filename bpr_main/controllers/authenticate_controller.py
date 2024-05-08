"""
登录注册管理控制器
author：phx
"""
import time

from flask import Blueprint, render_template, redirect, url_for, request
from flask_login import current_user, login_user, logout_user, login_required

from bpr_main import login_manager
from bpr_main.forms.login_form import LoginForm
from bpr_main.forms.register_form import RegisterForm
from bpr_main.models.account_model import AccountModel
from bpr_main.models.config_model import ConfigModel

authenticate_bp = Blueprint('authenticate_bp', __name__)
# 设置登录页面，当访问任何需要登录但未登录的url时，返回此页面
login_manager.login_view = 'authenticate_bp.login'


# 用户读取回调方法
@login_manager.user_loader
def load_user(username):
    return AccountModel.get_account_by_username(username)


# 登录接口
@authenticate_bp.route('/login', methods=['GET', 'POST'])
def login():
    # 如果当前用户已经登录
    if current_user.is_authenticated:
        # 重定向到首页
        return redirect(url_for('index_bp.index_page'))

    # 生成登录表单实例
    form = LoginForm()
    # 获取登录提交事件
    if form.validate_on_submit():
        # 获取登录用户
        user = AccountModel.get_account_by_username(form.username.data)
        # 如果用户存在并且密码正确
        if user and form.password.data == user.password:
            # 登录成功记录当前用户
            login_user(user, remember=True)
            arg_next = request.args.get('next')
            if not arg_next or not arg_next.startswith('/'):
                arg_next = url_for('index_bp.index_page')
            return redirect(arg_next)
        elif not user:
            return '用户不存在'
        elif form.password.data != user.password:
            return '用户名或密码错误'
    return render_template('login.html', form=form)


# 注册方法
@authenticate_bp.route('/register', methods=['GET', 'POST'])
def register():
    # 生成注册表单实例
    form = RegisterForm()
    # 获取注册提交事件
    if form.validate_on_submit():
        # 获取注册用户
        user = AccountModel.get_account_by_username(form.username.data)
        # 如果用户已存在或者密码不符
        if user or form.password.data != form.confirm.data:
            return render_template('register.html', form=form)

        # 创建新用户
        user = AccountModel()
        user.username = form.username.data
        user.password = form.password.data
        user.board_id = form.board_id.data
        user.is_admin = form.is_admin.data
        user.create_time = time.strftime('%Y-%m-%d %H:%M:%S')
        user.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
        # 添加新用户
        AccountModel.add_account(user)

        # 添加一个默认的配置项
        user_config = ConfigModel()
        user_config.username = user.username
        user_config.tile_map_ip = '127.0.0.1'
        user_config.tile_map_port = '6677'
        user_config.map_init_lon = 110
        user_config.map_init_lat = 30
        user_config.map_init_zoom = 4
        user_config.map_init_height = 9000000
        user_config.time_interval = 10000
        user_config.create_time = time.strftime('%Y-%m-%d %H:%M:%S')
        user_config.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
        # 添加用户配置项
        ConfigModel.add_config(user_config)

        # 登录成功记录当前用户
        login_user(user, remember=True)
        # 登录成功返回首页
        return redirect(url_for('index_bp.index_page'))

    return render_template('register.html', form=form)


# 登出方法
@authenticate_bp.route('/logout')
@login_required
def logout():
    # 注销用户
    logout_user()
    return redirect(url_for('authenticate_bp.login'))
