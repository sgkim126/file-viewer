#!/usr/bin/env python3
import os
import src.command
import src.config
import sys
import tornado.ioloop
import tornado.web


def static_path():
    dir = os.path.dirname(os.path.realpath(__file__))
    return os.path.join(dir, 'html')

if __name__ == '__main__':
    config = src.config.parse(sys.argv[1:])
    mode = config.debug and "debug" or "release"
    print('Run server localhost:%d with %s mode' % (config.port, mode))
    port = config.port
    settings = {
        'debug': config.debug,
    }

    handlers = [
        (r'/c', src.command.CommandHandler),
        (r'/(.*)', tornado.web.StaticFileHandler,
         {'path': static_path(), 'default_filename': 'index.html'}),
    ]
    app = tornado.web.Application(handlers, **settings)
    app.listen(port)
    tornado.ioloop.IOLoop.instance().start()
