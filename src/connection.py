import datetime
import threading


def new_key() -> str:
    timestamp = int(datetime.datetime.now().timestamp())
    return hex(timestamp)[2:].rjust(16, '0')


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
        self.dict[candidate_key] = ''
        return candidate_key

    def __contains__(self, key: str) -> bool:
        return key in self.dict

    def get_or_new(self, key: str) -> str:
        if key in self:
            return key
        return self.new()
