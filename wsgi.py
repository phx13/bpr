import logging
import threading

from bpr_main import app as application
from bpr_main.utils.http_server_helper import http_server
from bpr_main.utils.socket_server_helper import tcp_server

if __name__ == '__main__':
    t_tcp = threading.Thread(target=tcp_server)
    t_tcp.daemon = True
    t_tcp.start()
    t_http = threading.Thread(target=http_server)
    t_http.daemon = True
    t_http.start()
    application.run(debug=True, use_reloader=False)
else:
    gunicorn_logger = logging.getLogger('gunicorn.error')
    application.logger.handlers = gunicorn_logger.handlers
    application.logger.setLevel(gunicorn_logger.level)
