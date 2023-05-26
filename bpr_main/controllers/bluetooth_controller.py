"""
蓝牙管理控制器
author：phx
"""
import time

from flask import Blueprint, render_template
from flask.json import dumps
from flask_login import login_required

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
    return render_template('bluetooth.html')


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
