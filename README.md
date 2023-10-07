# FretePago - Gas Station API

This project is the back-end for the Banking App - Gas Station front-end.

## Setup

### Requirements

- Install [docker](https://docs.docker.com/install/) (version 18.09+)
- Install [docker-compose](https://docs.docker.com/compose/install/)
- Install [make](https://howtoinstall.co/pt/make)

### Prepare your development environment

* Create a copy `.env` file from `.env.example` and populate the variables.

## Docker

* Build

```
make build
```

* Start - app should boot at: [http://localhost:5000](http://localhost:5000)

```
make up
```

* Read Logs

```
make logs
```

* Shutdown

```
make down
```

* Test

```
make test
```

### API Documentation

* The app documentation can be viewed at: [http://localhost:5000/docs](http://localhost:5000/docs)
s