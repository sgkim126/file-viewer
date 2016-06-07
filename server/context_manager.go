package main

import (
	"errors"
	"fmt"
)

type Context struct {
	token   token
	path    string
	command string
}

type ContextManager struct {
	contexts map[int]Context
	tokens   []token
	root     string
}

func NewContextManager(root string) ContextManager {
	return ContextManager{
		make(map[int]Context, 0),
		make([]token, 0),
		root,
	}
}

func (cm ContextManager) HasToken(token token) bool {
	for i := range cm.tokens {
		if cm.tokens[i] == token {
			return true
		}
	}
	return false
}

func (cm ContextManager) HasContext(token token, id int) bool {
	if !cm.HasToken(token) {
		return false
	}
	context, ok := cm.contexts[id]
	if !ok {
		return false
	}
	return context.token == token
}

func (cm *ContextManager) AddToken(token token) error {
	if cm.HasToken(token) {
		return errors.New(fmt.Sprintf("\"%s\" is duplicated", token))
	}
	cm.tokens = append(cm.tokens, token)
	return nil
}

func (cm ContextManager) Root() string {
	return cm.root
}

func (cm *ContextManager) AddContext(seq int, token token, path string, command string) error {
	if !cm.HasToken(token) {
		return errors.New(fmt.Sprintf("\"%s\" is not exists", token))
	}
	cm.contexts[seq] = Context{
		token,
		path,
		command,
	}
	return nil
}

func (cm ContextManager) GetContext(token token, seq int) (context Context, err error) {
	if !cm.HasToken(token) {
		err = errors.New(fmt.Sprintf("\"%s\" is not exists", token))
		return
	}
	context, ok := cm.contexts[seq]
	if !ok {
		err = errors.New(fmt.Sprintf("\"%s\"[%d] is not exists", token, seq))
		return
	}
	return
}

func (cm *ContextManager) RemoveContext(token token, seq int) (path string, err error) {
	if !cm.HasToken(token) {
		err = errors.New(fmt.Sprintf("\"%s\" is not exists", token))
		return
	}
	context, ok := cm.contexts[seq]
	if !ok {
		err = errors.New(fmt.Sprintf("\"%s\"[%d] is not exists", token, seq))
		return
	}
	path = context.path
	delete(cm.contexts, seq)
	return
}
