"""
用户配置控制器
author：phx
"""

from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_required, current_user

from bpr_main.forms.config_form import ConfigForm
from bpr_main.models.config_model import ConfigModel

config_bp = Blueprint('config_bp', __name__)


@config_bp.before_request
@login_required
def before_request():
    pass


@config_bp.route('/config', methods=['GET', 'POST'])
def config_page():
    form = ConfigForm()
    # 获取更新用户事件
    if form.validate_on_submit():
        # 获取当前用户
        user_config = ConfigModel.get_config_by_username(current_user.username)
        user_config.tile_map_url = form.tile_map_url.data
        user_config.tile_map_port = form.tile_map_port.data
        user_config.map_init_lon = form.map_init_lon.data
        user_config.map_init_lat = form.map_init_lat.data
        user_config.map_init_zoom = form.map_init_zoom.data
        user_config.map_init_height = form.map_init_height.data
        # 更新用户
        ConfigModel.update_config()
        # 登录成功返回首页
        return redirect(url_for('account_bp.account_page'))
    return render_template('config.html', form=form)


@config_bp.route('/config/<username>', methods=['GET', 'POST'])
def config_json(username):
    return ConfigModel.get_config_by_username(username).to_dict()
