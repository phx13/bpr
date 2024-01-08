"""
GIS控制器
author：phx
"""
from flask import Blueprint, render_template
from flask_login import login_required

gis_bp = Blueprint('gis_bp', __name__)


@gis_bp.before_request
@login_required
def before_request():
    pass


@gis_bp.route('/gis')
def gis_page():
    return render_template('gis.html')
