package main

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"syscall"
)

type FileStat struct {
	Name             string `json:"name"`
	IsDir            bool   `json:"is_dir"`
	IsFile           bool   `json:"is_file"`
	IsSymlink        bool   `json:"is_symlink"`
	Size             int64  `json:"size"`
	NumberOfHardLink int    `json:"number_of_hard_link"`
	Ctime            int64  `json:"ctime"`
	Mtime            int64  `json:"mtime"`
	Atime            int64  `json:"atime"`
	Mode             uint32 `json:"mode"`
}

func handleLs(data *[]byte) (*[]byte, error) {
	var command LsCommand
	err := json.Unmarshal(*data, &command)
	if err != nil {
		return nil, err
	}

	path := command.Path

	fileInfos, err := ioutil.ReadDir(path)
	if err != nil {
		return nil, err
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

	result := make(map[string]interface{})
	result["seq"] = command.Seq
	result["files"] = files

	encoded, err := json.Marshal(result)
	if err != nil {
		return nil, err
	}
	return &encoded, nil
}
