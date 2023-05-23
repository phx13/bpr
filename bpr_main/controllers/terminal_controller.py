"""
终端管理控制器
author：phx
"""
from flask import Blueprint, render_template
from flask_login import login_required

terminal_bp = Blueprint('terminal_bp', __name__)


@terminal_bp.before_request
@login_required
def before_request():
    pass


@terminal_bp.route('/terminal')
def terminal_page():
    return render_template('terminal.html')
