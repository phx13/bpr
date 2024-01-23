"""
终端管理控制器
author：phx
"""
import time

from flask import Blueprint, render_template, request
from flask.json import loads
from flask_login import login_required

from bpr_main.forms.terminal_form import TerminalForm
from bpr_main.models.bluetooth_info_model import BluetoothInfoModel
from bpr_main.models.bluetooth_model import BluetoothModel
from bpr_main.models.terminal_gis_info_model import TerminalGISInfoModel
from bpr_main.models.terminal_indoor_info_model import TerminalIndoorInfoModel
from bpr_main.models.terminal_model import TerminalModel
from bpr_main.utils.serialization_helper import SerializationHelper

terminal_bp = Blueprint('terminal_bp', __name__)


@terminal_bp.before_request
@login_required
def before_request():
    pass


# 渲染终端页面，注册终端信息表单
@terminal_bp.route('/terminal')
def terminal_page():
    form = TerminalForm()
    return render_template('terminal.html', form=form)


# 获取指定舰船上注册的所有终端
@terminal_bp.route('/terminal/terminal_list/board/<board_id>')
def load_board_terminal_list(board_id):
    terminal_list = TerminalModel.get_terminal_by_board_id(board_id)
    return SerializationHelper.model_to_list(terminal_list)


# 获取指定蓝牙基站最新时刻的终端列表
@terminal_bp.route('/terminal/terminal_list/bluetooth/<bluetooth_id>')
def load_latest_bluetooth_terminal_list(bluetooth_id):
    bluetooth_info_list = BluetoothInfoModel.get_bluetooth_info_by_bluetooth_id(bluetooth_id)
    if bluetooth_info_list:
        return SerializationHelper.model_to_list(bluetooth_info_list)[-1]['terminal_list']
    return ''


# 获取指定终端全部的室内定位信息
@terminal_bp.route('/terminal/terminal_indoor_info/all/<terminal_id>')
def load_all_terminal_indoor_info_by_terminal_id(terminal_id):
    terminal_indoor_info_list = TerminalIndoorInfoModel.get_terminal_indoor_info_by_terminal_id(terminal_id)
    if terminal_indoor_info_list:
        return SerializationHelper.model_to_list(terminal_indoor_info_list)
    return ''


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
        if load_latest_bluetooth_terminal_list(bluetooth['bluetooth_id']) != '':
            bluetooth_terminal_list = loads(load_latest_bluetooth_terminal_list(bluetooth['bluetooth_id']))

            # 如果该蓝牙基站是单基站模式
            if bluetooth['mode'] == 0:
                # 遍历该蓝牙的终端列表
                for terminal in bluetooth_terminal_list:
                    # 标定距离1m时候的rssi值
                    rssi_one_meter = -59
                    # 根据rssi计算距离，单位米
                    distance = round(10 ** ((rssi_one_meter - (int(bluetooth_terminal_list[terminal]))) / (10 * 2)), 2)
                    # 平滑处理
                    previous_distance = float(load_all_terminal_indoor_info_by_terminal_id(terminal)[-1]['position_y'])
                    new_distance = 0.1 * distance + 0.9 * previous_distance
                    # 更新终端的位置
                    online_terminal_list[terminal] = [bluetooth_terminal_list[terminal],
                                                      bluetooth['position_x'],
                                                      bluetooth['position_y'] + new_distance,
                                                      bluetooth['position_z'] - 1]
                    # 将终端室内位置信息更新到数据库
                    terminal_indoor_info = TerminalIndoorInfoModel()
                    terminal_indoor_info.terminal_id = terminal
                    terminal_indoor_info.position_x = bluetooth['position_x']
                    terminal_indoor_info.position_y = bluetooth['position_y']
                    terminal_indoor_info.position_z = bluetooth['position_z']
                    terminal_indoor_info.create_time = time.strftime('%Y-%m-%d %H:%M:%S')
                    terminal_indoor_info.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
                    TerminalIndoorInfoModel.add_terminal_indoor_info(terminal_indoor_info)

        # # 遍历该终端列表
        # for terminal in bluetooth_terminal_list:
        #     # 如果该终端在在线终端列表中
        #     if terminal in online_terminal_list:
        #         # 按比例分配位置
        #         ratio = bluetooth_terminal_list[terminal] / (
        #                 bluetooth_terminal_list[terminal] + online_terminal_list[terminal][0])
        #         position_x = ratio * bluetooth['position_x'] + (1 - ratio) * online_terminal_list[terminal][1]
        #         position_y = ratio * bluetooth['position_y'] + (1 - ratio) * online_terminal_list[terminal][2]
        #         position_z = ratio * bluetooth['position_z'] + (1 - ratio) * online_terminal_list[terminal][3]
        #         online_terminal_list[terminal] = [bluetooth_terminal_list[terminal],
        #                                           position_x,
        #                                           position_y,
        #                                           position_z]
        #     # 如果该终端不在在线终端列表中，添加进去
        #     else:
        #         online_terminal_list[terminal] = [bluetooth_terminal_list[terminal],
        #                                           bluetooth['position_x'],
        #                                           bluetooth['position_y'],
        #                                           bluetooth['position_z']]
    return online_terminal_list


