from tornado.concurrent import Future


class Promise(object):
    @staticmethod
    def failed(e) -> 'promise.Promise':
        f = Future()
        f.set_exception(e)
        return Promise(f)

    @staticmethod
    def successful(r) -> 'promise.Promise':
        f = Future()
        f.set_result(r)
        return Promise(f)

    @staticmethod
    def apply(callback) -> 'promise.Promise':
        f = Future()
        try:
            f.set_result(callback())
        except BaseException as e:
            f.set_exception(e)
        return Promise(f)

    def __init__(self, future):
        self.f = future

    def map(self, callback):
        return self.flatMap(lambda value: Promise.successful(callback(value)))

    def flatMap(self, callback):
        f = Future()
        self.f.add_done_callback(
            lambda future: Promise._flatMap(f, future, callback))
        return Promise(f)

    def _flatMap(target_future, result_future, callback):
        assert target_future.running()
        try:
            result = callback(result_future.result()).f.result()
            target_future.set_result(result)
        except BaseException as e:
            target_future.set_exception(e)
        return target_future
