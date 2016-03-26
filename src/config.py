import argparse


def parse(args):
    parser = argparse.ArgumentParser()
    parser.add_argument('port',
                        help='port',
                        type=int,)
    parser.add_argument('--debug',
                        default=True,
                        help='debug mode',
                        type=bool)
    return parser.parse_args(args)
