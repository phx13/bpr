"""
GIS控制器
author：phx
"""
import time

from flask import Blueprint, render_template, request
from flask_login import login_required

from bpr_main.forms.beidou_message_form import BeidouMessageForm
from bpr_main.models.beidou_message_model import BeidouMessageModel

gis_bp = Blueprint('gis_bp', __name__)


@gis_bp.before_request
@login_required
def before_request():
    pass


@gis_bp.route('/gis', methods=['GET', 'POST'])
def gis_page():
    # 生成北斗短报文表单实例
    form = BeidouMessageForm()
    return render_template('gis.html', form=form)


@gis_bp.route('/rescue/beidou', methods=['POST'])
def add_beidou_message():
    # 创建新北斗报文
    beidou_message = BeidouMessageModel()
    beidou_message.target_card_id = request.form.get('targetCardId').strip()
    beidou_message.host_card_id = request.form.get('hostCardId').strip()
    beidou_message.message = request.form.get('message').strip()
    beidou_message.create_time = time.strftime('%Y-%m-%d %H:%M:%S')
    beidou_message.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
    # 添加新北斗报文
    BeidouMessageModel.add_beidou_message(beidou_message)
    return '北斗短报文发送成功'
