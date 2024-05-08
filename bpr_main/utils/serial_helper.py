"""
串口通信服务帮助类，主要用于北斗服务
author：phx
"""

import queue
from time import sleep

import serial
import serial.tools.list_ports

q = queue.Queue()


class SerialHelper:
    def __init__(self, port, baud):
        self.port = serial.Serial(port, baud)
        self.port.close()
        if not self.port.isOpen():
            self.port.open()

    def port_open(self):
        if not self.port.isOpen():
            self.port.open()

    def port_close(self):
        self.port.close()

    # 发送数据
    def send_data(self, data):
        self.port.write(data.encode())

    # 读取数据
    def read_data(self):
        while True:
            if self.port.in_waiting:
                str1 = self.port.readline().decode('GBK')
                return str1

    # 解析保存数据
    @staticmethod
    def save_json():
        while True:
            if q.empty():
                pass
            else:
                data = q.get()
            sleep(0.1)

    # 查找可用串口列表功能
    @staticmethod
    def find_ports():
        return list(serial.tools.list_ports.comports())
