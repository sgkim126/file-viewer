package main

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"syscall"
)

func handleLs(data *[]byte) (CommandResult, error) {
	var command LsCommand
	err := json.Unmarshal(*data, &command)
	if err != nil {
		return nil, err
	}

	path := command.Path

	fileInfos, err := ioutil.ReadDir(path)
	if err != nil {
		return CommandError{
			command.Seq,
			err.Error(),
		}, nil
	}
	sizeofFiles := len(fileInfos)
	files := make([]FileStat, sizeofFiles)
	for i := 0; i < sizeofFiles; i += 1 {
		file := fileInfos[i]
		stat := file.Sys().(*syscall.Stat_t)
		atime := stat.Atim.Sec
		ctime := stat.Ctim.Sec
		mtime := stat.Mtim.Sec
		numberOfHardLink := int(stat.Nlink)
		files[i] = FileStat{
			Name:             file.Name(),
			IsDir:            file.IsDir(),
			IsFile:           !file.IsDir(),
			IsSymlink:        file.Mode()&os.ModeSymlink != 0,
			Size:             file.Size(),
			NumberOfHardLink: numberOfHardLink,
			Ctime:            ctime,
			Mtime:            mtime,
			Atime:            atime,
			Mode:             uint32(file.Mode()),
		}
	}

	return LsResult{
		command.Seq,
		files,
	}, nil
}
