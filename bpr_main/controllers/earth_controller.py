"""
三维地球控制器
author：phx
"""
from flask import Blueprint, render_template
from flask_login import login_required

earth_bp = Blueprint('earth_bp', __name__)


@earth_bp.before_request
@login_required
def before_request():
    pass


@earth_bp.route('/earth')
def earth_page():
    return render_template('earth.html')
