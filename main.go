package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/engine/standard"
)

func main() {
	e := echo.New()

	e.File("/", "index.html")
	e.Static("/static", "static")
	e.Run(standard.New(":8091"))

}
