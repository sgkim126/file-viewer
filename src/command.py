from enum import Enum
from tornado.concurrent import Future
from typing import List
from typing import Tuple


class Command(Enum):
    NEW = 1

    @staticmethod
    def get(message: str) -> Future:
        result = Future()
        try:
            command, argv = message.split(':', 1)
            result.set_result((Command[command], argv.split(':')))
        except Exception as e:
            result.set_exception(e)
        return result
