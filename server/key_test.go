package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestKeyShouldBeUnique(t *testing.T) {
	kg := keySeq{}
	key1 := kg.NewKey()
	key2 := kg.NewKey()
	key3 := kg.NewKey()
	key4 := kg.NewKey()
	key5 := kg.NewKey()
	key6 := kg.NewKey()
	key7 := kg.NewKey()
	assert.NotEqual(t, key1, key2)
	assert.NotEqual(t, key2, key3)
	assert.NotEqual(t, key3, key4)
	assert.NotEqual(t, key4, key5)
	assert.NotEqual(t, key5, key6)
	assert.NotEqual(t, key6, key7)
	assert.NotEqual(t, key7, key1)
}

func TestKeyShouldBe16Length(t *testing.T) {
	kg := keySeq{}
	key := kg.NewKey()
	assert.Equal(t, 16, len(key))
}
