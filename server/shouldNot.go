package main

func shouldNot(e error) {
	if e != nil {
		panic(e)
	}
}
