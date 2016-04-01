from .command import Command
from tornado.ioloop import IOLoop
import json
import tornado.concurrent
import tornado.websocket
import traceback


class CommandHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        pass

    def on_message(self, message):
        p = Command.get(message)
        result = p.flatMap(Command.handle)
        IOLoop.instance().add_future(
            result.f, lambda result: self.send_response(result))

    def on_close(self):
        pass

    def send_response(self, result):
        try:
            response = result.result()
            print('RESPONSE:' + response[:40])
            self.write_message(response)
        except Exception as e:
            traceback.print_exc()
            # TODO: should send seq.
            self.write_message(json.dumps({'error': True}))
