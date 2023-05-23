"""
蓝牙管理控制器
author：phx
"""
from flask import Blueprint, render_template
from flask_login import login_required

from bpr_main.models.bluetooth_model import BluetoothModel
from bpr_main.utils.serialization_helper import SerializationHelper

bluetooth_bp = Blueprint('bluetooth_bp', __name__)


@bluetooth_bp.before_request
@login_required
def before_request():
    pass


@bluetooth_bp.route('/bluetooth')
def bluetooth_page():
    return render_template('bluetooth.html')


@bluetooth_bp.route('/bluetooth/bluetooth_list/<board_id>')
def load_board_bluetooth_list(board_id):
    bluetooth_list = BluetoothModel.get_bluetooth_by_board_id(board_id)
    return SerializationHelper.model_to_list(bluetooth_list)


@bluetooth_bp.route('/bluetooth/<bluetooth_id>')
def load_bluetooth(bluetooth_id):
    bluetooth = BluetoothModel.get_bluetooth_by_bluetooth_id(bluetooth_id)
    return SerializationHelper.model_to_list(bluetooth)
