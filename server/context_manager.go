package main

import (
	"errors"
	"fmt"
)

type Context struct {
	nextSeq int
	paths   map[int]string
}

type ContextManager map[key]*Context

func (cm ContextManager) HasKey(key key) bool {
	_, ok := cm[key]
	return ok
}

func (cm ContextManager) HasPath(key key, id int) bool {
	if !cm.HasKey(key) {
		return false
	}
	context, _ := cm[key]
	_, ok := context.paths[id]
	return ok
}

func (cm ContextManager) AddKey(key key) error {
	_, ok := cm[key]
	if ok {
		return errors.New(fmt.Sprintf("\"%s\" is duplicated", key))
	}
	cm[key] = &Context{
		0,
		make(map[int]string, 0),
	}
	return nil
}

func (cm ContextManager) AddPath(key key, path string) (id int, err error) {
	context, ok := cm[key]
	if !ok {
		err = errors.New(fmt.Sprintf("\"%s\" is not exists", key))
		return
	}
	id = context.nextSeq
	context.nextSeq += 1
	context.paths[id] = path
	return
}

func (cm ContextManager) GetPath(key key, id int) (path string, err error) {
	context, ok := cm[key]
	if !ok {
		err = errors.New(fmt.Sprintf("\"%s\" is not exists", key))
		return
	}
	path, ok = context.paths[id]
	if !ok {
		err = errors.New(fmt.Sprintf("\"%s\"[%d] is not exists", key, id))
		return
	}
	return
}
