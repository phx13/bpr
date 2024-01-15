"""
应用错误控制器
author：phx
"""

from flask import Blueprint, jsonify
from flask_login import login_required

error_bp = Blueprint('error_bp', __name__)


@error_bp.before_request
@login_required
def before_request():
    pass


@error_bp.app_errorhandler(404)
def error_404(error):
    """这个handler可以catch住所有abort(404)以及找不到对应router的处理请求"""
    response = dict(status=0, message="404 Not Found")
    return jsonify(response), 404


@error_bp.app_errorhandler(Exception)
def error_500(error):
    """这个handler可以catch住所有的abort(500)和raise exeception."""
    response = dict(status=0, message="500 Error")
    return jsonify(response), 400
