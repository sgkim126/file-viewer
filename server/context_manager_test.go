package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestContextManagerAddKey(t *testing.T) {
	cm := ContextManager{}
	assert.False(t, cm.HasKey("a"))
	err := cm.AddKey("a")
	assert.True(t, cm.HasKey("a"))
	assert.Nil(t, err)
}

func TestContextManagerAddKeyReturnErrorOnDuplicated(t *testing.T) {
	cm := ContextManager{}
	assert.False(t, cm.HasKey("a"))
	err := cm.AddKey("a")
	assert.True(t, cm.HasKey("a"))
	assert.Nil(t, err)
	err = cm.AddKey("a")
	assert.NotNil(t, err)
}

func TestContextManagerAddPath(t *testing.T) {
	cm := ContextManager{}
	assert.False(t, cm.HasKey("a"))
	err := cm.AddKey("a")
	assert.True(t, cm.HasKey("a"))
	assert.Nil(t, err)
	_, err = cm.AddPath("a", "/tmp/a")
	assert.Nil(t, err)
}

func TestContextManagerGetPathReturnErrorIfKeyIsNotExists(t *testing.T) {
	cm := ContextManager{}
	_, err := cm.GetPath("a", 1)
	assert.NotNil(t, err)
}

func TestContextManagerGetPathReturnErrorIfIdIsNotExists(t *testing.T) {
	cm := ContextManager{}
	_ = cm.AddKey("a")
	_, err := cm.GetPath("a", 1)
	assert.NotNil(t, err)
}
