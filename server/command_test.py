from .command import Command
import json
import unittest


class CommandTest(unittest.TestCase):
    @unittest.expectedFailure
    def test_get_failed_without_type(self):
        command = {'seq': 0}
        Command.get(json.dumps(command)).f.result()

    @unittest.expectedFailure
    def test_get_failed_without_seq(self):
        command = {'type': 'pwd'}
        Command.get(json.dumps(command)).f.result()

    @unittest.expectedFailure
    def test_get_failed_if_seq_is_not_int(self):
        command = {'type': 'pwd', 'seq': 'hmm'}
        Command.get(json.dumps(command)).f.result()

    @unittest.expectedFailure
    def test_get_failed_if_new_with_seq(self):
        command = {'type': 'new', 'seq': 0}
        Command.get(json.dumps(command)).f.result()

    def test_get_new_with_key(self):
        command = {'type': 'new', 'key': '1234567890123456'}
        Command.get(json.dumps(command)).f.result()

    def test_new_command_return_key(self):
        command = {'type': 'new'}
        result = json.loads(Command.handle(command).f.result())
        self.assertTrue('key' in result)

    def test_new_command_return_different_key(self):
        command = {'type': 'new', 'key': '1234567890123456'}
        result = json.loads(Command.handle(command).f.result())
        self.assertTrue('key' in result)
        self.assertNotEqual(command['key'], result['key'])

    def test_new_command_return_the_same_key(self):
        command = {'type': 'new'}
        result = json.loads(Command.handle(command).f.result())
        self.assertTrue('key' in result)
        key = result['key']
        command = {'type': 'new', 'key': key}
        result = json.loads(Command.handle(command).f.result())
        self.assertTrue('key' in result)
        self.assertEqual(command['key'], result['key'])
