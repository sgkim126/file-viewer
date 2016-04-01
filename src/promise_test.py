from .promise import Promise
import unittest


class PromiseTest(unittest.TestCase):
    @unittest.expectedFailure
    def test_failed(self):
        Promise.failed(Exception).f.result()

    def test_successful(self):
        value = 1
        result = Promise.successful(value).f.result()
        self.assertEqual(value, result)

    def test_apply(self):
        result = Promise.apply(lambda: 1).f.result()
        self.assertEqual(1, result)

    @unittest.expectedFailure
    def test_apply_returns_failed_promise_when_exception_raised(self):
        Promise.apply(raise_exception).f.result()


def raise_exception():
    raise Exception()
