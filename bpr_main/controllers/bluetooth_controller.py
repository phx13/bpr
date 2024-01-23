"""
蓝牙管理控制器
author：phx
"""
import time

from flask import Blueprint, render_template, request
from flask.json import dumps
from flask_login import login_required

from bpr_main.forms.bluetooth_form import BluetoothForm
from bpr_main.models.bluetooth_info_model import BluetoothInfoModel
from bpr_main.models.bluetooth_model import BluetoothModel
from bpr_main.utils.serialization_helper import SerializationHelper

bluetooth_bp = Blueprint('bluetooth_bp', __name__)


@bluetooth_bp.before_request
@login_required
def before_request():
    pass


# 渲染蓝牙基站页面
@bluetooth_bp.route('/bluetooth')
def bluetooth_page():
    form = BluetoothForm()
    return render_template('bluetooth.html', form=form)


# 获取指定舰船上所有蓝牙基站
@bluetooth_bp.route('/bluetooth/bluetooth_list/<board_id>')
def load_board_bluetooth_list(board_id):
    bluetooth_list = BluetoothModel.get_bluetooth_by_board_id(board_id)
    return SerializationHelper.model_to_list(bluetooth_list)


# 获取指定蓝牙基站
@bluetooth_bp.route('/bluetooth/<bluetooth_id>')
def load_bluetooth(bluetooth_id):
    bluetooth = BluetoothModel.get_bluetooth_by_bluetooth_id(bluetooth_id)
    return SerializationHelper.model_to_list(bluetooth)


# 获取指定蓝牙基站信息
@bluetooth_bp.route('/bluetooth/bluetooth_info/<bluetooth_id>')
def load_bluetooth_info(bluetooth_id):
    bluetooth_info = BluetoothInfoModel.get_bluetooth_info_by_bluetooth_id(bluetooth_id)
    return SerializationHelper.model_to_list(bluetooth_info)


# 添加蓝牙基站信息
@bluetooth_bp.route('/bluetooth/bluetooth_info/add')
def add_bluetooth_info():
    bluetooth_info = BluetoothInfoModel()
    bluetooth_info.bluetooth_id = 'b1'
    bluetooth_info.terminal_list = dumps({'t1': 60, 't2': 30})
    bluetooth_info.create_time = time.strftime('%Y-%m-%d %H:%M:%S')
    bluetooth_info.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
    # bluetooth_info = {k: v for k, v in request.form.items()}
    BluetoothInfoModel.add_bluetooth_info(bluetooth_info)
    return 'add successfully'


# 新增蓝牙基站信息
@bluetooth_bp.route('/bluetooth/data/add', methods=['POST'])
def add_bluetooth():
    # 创建新蓝牙基站信息
    bluetooth = BluetoothModel()
    bluetooth.bluetooth_id = request.form.get('bluetoothId').strip()
    bluetooth.board_id = request.form.get('boardId').strip()
    bluetooth.position_x = request.form.get('bluetoothPositionX').strip()
    bluetooth.position_y = request.form.get('bluetoothPositionY').strip()
    bluetooth.position_z = request.form.get('bluetoothPositionZ').strip()
    bluetooth.mode = request.form.get('mode').strip()
    bluetooth.create_time = time.strftime('%Y-%m-%d %H:%M:%S')
    bluetooth.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
    # 添加蓝牙基站信息
    BluetoothModel.add_bluetooth(bluetooth)
    return '蓝牙基站信息添加成功\n蓝牙基站号：' + bluetooth.bluetooth_id


# 新增蓝牙基站信息
@bluetooth_bp.route('/bluetooth/data/update/<id>', methods=['POST'])
def update_bluetooth_by_id(id):
    # 根据主键id查找蓝牙基站
    bluetooth = BluetoothModel.get_bluetooth_by_id(id)
    # 如果蓝牙基站存在
    if bluetooth:
        # 修改该蓝牙基站信息
        bluetooth.bluetooth_id = request.form.get('bluetoothId').strip()
        bluetooth.board_id = request.form.get('boardId').strip()
        bluetooth.position_x = request.form.get('bluetoothPositionX').strip()
        bluetooth.position_y = request.form.get('bluetoothPositionY').strip()
        bluetooth.position_z = request.form.get('bluetoothPositionZ').strip()
        bluetooth.mode = request.form.get('mode').strip()
        bluetooth.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
        # 更新蓝牙基站信息
        BluetoothModel.update_bluetooth()
    return '蓝牙基站信息更新成功\n蓝牙基站号：' + bluetooth.bluetooth_id


# 删除蓝牙基站信息
@bluetooth_bp.route('/bluetooth/data/delete', methods=['POST'])
def delete_bluetooth_by_id():
    # 循环待删除的蓝牙基站主键id
    for id, v in request.form.items():
        # 根据主键id查找蓝牙基站
        bluetooth = BluetoothModel.get_bluetooth_by_id(id)
        # 如果蓝牙基站存在
        if bluetooth:
            # 删除蓝牙基站
            BluetoothModel.delete_bluetooth(bluetooth)
        return '蓝牙基站信息删除成功\n蓝牙基站号：' + bluetooth.bluetooth_id
    return '删除失败'


@bluetooth_bp.route('/bluetooth/data/load/<id>', methods=['GET'])
def load_bluetooth_by_id(id):
    # 根据蓝牙基站主键id查找蓝牙基站
    bluetooth = BluetoothModel.get_bluetooth_by_id(id)
    # 如果蓝牙基站存在
    if bluetooth:
        # 返回蓝牙基站信息
        return SerializationHelper.model_to_list([bluetooth])
    return '获取失败'
