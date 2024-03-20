"""
用户管理控制器
author：phx
"""
import time

from flask import Blueprint, render_template, redirect, url_for, request
from flask_login import login_required

from bpr_main.forms.account_form import AccountForm
from bpr_main.models.account_model import AccountModel
from bpr_main.utils.serialization_helper import SerializationHelper

account_bp = Blueprint('account_bp', __name__)


@account_bp.before_request
@login_required
def before_request():
    pass


@account_bp.route('/account', methods=['GET', 'POST'])
def account_page():
    form = AccountForm()
    # 获取更新用户事件
    if form.validate_on_submit():
        # 获取当前用户
        user = AccountModel.get_account_by_username(form.username.data)
        user.password = form.password.data
        user.board_id = form.board_id.data
        user.is_admin = form.is_admin.data
        user.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
        # 更新用户
        AccountModel.update_account()
        # 登录成功返回首页
        return redirect(url_for('account_bp.account_page'))
    return render_template('account.html', form=form)


@account_bp.route('/account/board/<board_id>')
def load_board_account_list(board_id):
    account_list = AccountModel.get_account_by_board_id(board_id)
    return SerializationHelper.model_to_list(account_list)

# 新增用户信息
@account_bp.route('/account/data/add', methods=['POST'])
def add_account():
    # 创建新用户信息
    account = AccountModel()
    account.username = request.form.get('username').strip()
    account.board_id = request.form.get('boardId').strip()
    account.position_x = request.form.get('accountPositionX').strip()
    account.position_y = request.form.get('accountPositionY').strip()
    account.position_z = request.form.get('accountPositionZ').strip()
    account.mode = request.form.get('mode').strip()
    account.create_time = time.strftime('%Y-%m-%d %H:%M:%S')
    account.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
    # 添加用户信息
    AccountModel.add_account(account)
    return '用户信息添加成功\n用户号：' + account.username


# 新增用户信息
@account_bp.route('/account/data/update/<id>', methods=['POST'])
def update_account_by_id(id):
    # 根据主键id查找用户
    account = AccountModel.get_account_by_id(id)
    # 如果用户存在
    if account:
        # 修改该用户信息
        account.username = request.form.get('username').strip()
        account.board_id = request.form.get('boardId').strip()
        account.position_x = request.form.get('accountPositionX').strip()
        account.position_y = request.form.get('accountPositionY').strip()
        account.position_z = request.form.get('accountPositionZ').strip()
        account.mode = request.form.get('mode').strip()
        account.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
        # 更新用户信息
        AccountModel.update_account()
    return '用户信息更新成功\n用户号：' + account.username


# 删除用户信息
@account_bp.route('/account/data/delete', methods=['POST'])
def delete_account_by_id():
    # 循环待删除的用户主键id
    for id, v in request.form.items():
        # 根据主键id查找用户
        account = AccountModel.get_account_by_id(id)
        # 如果用户存在
        if account:
            # 删除用户
            AccountModel.delete_account(account)
        return '用户信息删除成功\n用户号：' + account.username
    return '删除失败'


@account_bp.route('/account/data/load/<id>', methods=['GET'])
def load_account_by_id(id):
    # 根据用户主键id查找用户
    account = AccountModel.get_account_by_id(id)
    # 如果用户存在
    if account:
        # 返回用户信息
        return SerializationHelper.model_to_list([account])
    return '获取失败'