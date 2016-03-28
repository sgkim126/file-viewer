from .command import Command
from tornado.concurrent import Future
from typing import List, Tuple


def parse(message: str) -> Tuple[Command, List[str]]:
    return Command.get(message)


def handle_message(message: str) -> Future[Tuple[Command, str]]:
    f = tornado.concurrent.Future()
    try:
        command, args = Command.get(message)
        if command == Command.NEW:
            pass
        else:
            raise LookupError('unknown command')
    except Exception as e:
        f.set_exception(e)
    return f
