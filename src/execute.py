import tempfile
import subprocess
from typing import List
from .promise import Promise


def cat(path: str) -> List[str]:
    file = tempfile.NamedTemporaryFile(mode='w+', prefix='sgk', delete=False)
    proc = subprocess.run("cat \"%s\"" % path, shell=True,
                          stdout=file.fileno(), stderr=file.fileno())
    result = open(file.name)
    return result.read().splitlines()
