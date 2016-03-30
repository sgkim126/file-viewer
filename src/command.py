from .connection import Connection
from .promise import Promise
from typing import Any
from typing import Dict
import json


class Command(object):
    @staticmethod
    def get(message: str) -> Promise:
        return Promise.apply(lambda: _get_command(message))

    @staticmethod
    def handle(command: Dict[str, Any]) -> Promise:
        seq = command.get('seq')
        key = command.get('key')
        if command['type'] == 'new':
            return Promise.apply(lambda: _handle_new(command)).map(
                lambda key: json.dumps({'key': key})
            )
        elif command['type'] == 'pwd':
            return Promise.apply(lambda: _handle_pwd(command)).map(
                lambda path: json.dumps({'pwd': path, 'seq': seq})
            )
        return Promise.failed(LookupError('invalid command'))


def _get_command(message: str) -> Dict[str, Any]:
    VALID_COMMANDS = ['new', 'pwd']
    command = json.loads(message)
    command_type = command.get('type')
    assert command_type is not None
    assert command_type in VALID_COMMANDS
    seq = command.get('seq')
    key = command.get('key')
    if command_type == 'new':
        assert seq is None
    else:
        assert seq is not None and type(seq) is int
        assert key is not None
    if key is not None:
        assert type(key) is str and len(key) == 16
    return command


def _handle_new(command: Dict[str, Any]) -> str:
    key = command.get('key')
    if key is None:
        key = Connection.instance().new()
    else:
        key = Connection.instance().get_or_new(key)
    return key


def _handle_pwd(command: Dict[str, Any]) -> str:
    return Connection.instance()[command['key']]['path']
