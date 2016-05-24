package main

import (
	"io/ioutil"
	"os"
	"path"
	"syscall"
)

type LsRequest struct {
	Seq
	Path string `json:"path"`
}

func (request LsRequest) Handle(kg KeyGenerator, cm *ContextManager) Response {
	targetDirPath := request.Path

	fileInfos, err := ioutil.ReadDir(targetDirPath)
	if err != nil {
		panic(MessageError{
			request.Seq,
			err.Error(),
		})
	}
	sizeofFiles := len(fileInfos)
	files := make([]FileStat, sizeofFiles)
	for i := 0; i < sizeofFiles; i += 1 {
		file := fileInfos[i]
		isSymlink := file.Mode()&os.ModeSymlink != 0
		if isSymlink {
			targetFilePath := path.Join(targetDirPath, file.Name())
			file, err = os.Stat(targetFilePath)
			if err != nil {
				panic(err)
			}
		}
		stat := file.Sys().(*syscall.Stat_t)
		atime := stat.Atim.Sec
		ctime := stat.Ctim.Sec
		mtime := stat.Mtim.Sec
		numberOfHardLink := int(stat.Nlink)

		files[i] = FileStat{
			Name:             file.Name(),
			IsDir:            file.IsDir(),
			IsFile:           !file.IsDir(),
			IsSymlink:        isSymlink,
			Size:             file.Size(),
			NumberOfHardLink: numberOfHardLink,
			Ctime:            ctime,
			Mtime:            mtime,
			Atime:            atime,
			Mode:             uint32(file.Mode()),
		}
	}

	return LsResponse{
		request.Seq,
		files,
	}
}

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

type LsResponse struct {
	Seq
	Files []FileStat `json:"files"`
}

func (response LsResponse) ResponseMessage() []byte {
	return ResponseMessage(response)
}
