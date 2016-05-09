import datetime
import os
import threading


__count = 0


def new_key() -> str:
    timestamp = int(datetime.datetime.now().timestamp())
    global __count
    __count += 1
    return (hex(__count)[2:] + hex(timestamp)[2:]).rjust(16, '0')


def default_path() -> str:
    return os.getenv('HOME')


class Connection(object):
    _instance_lock = threading.Lock()

    def __init__(self):
        self.dict = {}

    @staticmethod
    def instance():
        if not hasattr(Connection, '_instance'):
            with Connection._instance_lock:
                if not hasattr(Connection, "_instance"):
                    Connection._instance = Connection()
        return Connection._instance

    def new(self) -> str:
        candidate_key = new_key()
        if candidate_key in self:
            return self.new()
        self.dict[candidate_key] = {'path': default_path()}
        return candidate_key

    def __contains__(self, key: str) -> bool:
        return key in self.dict

    def get_or_new(self, key: str) -> str:
        if key in self:
            return key
        return self.new()

    def __getitem__(self, key):
        return self.dict[key]
