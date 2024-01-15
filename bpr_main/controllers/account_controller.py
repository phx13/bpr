"""
用户管理控制器
author：phx
"""
import time

from flask import Blueprint, render_template, redirect, url_for
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
