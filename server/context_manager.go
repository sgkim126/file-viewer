package main

import (
	"errors"
	"fmt"
)

type Context struct {
	key     key
	path    string
	command string
}

type ContextManager struct {
	nextSeq  int
	contexts map[int]Context
	keys     []key
	root     string
}

func NewContextManager(root string) ContextManager {
	return ContextManager{
		0,
		make(map[int]Context, 0),
		make([]key, 0),
		root,
	}
}

func (cm ContextManager) HasKey(key key) bool {
	for i := range cm.keys {
		if cm.keys[i] == key {
			return true
		}
	}
	return false
}

func (cm ContextManager) HasContext(key key, id int) bool {
	if !cm.HasKey(key) {
		return false
	}
	context, ok := cm.contexts[id]
	if !ok {
		return false
	}
	return context.key == key
}

func (cm *ContextManager) AddKey(key key) error {
	if cm.HasKey(key) {
		return errors.New(fmt.Sprintf("\"%s\" is duplicated", key))
	}
	cm.keys = append(cm.keys, key)
	return nil
}

func (cm ContextManager) Root() string {
	return cm.root
}

func (cm *ContextManager) AddContext(key key, path string, command string) (id int, err error) {
	if !cm.HasKey(key) {
		err = errors.New(fmt.Sprintf("\"%s\" is not exists", key))
	}
	id = cm.nextSeq
	cm.nextSeq += 1
	cm.contexts[id] = Context{
		key,
		path,
		command,
	}
	return
}

func (cm ContextManager) GetContext(key key, id int) (context Context, err error) {
	if !cm.HasKey(key) {
		err = errors.New(fmt.Sprintf("\"%s\" is not exists", key))
		return
	}
	context, ok := cm.contexts[id]
	if !ok {
		err = errors.New(fmt.Sprintf("\"%s\"[%d] is not exists", key, id))
		return
	}
	return
}

func (cm *ContextManager) RemoveContext(key key, id int) (path string, err error) {
	if !cm.HasKey(key) {
		err = errors.New(fmt.Sprintf("\"%s\" is not exists", key))
		return
	}
	context, ok := cm.contexts[id]
	if !ok {
		err = errors.New(fmt.Sprintf("\"%s\"[%d] is not exists", key, id))
		return
	}
	path = context.path
	delete(cm.contexts, id)
	return
}
