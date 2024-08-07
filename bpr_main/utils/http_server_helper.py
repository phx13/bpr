"""
http服务帮助类，主要用于地图服务
author：phx
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler

IP = "127.0.0.1"
PORT = 6677
DIRECTORY = "/DHGStreet_World_00-13/"


class CORSRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        SimpleHTTPRequestHandler.end_headers(self)


def http_server():
    with HTTPServer((IP, PORT), CORSRequestHandler) as httpd:
        print("HTTP服务启动，地址为：", (IP, PORT))
        httpd.serve_forever()
