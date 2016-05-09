from typing import Any
from typing import Dict
import os


def handle_ls_command(command: Dict[str, Any]) -> Dict[str, Any]:
    path = command['path']
    realpath = os.path.realpath(path)
    files = os.scandir(realpath)
    return {
        'seq': command['seq'],
        'files': [dump(file) for file in files],
    }


def dump(file: 'os.DirEntry') -> Dict[str, Any]:
    name = file.name
    is_file = file.is_file()
    is_dir = file.is_dir()
    is_symlink = file.is_symlink()
    stat = file.stat()
    mode = stat.st_mode
    number_of_hard_link = stat.st_nlink
    size = stat.st_size
    atime = stat.st_atime
    mtime = stat.st_mtime
    ctime = stat.st_ctime
    return {
        'name': name,
        'is_file': is_file,
        'is_dir': is_dir,
        'is_symlink': is_symlink,
        'mode': mode,
        'number_of_hard_link': number_of_hard_link,
        'size': size,
        'atime': atime,
        'mtime': mtime,
        'ctime': ctime,
    }
