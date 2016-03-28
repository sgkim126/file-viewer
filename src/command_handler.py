from .command import Command
from tornado.ioloop import IOLoop
import json
import tornado.concurrent
import tornado.websocket


class CommandHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        pass

    def on_message(self, message):
        p = Command.get(message)
        x = p.f.result()
        result = p.flatMap(_handle_command)
        IOLoop.instance().add_future(
            result.f, lambda result: self.send_response(result))

    def on_close(self):
        pass

    def send_response(self, result):
        try:
            response = result.result()
            print('RESPONSE:' + response)
            self.write_message(response)
        except Exception as e:
            print('ERROR:' + str(e))
            self.write_message(e)


def _handle_command(commands):
    command, args = commands
    return Command.handle(command, args)
