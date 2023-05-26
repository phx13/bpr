"""
终端管理控制器
author：phx
"""
from flask import Blueprint, render_template
from flask.json import loads
from flask_login import login_required

from bpr_main.models.bluetooth_info_model import BluetoothInfoModel
from bpr_main.models.bluetooth_model import BluetoothModel
from bpr_main.models.terminal_model import TerminalModel
from bpr_main.utils.serialization_helper import SerializationHelper

terminal_bp = Blueprint('terminal_bp', __name__)


@terminal_bp.before_request
@login_required
def before_request():
    pass


# 渲染终端页面
@terminal_bp.route('/terminal')
def terminal_page():
    return render_template('terminal.html')


# 获取指定舰船上所有终端
@terminal_bp.route('/terminal/terminal_list/board/<board_id>')
def load_board_terminal_list(board_id):
    terminal_list = TerminalModel.get_terminal_by_board_id(board_id)
    return SerializationHelper.model_to_list(terminal_list)


# 获取蓝牙基站定位的所有终端
@terminal_bp.route('/terminal/terminal_list/bluetooth/<bluetooth_id>')
def load_bluetooth_terminal_list(bluetooth_id):
    bluetooth_info_list = BluetoothInfoModel.get_bluetooth_info_by_bluetooth_id(bluetooth_id)
    terminal_list = SerializationHelper.model_to_list(bluetooth_info_list)[-1]['terminal_list']
    return terminal_list


# 获取指定舰船上所有终端
@terminal_bp.route('/terminal/online_terminal_list/board/<board_id>')
def load_board_online_terminal_list(board_id):
    bluetooth_list = BluetoothModel.get_bluetooth_by_board_id(board_id)
    terminal_list = {}
    for bluetooth in SerializationHelper.model_to_list(bluetooth_list):
        terminal = loads(load_bluetooth_terminal_list(bluetooth['bluetooth_id']))
        for key in terminal:
            if key in terminal_list:
                if terminal[key] > terminal_list[key][0]:
                    terminal_list[key] = [terminal[key], bluetooth['position_x'], bluetooth['position_y'],
                                          bluetooth['position_z']]
            else:
                terminal_list[key] = [terminal[key], bluetooth['position_x'], bluetooth['position_y'],
                                      bluetooth['position_z']]
    return terminal_list
