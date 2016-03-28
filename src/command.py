from .connection import Connection
from .promise import Promise
from enum import Enum
from typing import List
from typing import Tuple


class Command(Enum):
    NEW = 1

    @staticmethod
    def get(message: str) -> Promise:
        return Promise.apply(lambda: _get_command(message))


def _get_command(message: str) -> Tuple[Command, List[str]]:
    command, argv = message.split(':', 1)
    return (Command[command], argv.split(':'))
