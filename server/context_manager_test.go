package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestContextManagerAddToken(t *testing.T) {
	cm := NewContextManager("/root")
	assert.False(t, cm.HasToken("a"))
	err := cm.AddToken("a")
	assert.True(t, cm.HasToken("a"))
	assert.Nil(t, err)
}

func TestContextManagerAddTokenReturnErrorOnDuplicated(t *testing.T) {
	cm := NewContextManager("/root")
	assert.False(t, cm.HasToken("a"))
	err := cm.AddToken("a")
	assert.True(t, cm.HasToken("a"))
	assert.Nil(t, err)
	err = cm.AddToken("a")
	assert.NotNil(t, err)
}

func TestContextManagerAddContext(t *testing.T) {
	cm := NewContextManager("/root")
	assert.False(t, cm.HasToken("a"))
	err := cm.AddToken("a")
	assert.True(t, cm.HasToken("a"))
	assert.Nil(t, err)
	_, err = cm.AddContext("a", "/tmp/a", "cat a")
	assert.Nil(t, err)
}

func TestContextManagerGetContextReturnErrorIfTokenIsNotExists(t *testing.T) {
	cm := NewContextManager("/root")
	_, err := cm.GetContext("a", 1)
	assert.NotNil(t, err)
}

func TestContextManagerGetContextReturnErrorIfIdIsNotExists(t *testing.T) {
	cm := NewContextManager("/root")
	_ = cm.AddToken("a")
	_, err := cm.GetContext("a", 1)
	assert.NotNil(t, err)
}

func TestContextManagerRemoveContextReturnsErrorIfTokenIsNotExists(t *testing.T) {
	cm := NewContextManager("/root")
	path, err := cm.RemoveContext("a", 1)
	assert.Equal(t, "", path)
	assert.NotNil(t, err)
}

func TestContextManagerRemoveContextReturnsErrorIfIdIsNotExists(t *testing.T) {
	cm := NewContextManager("/root")
	err := cm.AddToken("a")
	assert.Nil(t, err)
	path, err := cm.RemoveContext("a", 1)
	assert.Equal(t, "", path)
	assert.NotNil(t, err)
}

func TestContextManagerRemoveContextReturnsPath(t *testing.T) {
	cm := NewContextManager("/root")
	err := cm.AddToken("a")
	assert.Nil(t, err)
	seq := 1
	err := cm.AddContext(seq, "a", "path", "command")
	assert.Nil(t, err)
	path, err := cm.RemoveContext("a", seq)
	assert.Equal(t, "path", path)
	assert.Nil(t, err)
}
