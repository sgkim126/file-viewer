from .command import Command
import unittest


class CommandTest(unittest.TestCase):
    @unittest.expectedFailure
    def test_get_failed_with_invalid_command(self):
        Command.get('INVALID:').f.result()

    @unittest.expectedFailure
    def test_get_failed_when_there_is_no_colon(self):
        Command.get('SOME').f.result()

    def test_get_new(self):
        command, argv = Command.get('NEW:').f.result()
        self.assertEqual(Command.NEW, command)
