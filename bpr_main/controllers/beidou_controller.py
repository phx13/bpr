"""
蓝牙管理控制器
author：phx
"""

from flask import Blueprint, render_template
from flask_login import login_required

from bpr_main.models.beidou_model import BeidouModel
from bpr_main.utils.serialization_helper import SerializationHelper

beidou_bp = Blueprint('beidou_bp', __name__)


@beidou_bp.before_request
@login_required
def before_request():
    pass


# 渲染北斗数传页面
@beidou_bp.route('/beidou')
def beidou_page():
    return render_template('beidou.html')


# 获取指定舰船上所有蓝牙基站
@beidou_bp.route('/beidou/beidou_list/board/<board_id>')
def load_board_beidou_list(board_id):
    beidou_list = BeidouModel.get_beidou_by_board_id(board_id)
    return SerializationHelper.join_model_to_list(beidou_list)
