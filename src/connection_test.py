from .connection import Connection
from .connection import new_key
import unittest


class ConnectionTest(unittest.TestCase):
    def test_size_of_key_is_16(self):
        key = new_key()
        self.assertEqual(16, len(key))

    def test_in(self):
        connection = Connection()
        key = connection.new()
        self.assertTrue(key in connection)
