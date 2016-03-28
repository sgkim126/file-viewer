from .connection import Connection
from .promise import Promise
from enum import Enum
from typing import List
from typing import Tuple
import json


class Command(Enum):
    NEW = 1
    PWD = 2

    @staticmethod
    def get(message: str) -> Promise:
        return Promise.apply(lambda: _get_command(message))

    @staticmethod
    def handle(command: 'command.Command', argv: List[str]) -> Promise:
        if (command == Command.NEW):
            return Promise.apply(lambda: _handle_new(*argv)).map(
                lambda key: json.dumps({'key': key})
            )
        elif command == Command.PWD:
            return Promise.apply(lambda: _handle_pwd(*argv)).map(
                lambda path: json.dumps({'pwd': path})
            )
        else:
            return Promise.failed(LookupError('invalid command'))


def _get_command(message: str) -> Tuple[Command, List[str]]:
    command, argv = message.split(':', 1)
    return (Command[command], argv.split(':'))


def _handle_new(*argv: List[str]) -> str:
    if len(argv) == 0:
        return Connection.instance().new()
    elif len(argv) == 1:
        return Connection.instance().get_or_new(argv[0])
    else:
        raise LookupError()


def _handle_pwd(key: str) -> str:
    return Connection.instance()[key]['path']
