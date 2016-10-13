# Openfreecabs.org main page


## Prerequisites

[Go](https://golang.org/) or [Nginx](http://nginx.com)


## Installation

```
mkdir -p $GOPATH/src/github.com/maddevsio/
cd $GOPATH/src/github.com/maddevsio
git clone https://github.com/maddevsio/openfreecabs-web
cd openfreecabs-web
make depends
make
```

Or golang way

```
mkdir -p $GOPATH/src/github.com/maddevsio/
cd $GOPATH/src/github.com/maddevsio
git clone https://github.com/maddevsio/openfreecabs-web
cd openfreecabs-web
go get -v
go build -v
go install
```

## Run

```
./web
```
Open http://localhost:8091 in your browser

## Contributing

Feel free to create issues, sending pull requests.

1. Fork repo
2. Make a changes 
3. Commit
4. Create pull request
