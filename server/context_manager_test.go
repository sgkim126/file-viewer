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
