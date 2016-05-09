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

    def test_recover_returns_the_same_result_with_successful_future(self):
        p = Promise.successful(120)
        result = p.recover(lambda e: 100).f.result()
        self.assertEqual(120, result)

    def test_recover_the_failed_future(self):
        p = Promise.failed(Exception('failed'))
        result = p.recover(lambda e: 100).f.result()
        self.assertEqual(100, result)

    @unittest.expectedFailure
    def test_recover_returns_the_failed_future_if_callback_throw_error(self):
        p = Promise.failed(Exception('failed'))
        result = p.recover(raise_exception).f.result()


def raise_exception():
    raise Exception()
