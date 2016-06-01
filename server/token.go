package main

import (
	"fmt"
	"time"
)

type token string
type TokenGenerator <-chan token

type tokenSeq struct {
	seq int
}

func NewTokenGenerator(size int) TokenGenerator {
	c := make(chan token, size)
	go func() {
		kg := tokenSeq{}
		for {
			c <- kg.NewToken()
		}
	}()
	return c
}

func (kg *tokenSeq) NewToken() token {
	t := time.Now().Unix()
	seq := kg.seq
	kg.seq += 1
	return token(fmt.Sprintf("%08X%08X", t, seq))
}