# 新增终端信息
@terminal_bp.route('/terminal/data/add', methods=['POST'])
def add_terminal():
    # 创建新终端信息
    terminal = TerminalModel()
    terminal.terminal_id = request.form.get('terminalId').strip()
    terminal.board_id = request.form.get('boardId').strip()
    terminal.mode = request.form.get('mode').strip()
    terminal.battery = request.form.get('battery').strip()
    terminal.create_time = time.strftime('%Y-%m-%d %H:%M:%S')
    terminal.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
    # 添加终端信息
    TerminalModel.add_terminal(terminal)
    return '终端信息添加成功\n终端号：' + terminal.terminal_id


# 新增终端信息
@terminal_bp.route('/terminal/data/update/<id>', methods=['POST'])
def update_terminal_by_id(id):
    # 根据主键id查找终端
    terminal = TerminalModel.get_terminal_by_id(id)
    # 如果终端存在
    if terminal:
        # 修改该终端信息
        terminal.terminal_id = request.form.get('terminalId').strip()
        terminal.board_id = request.form.get('boardId').strip()
        terminal.mode = request.form.get('mode').strip()
        terminal.battery = request.form.get('battery').strip()
        terminal.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
        # 更新终端信息
        TerminalModel.update_terminal()
    return '终端信息更新成功\n终端号：' + terminal.terminal_id


# 删除终端信息
@terminal_bp.route('/terminal/data/delete', methods=['POST'])
def delete_terminal_by_id():
    # 循环待删除的终端主键id
    for id, v in request.form.items():
        # 根据主键id查找终端
        terminal = TerminalModel.get_terminal_by_id(id)
        # 如果终端存在
        if terminal:
            # 删除终端
            TerminalModel.delete_terminal(terminal)
        return '终端信息删除成功\n终端号：' + terminal.terminal_id
    return '删除失败'


@terminal_bp.route('/terminal/data/load/<id>', methods=['GET'])
def load_terminal_by_id(id):
    # 根据终端主键id查找终端
    terminal = TerminalModel.get_terminal_by_id(id)
    # 如果终端存在
    if terminal:
        # 返回终端信息
        return SerializationHelper.model_to_list([terminal])
    return '获取失败'


# 新增终端室内定位信息
@terminal_bp.route('/terminal/online_terminal_indoor_info', methods=['POST'])
def add_online_terminal_indoor_info():
    # 创建新终端室内定位信息
    terminal_indoor_info = TerminalIndoorInfoModel()
    terminal_indoor_info.terminal_id = request.form.get('terminalId').strip()
    terminal_indoor_info.position_x = request.form.get('terminalPositionX').strip()
    terminal_indoor_info.position_y = request.form.get('terminalPositionY').strip()
    terminal_indoor_info.position_z = request.form.get('terminalPositionZ').strip()
    terminal_indoor_info.create_time = time.strftime('%Y-%m-%d %H:%M:%S')
    terminal_indoor_info.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
    # 添加终端室内定位信息
    TerminalIndoorInfoModel.add_terminal_indoor_info(terminal_indoor_info)
    return '终端室内定位更新成功\n终端号：' + terminal_indoor_info.terminal_id + '\n室内定位[' + terminal_indoor_info.position_x + ',' + terminal_indoor_info.position_y + ',' + terminal_indoor_info.position_z + ']'


# 新增终端室外定位信息
@terminal_bp.route('/terminal/online_terminal_gis_info', methods=['POST'])
def add_online_terminal_gis_info():
    # 创建新终端室外定位信息
    terminal_gis_info = TerminalGISInfoModel()
    terminal_gis_info.terminal_id = request.form.get('terminalId').strip()
    terminal_gis_info.lon = request.form.get('terminalLon').strip()
    terminal_gis_info.lat = request.form.get('terminalLat').strip()
    terminal_gis_info.create_time = time.strftime('%Y-%m-%d %H:%M:%S')
    terminal_gis_info.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
    # 添加终端室外定位信息
    TerminalIndoorInfoModel.add_terminal_indoor_info(terminal_gis_info)
    return '终端室外定位更新成功\n终端号：' + terminal_gis_info.terminal_id + '\n室外定位[' + terminal_gis_info.lon + ',' + terminal_gis_info.lat + ']'
