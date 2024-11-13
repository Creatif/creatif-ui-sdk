# Getting started

> CAUTION
>
> Creatif is still deep in alpha stage. Some features might not work as expected.

# Requirements

To install Creatif, you will have to have [Docker](https://docs.docker.com/engine/install/)
installed.

# Installation (easy)

After you install docker, you can install Creatif with

```javascript
npm create creatif-app@latest
```

This installation script will ask you to create the app directory and weather you
want to install a starter project. Starter project is part of [Tutorial](tutorial)
but you can set it up if you want. After that, `cd` into you app directory and
run

```javascript
docker compose up
```

Creatif ships with its own backend so this might take a while but this is the only
thing that you have to do to start using Creatif. There is also some kind of issues 
that makes `npm install` very slow so if that happens to you, just be patient. Everything
should be working properly. 

If you decide to not create Creatif with a starter project, a runtime error will be
thrown. This is because Creatif cannot be used without configuration. Head over to
[Tutorial](tutorial) to learn and setup Creatif with a starter project.

> NOTE
>
> Creatif comes with its own backend that is written in Go. This backend will probably
> start after Creatif frontend is all set up so if you start the frontend and the backend throws an error,
> its probably because it's still building. Wait a couple of seconds and it should work.
> Creatif runs on _localhost:5173_ and the backend is on _localhost:3002_

# Installation (less easy)

You can also set up what `creatif-app` sets up for you. Creatif has a backend and a frontend.
First, open up two tabs in the terminal of your choice.

In the first tab, set up backend with

```shell
git clone git@github.com:Creatif/creatif-backend.git
cd creatif-backend
docker-compose up
```

or, shorthand

```shell
git clone git@github.com:Creatif/creatif-backend.git && cd creatif-backend && docker-compose up
```

In the second tab, set up frontend with

```shell
git clone git@github.com:Creatif/creatif-ui-sdk.git
cd creatif-backend
docker-compose up
```

or, shorthand

```shell
git clone git@github.com:Creatif/creatif-ui-sdk.git && cd creatif-backend && docker-compose up
```

Since I am personally working on the fronted, to make my life easier, I setted up a testing app
under the `uiApp` directory and this directory is excluded from the final build. You will only see it
if you clone the frontend in this way. Files and code in this directory will almost always change when I push
new features or bugs fixes for `creatif-ui-sdk` package so don't rely on it. If you choose to set up
this why, you will probably get an app that I am currently using to test new features. This app might be ugly,
have bugs or straight up be completely broken, so don't rely on it. But all things aside, this is just a
basic Vite project setted up to create a javascript library. Nothing more, nothing less.

If you want to set up your own testing environment, create a new directory in the root directory and create
the standard `index.tsx` that you can find in `uiApp` directory. Then, just modify `index.html` to point
to that file and it should work. Of course, be sure to set up Creatif properly.
