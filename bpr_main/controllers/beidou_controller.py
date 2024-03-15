"""
北斗管理控制器
author：phx
"""
import time

from flask import Blueprint, render_template, request
from flask_login import login_required

from bpr_main.forms.beidou_form import BeidouForm
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
    form = BeidouForm()
    return render_template('beidou.html', form=form)


# 获取指定舰船上所有北斗数传
@beidou_bp.route('/beidou/beidou_list/board/<board_id>')
def load_board_beidou_list(board_id):
    beidou_list = BeidouModel.get_beidou_by_board_id(board_id)
    return SerializationHelper.join_model_to_list(beidou_list)

# 新增北斗数传信息
@beidou_bp.route('/beidou/data/add', methods=['POST'])
def add_beidou():
    # 创建新北斗数传信息
    beidou = BeidouModel()
    beidou.beidou_id = request.form.get('beidouId').strip()
    beidou.board_id = request.form.get('boardId').strip()
    beidou.position_x = request.form.get('beidouPositionX').strip()
    beidou.position_y = request.form.get('beidouPositionY').strip()
    beidou.position_z = request.form.get('beidouPositionZ').strip()
    beidou.mode = request.form.get('mode').strip()
    beidou.create_time = time.strftime('%Y-%m-%d %H:%M:%S')
    beidou.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
    # 添加北斗数传信息
    BeidouModel.add_beidou(beidou)
    return '北斗数传信息添加成功\n北斗数传号：' + beidou.beidou_id


# 新增北斗数传信息
@beidou_bp.route('/beidou/data/update/<id>', methods=['POST'])
def update_beidou_by_id(id):
    # 根据主键id查找北斗数传
    beidou = BeidouModel.get_beidou_by_id(id)
    # 如果北斗数传存在
    if beidou:
        # 修改该北斗数传信息
        beidou.beidou_id = request.form.get('beidouId').strip()
        beidou.board_id = request.form.get('boardId').strip()
        beidou.position_x = request.form.get('beidouPositionX').strip()
        beidou.position_y = request.form.get('beidouPositionY').strip()
        beidou.position_z = request.form.get('beidouPositionZ').strip()
        beidou.mode = request.form.get('mode').strip()
        beidou.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
        # 更新北斗数传信息
        BeidouModel.update_beidou()
    return '北斗数传信息更新成功\n北斗数传号：' + beidou.beidou_id


# 删除北斗数传信息
@beidou_bp.route('/beidou/data/delete', methods=['POST'])
def delete_beidou_by_id():
    # 循环待删除的北斗数传主键id
    for id, v in request.form.items():
        # 根据主键id查找北斗数传
        beidou = BeidouModel.get_beidou_by_id(id)
        # 如果北斗数传存在
        if beidou:
            # 删除北斗数传
            BeidouModel.delete_beidou(beidou)
        return '北斗数传信息删除成功\n北斗数传号：' + beidou.beidou_id
    return '删除失败'
