"""
登录注册管理控制器
author：phx
"""
import time

from flask import Blueprint, render_template, redirect, url_for
from flask_login import current_user, login_user, logout_user, login_required

from bpr_main import login_manager
from bpr_main.forms.login_form import LoginForm
from bpr_main.forms.register_form import RegisterForm
from bpr_main.models.account_model import AccountModel

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
        # 如果用户不存在或者密码错误
        if not user or form.password.data != user.password:
            # 返回页面重新登录
            return render_template('login.html', form=form)
        # 登录成功记录当前用户
        login_user(user, remember=True)
        # 登录成功返回首页
        return redirect(url_for('index_bp.index_page'))

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
