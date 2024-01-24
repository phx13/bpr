"""
GIS控制器
author：phx
"""
import time

from flask import Blueprint, render_template, request
from flask_login import login_required

from bpr_main.forms.beidou_message_form import BeidouMessageForm
from bpr_main.models.beidou_message_model import BeidouMessageModel
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


@gis_bp.route('/beidou/info/<port>/<baud>', methods=['GET'])
def load_beidou_info(port, baud):
    print('检测到读取指令')
    # 读卡信息
    CARD_INFO_COMMAND = '$CCICA,0,00*7B\r\n'
    # 星力信息
    STARS_INFO_COMMAND = '$CCRMO,BSI,2,0*26\r\n'
    # 串口服务线程，启动串口读取服务支撑北斗短报文
    # if serial and baud:
    # m_serial = serial.Serial(port, int(baud))
    # m_serial.open()
    m_serial = SerialHelper(port, int(baud))
    print(m_serial)
    # m_serial.write(CARD_INFO_COMMAND.encode())
    # host_info = m_serial.readline().decode('GBK')
    SerialHelper.send_data(m_serial, CARD_INFO_COMMAND)
    host_info = SerialHelper.read_data(m_serial).split(',')
    print(host_info)
    host_card_id, interval = host_info[1][1:], host_info[5]
    print(host_card_id, interval)

    SerialHelper.send_data(m_serial, STARS_INFO_COMMAND)
    stars_info = SerialHelper.read_data(m_serial).split(',')
    stars = 0
    for star_info in stars_info:
        if star_info != '0':
            stars += 1
    print(stars)
    return [host_card_id, interval, stars]
    # t_serial_r = threading.Thread(target=SerialHelper.read_data(m_serial))
    # t_serial_r.daemon = True
    # t_serial_r.start()
