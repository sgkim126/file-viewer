package main

import (
	"fmt"
	"time"
)

type key string
type KeyGenerator <-chan key

type keySeq struct {
	seq int
}

func NewKeyGenerator(size int) KeyGenerator {
	c := make(chan key, size)
	go func() {
		kg := keySeq{}
		for {
			c <- kg.NewKey()
		}
	}()
	return c
}

func (kg *keySeq) NewKey() key {
	t := time.Now().Unix()
	seq := kg.seq
	kg.seq += 1
	return key(fmt.Sprintf("%08X%08X", t, seq))
}
