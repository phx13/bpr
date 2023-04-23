"""
首页控制器
author：phx
"""
from flask import Blueprint, render_template
from flask_login import login_required, current_user

from bpr_main.models.board_info_model import BoardInfoModel
from bpr_main.models.board_model import BoardModel

index_bp = Blueprint('index_bp', __name__)


@index_bp.before_request
@login_required
def before_request():
    pass


@index_bp.route('/')
def index_page():
    board_name = BoardModel.get_board_by_board_id(current_user.board_id).board_name
    board_position = BoardInfoModel.get_board_info_by_board_id(current_user.board_id)
    board_info = {'board_id': current_user.board_id,
                  'board_name': board_name,
                  'board_lon': board_position[-1].lon,
                  'board_lat': board_position[-1].lat}
    return render_template('index.html', board_info=board_info)
