# multiconn-server.py

import selectors
import socket
import time
import types

from flask.json import dumps

from bpr_main import app
from bpr_main.models.bluetooth_info_model import BluetoothInfoModel


def tcp_server():
    sel = selectors.DefaultSelector()

    # ...
    # 设置tcp本机监听ip和port
    host, port = '192.168.3.2', 6789
    lsock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    lsock.bind((host, port))
    lsock.listen()
    print(f"Listening on {(host, port)}")
    lsock.setblocking(False)
    sel.register(lsock, selectors.EVENT_READ, data=None)

    # 接收客户端
    def accept_wrapper(sock):
        conn, addr = sock.accept()  # Should be ready to read
        print(f"Accepted connection from {addr}")
        conn.setblocking(False)
        data = types.SimpleNamespace(addr=addr, inb=b"", outb=b"")
        events = selectors.EVENT_READ | selectors.EVENT_WRITE
        sel.register(conn, events, data=data)

    def service_connection(key, mask):
        sock = key.fileobj
        data = key.data
        terminal_list = {}
        if mask & selectors.EVENT_READ:
            recv_data = sock.recv(1024)  # Should be ready to read
            if recv_data:
                data.outb += recv_data
            else:
                print(f"Closing connection to {data.addr}")
                sel.unregister(sock)
                sock.close()
        if mask & selectors.EVENT_WRITE:
            if data.outb and str(data.outb).endswith('\\r\\n\''):
                info = str(data.outb).split(',')
                terminal_id = info[0].split(':')[1]
                rssi = int(info[1])
                bluetooth_id = info[2].split('\\')[0]
                print(terminal_id, rssi, bluetooth_id)

                terminal_list[terminal_id] = rssi

                with app.app_context():
                    # 每隔10s记录终端dict位置
                    bluetooth_info = BluetoothInfoModel()
                    bluetooth_info.bluetooth_id = bluetooth_id
                    bluetooth_info.terminal_list = dumps(terminal_list)
                    bluetooth_info.create_time = time.strftime('%Y-%m-%d %H:%M:%S')
                    bluetooth_info.update_time = time.strftime('%Y-%m-%d %H:%M:%S')
                    BluetoothInfoModel.add_bluetooth_info(bluetooth_info)

                time.sleep(10)

                # print(f"Echoing {data.outb!r} to {data.addr}")
                sent = sock.send(data.outb)  # Should be ready to write
                data.outb = data.outb[sent:]

    try:
        while True:
            events = sel.select(timeout=None)
            for key, mask in events:
                if key.data is None:
                    accept_wrapper(key.fileobj)
                else:
                    service_connection(key, mask)
    except KeyboardInterrupt:
        print("Caught keyboard interrupt, exiting")
    finally:
        sel.close()

# netstat -ano|findstr "6789" 查询端口号
# taskkill /pid 21436 /f 杀进程
