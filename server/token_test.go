package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTokenShouldBeUnique(t *testing.T) {
	kg := tokenSeq{}
	token1 := kg.NewToken()
	token2 := kg.NewToken()
	token3 := kg.NewToken()
	token4 := kg.NewToken()
	token5 := kg.NewToken()
	token6 := kg.NewToken()
	token7 := kg.NewToken()
	assert.NotEqual(t, token1, token2)
	assert.NotEqual(t, token2, token3)
	assert.NotEqual(t, token3, token4)
	assert.NotEqual(t, token4, token5)
	assert.NotEqual(t, token5, token6)
	assert.NotEqual(t, token6, token7)
	assert.NotEqual(t, token7, token1)
}

func TestTokenShouldBe16Length(t *testing.T) {
	kg := tokenSeq{}
	token := kg.NewToken()
	assert.Equal(t, 16, len(token))
}
