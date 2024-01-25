"""
GIS控制器
author：phx
"""
import time

from flask import Blueprint, render_template, request
from flask_login import login_required

from bpr_main.forms.beidou_message_form import BeidouMessageForm
from bpr_main.models.beidou_message_model import BeidouMessageModel
from bpr_main.utils.checksum_helper import bcc_checksum, ascii2hex
from bpr_main.utils.serial_helper import SerialHelper

gis_bp = Blueprint('gis_bp', __name__)


@gis_bp.before_request
@login_required
def before_request():
    pass


@gis_bp.route('/gis', methods=['GET', 'POST'])
def gis_page():
    # 生成北斗短报文表单实例
    form = BeidouMessageForm()
    # 查询本机连接的串口
    ports = SerialHelper.find_ports()
    return render_template('gis.html', form=form, ports=ports)


@gis_bp.route('/rescue/beidou', methods=['POST'])
def add_beidou_message():
    try:
        target_card_id = request.form.get('targetCardId').strip()
        host_card_id = request.form.get('hostCardId').strip()
        message = request.form.get('message').strip()
        port = request.form.get('port').strip()
        baud = request.form.get('baud').strip()
        # 短报文发送指令
        message_command = 'CCTXA,0' + target_card_id + ',1,1,' + message
        message_bcc_checksum = bcc_checksum(ascii2hex(message_command))
        MESSAGE_COMMAND = '$' + message_command + '*' + message_bcc_checksum + '\r\n'
        # 根据串口号和波特率创建串口实例
        m_serial = SerialHelper(port, int(baud))
        if m_serial:
            # 发送读卡指令
            SerialHelper.send_data(m_serial, MESSAGE_COMMAND)
            # 接收读卡信息
            txa_info = SerialHelper.read_data(m_serial).split(',')
            # 解析出本机地址和频度
            txa_result = txa_info[2]
            # 关闭串口
            SerialHelper.port_close(m_serial)
            if txa_result == 'Y':
                # 创建新北斗报文
                beidou_message = BeidouMessageModel()
                beidou_message.target_card_id = target_card_id
                beidou_message.host_card_id = host_card_id
                beidou_message.message = message
                beidou_message.create_time = time.strftime('%Y-%m-%d %H:%M:%S')
                beidou_message.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
                # 添加新北斗报文
                BeidouMessageModel.add_beidou_message(beidou_message)
                return '北斗短报文发送成功'
            else:
                return '短报文发送失败，请检查星力指数'
    except:
        return '短报文发送失败，请检查串口占用情况'


@gis_bp.route('/beidou/info/<port>/<baud>', methods=['GET'])
def load_beidou_info(port, baud):
    try:
        # 读卡指令
        card_info_command = 'CCICA,0,00'
        card_bcc_checksum = bcc_checksum(ascii2hex(card_info_command))
        CARD_INFO_COMMAND = '$' + card_info_command + '*' + card_bcc_checksum + '\r\n'
        # 星力指令
        stars_info_command = 'CCRMO,BSI,2,0'
        stars_bcc_checksum = bcc_checksum(ascii2hex(stars_info_command))
        STARS_INFO_COMMAND = '$' + stars_info_command + '*' + stars_bcc_checksum + '\r\n'
        # 根据串口号和波特率创建串口实例
        m_serial = SerialHelper(port, int(baud))
        if m_serial:
            # 发送读卡指令
            SerialHelper.send_data(m_serial, CARD_INFO_COMMAND)
            # 接收读卡信息
            host_info = SerialHelper.read_data(m_serial).split(',')
            # 解析出本机地址和频度
            host_card_id, interval = host_info[1][1:], host_info[5]
            # 发送星力指令
            SerialHelper.send_data(m_serial, STARS_INFO_COMMAND)
            # 接收星力信息
            stars_info = SerialHelper.read_data(m_serial).split(',')[3:12]
            # 计算捕获到的星的数量
            stars = 0
            for star_info in stars_info:
                if star_info != '0':
                    stars += 1
            # 关闭串口
            SerialHelper.port_close(m_serial)
            return [host_card_id, interval, stars]
    except:
        return '读卡信息失败，请检查串口占用情况'
