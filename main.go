package main

import (
	"github.com/labstack/echo"
)

func main() {
	e := echo.New()

	e.File("/", "index.html")
	e.Static("/static", "static")
	e.Start(":8091")
}
