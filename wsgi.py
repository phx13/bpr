"""
主程序启动
author：phx
"""

import logging
import threading

from bpr_main import app as application
from bpr_main.utils.http_server_helper import http_server
from bpr_main.utils.socket_server_helper import tcp_server, udp_server

if __name__ == '__main__':
    # tcp通信线程，启动tcp server监听蓝牙客户端
    t_tcp = threading.Thread(target=tcp_server)
    t_tcp.daemon = True
    t_tcp.start()
    # udp通信线程，启动udp server监听LoRa客户端
    t_udp = threading.Thread(target=udp_server)
    t_udp.daemon = True
    t_udp.start()
    # http服务线程，启动http server加载地图服务
    t_http = threading.Thread(target=http_server)
    t_http.daemon = True
    t_http.start()
    # flask启动
    application.run(debug=True, use_reloader=False)
else:
    gunicorn_logger = logging.getLogger('gunicorn.error')
    application.logger.handlers = gunicorn_logger.handlers
    application.logger.setLevel(gunicorn_logger.level)
