from .command import Command
import unittest


class CommandTest(unittest.TestCase):
    @unittest.expectedFailure
    def test_get_failed_with_invalid_command(self):
        Command.get('INVALID:').result()

    @unittest.expectedFailure
    def test_get_failed_when_there_is_no_colon(self):
        Command.get('SOME').result()

    def test_get_new(self):
        command, argv = Command.get('NEW:').result()
        self.assertEqual(Command.NEW, command)
