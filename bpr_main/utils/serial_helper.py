"""
串口通信服务帮助类，主要用于北斗服务
author：phx
"""

import serial
import serial.tools.list_ports


def find_ports():
    ports_list = list(serial.tools.list_ports.comports())
    if len(ports_list) <= 0:
        print('none')
    else:
        for comport in ports_list:
            print(comport)


find_ports()
