import logging
import threading

from bpr_main import app as application
from bpr_main.utils.socket_server import tcp_server

if __name__ == '__main__':
    t = threading.Thread(target=tcp_server)
    t.daemon = True
    t.start()
    application.run(debug=True, use_reloader=False)
else:
    gunicorn_logger = logging.getLogger('gunicorn.error')
    application.logger.handlers = gunicorn_logger.handlers
    application.logger.setLevel(gunicorn_logger.level)
