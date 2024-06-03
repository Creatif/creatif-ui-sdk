# Getting started

#### Requirements

To install Creatif, you will have to have [Docker](https://docs.docker.com/engine/install/) 
installed.

#### Installation

After you install docker, you can install Creatif with

````javascript
npm create creatif-app@1.0.11
````

This installation script will ask you to create the app directory and weather you
want to install a starter project. Starter project is part of [Tutorial](tutorial)
but you can set it up if you want. After that, `cd` into you app directory and
run 

````javascript
docker compose up
````

Creatif ships with its own backend so this might take a while but this is the only
thing that you have to do to start using Creatif.

> NOTE
> 
> Creatif comes with its own backend that is written in Go. This backend will probably 
> start after Creatif is all setup so if you start the frontend and the backend throws an error,
> its probably because its still building. Wait a couple of seconds and it should work.
> Creatif runs on localhost:5173 and the backend is no localhost:3002