import tornado.websocket


class CommandHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        pass

    def on_message(self, message):
        self.write_message(message)

    def on_close(self):
        pass
