"""
室内定位控制器
author：phx
"""
from flask import Blueprint, render_template
from flask_login import login_required

indoor_bp = Blueprint('indoor_bp', __name__)


@indoor_bp.before_request
@login_required
def before_request():
    pass


@indoor_bp.route('/indoor')
def indoor_page():
    bluetooth_info = {
        'bluetooth_id': '',
        'position_x': '',
        'position_y': '',
        'position_z': '',
    }
    return render_template('indoor.html', bluetooth_info=bluetooth_info)
