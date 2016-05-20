package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestContextManagerAddKey(t *testing.T) {
	cm := NewContextManager()
	assert.False(t, cm.HasKey("a"))
	err := cm.AddKey("a")
	assert.True(t, cm.HasKey("a"))
	assert.Nil(t, err)
}

func TestContextManagerAddKeyReturnErrorOnDuplicated(t *testing.T) {
	cm := NewContextManager()
	assert.False(t, cm.HasKey("a"))
	err := cm.AddKey("a")
	assert.True(t, cm.HasKey("a"))
	assert.Nil(t, err)
	err = cm.AddKey("a")
	assert.NotNil(t, err)
}

func TestContextManagerAddContext(t *testing.T) {
	cm := NewContextManager()
	assert.False(t, cm.HasKey("a"))
	err := cm.AddKey("a")
	assert.True(t, cm.HasKey("a"))
	assert.Nil(t, err)
	_, err = cm.AddContext("a", "/tmp/a", "cat a")
	assert.Nil(t, err)
}

func TestContextManagerGetContextReturnErrorIfKeyIsNotExists(t *testing.T) {
	cm := NewContextManager()
	_, err := cm.GetContext("a", 1)
	assert.NotNil(t, err)
}

func TestContextManagerGetContextReturnErrorIfIdIsNotExists(t *testing.T) {
	cm := NewContextManager()
	_ = cm.AddKey("a")
	_, err := cm.GetContext("a", 1)
	assert.NotNil(t, err)
}

func TestContextManagerRemoveContextReturnsErrorIfKeyIsNotExists(t *testing.T) {
	cm := NewContextManager()
	path, err := cm.RemoveContext("a", 1)
	assert.Equal(t, "", path)
	assert.NotNil(t, err)
}

func TestContextManagerRemoveContextReturnsErrorIfIdIsNotExists(t *testing.T) {
	cm := NewContextManager()
	err := cm.AddKey("a")
	assert.Nil(t, err)
	path, err := cm.RemoveContext("a", 1)
	assert.Equal(t, "", path)
	assert.NotNil(t, err)
}

func TestContextManagerRemoveContextReturnsPath(t *testing.T) {
	cm := NewContextManager()
	err := cm.AddKey("a")
	assert.Nil(t, err)
	id, err := cm.AddContext("a", "path", "command")
	assert.Nil(t, err)
	path, err := cm.RemoveContext("a", id)
	assert.Equal(t, "path", path)
	assert.Nil(t, err)
}
