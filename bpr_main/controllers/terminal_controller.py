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


# 获取指定舰船上注册的所有终端
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


# 获取指定舰船上在线监测的所有终端
@terminal_bp.route('/terminal/online_terminal_list/board/<board_id>')
def load_board_online_terminal_list(board_id):
    # 获取当前舰船上所有的蓝牙基站
    bluetooth_list = BluetoothModel.get_bluetooth_by_board_id(board_id)
    # 创建终端列表，格式dict，{terminal：[RSSI, position_x, position_y, position_z]...}
    online_terminal_list = {}
    # 遍历蓝牙基站
    for bluetooth in SerializationHelper.model_to_list(bluetooth_list):
        # 获取该蓝牙基站当前收取的终端列表：格式dict，{terminal：RSSI...}
        bluetooth_terminal_list = loads(load_bluetooth_terminal_list(bluetooth['bluetooth_id']))
        # 遍历该终端列表
        for terminal in bluetooth_terminal_list:
            # 如果该终端在在线终端列表中
            if terminal in online_terminal_list:
                # 按比例分配位置
                ratio = bluetooth_terminal_list[terminal] / (
                        bluetooth_terminal_list[terminal] + online_terminal_list[terminal][0])
                position_x = ratio * bluetooth['position_x'] + (1 - ratio) * online_terminal_list[terminal][1]
                position_y = ratio * bluetooth['position_y'] + (1 - ratio) * online_terminal_list[terminal][2]
                position_z = ratio * bluetooth['position_z'] + (1 - ratio) * online_terminal_list[terminal][3]
                online_terminal_list[terminal] = [bluetooth_terminal_list[terminal],
                                                  position_x,
                                                  position_y,
                                                  position_z]
            # 如果该终端不在在线终端列表中，添加进去
            else:
                online_terminal_list[terminal] = [bluetooth_terminal_list[terminal],
                                                  bluetooth['position_x'],
                                                  bluetooth['position_y'],
                                                  bluetooth['position_z']]
    return online_terminal_list
