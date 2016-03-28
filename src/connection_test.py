from .connection import Connection
from .connection import new_key
from .connection import default_path
import unittest


class ConnectionTest(unittest.TestCase):
    def test_size_of_key_is_16(self):
        key = new_key()
        self.assertEqual(16, len(key))

    def test_in(self):
        connection = Connection()
        key = connection.new()
        self.assertTrue(key in connection)

    def test_new_key_has_default_path(self):
        connection = Connection()
        key = connection.new()
        self.assertEqual(default_path(), connection[key]['path'])

    def test_set_another_path(self):
        connection = Connection()
        key = connection.new()
        new_path = '/some/another/path'
        connection[key]['path'] = new_path
        self.assertEqual(new_path, connection[key]['path'])
