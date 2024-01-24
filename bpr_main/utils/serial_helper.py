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
        """
        #write() 方法只能发送 bytes 类型的数据，所以需要对字符串进行 encode 编码。
        # write() 方法执行完成后，会将发送的字节数作为返回值。
        """
        print("send: ", data)
        self.port.write(data.encode())

    # 读取数据
    def read_data(self):
        """
        #  read()方法默认一次读取一个字节，可以通过传入参数指定每次读取的字节数；
        read() 方法会将读取的内容作为返回值，类型为 bytes。
        """

        while True:
            if self.port.in_waiting:
                str1 = self.port.readline().decode('GBK')  # 读一行，以/n结束。
                # char1 = print(self.port.read(size=1).hex())  # 从串口读size个字节
                print('receive: ' + str1)
                return str1

    # 解析保存数据
    @staticmethod
    def save_json():
        while True:
            if q.empty():
                pass
            else:
                print("队列长度", q.qsize())
                data = q.get()
                print(data)
            sleep(0.1)

    @staticmethod
    def find_ports():
        return list(serial.tools.list_ports.comports())

# baundRate = 115200
# serialPort_w = "COM3"
# mSerial_w = SerialHelper(serialPort_w, baundRate)
# mSerial_w.send_data('$CCICA,0,00*7B\r\n')
# mSerial_w.read_data()
