"""
二维地图控制器
author：phx
"""
from flask import Blueprint, render_template
from flask_login import login_required

map_bp = Blueprint('map_bp', __name__)


@map_bp.before_request
@login_required
def before_request():
    pass


@map_bp.route('/map')
def map_page():
    return render_template('map.html')
