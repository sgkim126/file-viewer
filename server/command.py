from .connection import Connection
from .ls_command import handle_ls_command
from .promise import Promise
from typing import Any
from typing import Dict
from .execute import cat
import asyncio
import json


class Command(object):
    @staticmethod
    def get(message: str) -> Promise:
        return Promise.apply(lambda: _get_command(message))

    @staticmethod
    def handle(command: Dict[str, Any]) -> Promise:
        seq = command.get('seq')
        key = command.get('key')
        handlers = {
            'new': _handle_new,
            'pwd': _handle_pwd,
            'ls': handle_ls_command,
            'cat': _handle_cat,
        }
        return Promise.successful(
            command
        ).map(
            handlers[command['type']]
        ).map(
            json.dumps
        )


def _get_command(message: str) -> Dict[str, Any]:
    VALID_COMMANDS = ['new', 'pwd', 'ls', 'cat']
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
    if command_type == 'ls':
        assert type(command['path']) is str
    if command_type == 'cat':
        assert type(command['path']) is str
    return command


def _handle_new(command: Dict[str, Any]) -> Dict[str, str]:
    key = command.get('key')
    if key is None:
        key = Connection.instance().new()
    else:
        key = Connection.instance().get_or_new(key)
    return {'key': key}


def _handle_pwd(command: Dict[str, Any]) -> Dict[str, Any]:
    path = Connection.instance()[command['key']]['path']
    seq = command['seq']
    return {'pwd': path, 'seq': seq}


def _handle_cat(command: Dict[str, Any]) -> Dict[str, Any]:
    path = command['path']
    seq = command['seq']
    lines = cat(path)
    return {'lines': lines, 'seq': seq}
