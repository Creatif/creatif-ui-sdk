# Introduction

## What is Gabriela?

Gabriela is a framework that allows you to structure your application logic
in a way that is natural for any type of application. Depending on what you are creating,
you can run it as a Node process, as an HTTP server or both. Your choice.

Gabriela also strives to be platform independent. She does not know (or cares) if she is executed
as a simple Node process, an HTTP server or a RabbitMQ consumer (or anything else for that matter), concentrate
on the business logic of your application first and then decide whether you want to implement it
as an HTTP server or something else.

## Responsibility and development

Framework software is the engine with which an application is built. That application can be a simple portfolio website, a personal project or
an entire business with which people actually earn their living. In that regard, building a framework,
for me personally, bears a big responsibility. A part of that responsibility is ensuring that the framework
is well tested in different scenarios. Gabriela has around 350 different tests and code coverage is at 99%. The goal
of these tests will always be 100% so you can be sure that what is described in the documentation will work.

If you cloned Gabriela, you can run all tests with `npm run test` command. There are also two commands for checking out
code coverage. The first one is `npm run console-coverage`. This will output the console coverage of Gabriela in the terminal.
The second one is `npm run coverage`. This will create an html output that you can run in your browser and is more
better for the eye. You can find it in the `coverage/lcov-report/index.html` file. Just open it in your browser and it will work.
I am using [Istanbul](https://istanbul.js.org/) for test coverage, more precisely, [nyc](https://github.com/istanbuljs/nyc)
for running them.

The second part is using it in production. Gabriela is currently in beta stage and is not yet ready
for production. It will stay in beta until it is absolutely proven in production by creating multiple applications.
Currently, the version is `1.0.3` because npm wouldn't let me publish it as a beta, for some reason.

I hope that makes sense to you.

## Why another framework when there are so many?

Gabriela is not an MVC framework. I know that that is not very popular since the MVC pattern
holds a large piece of ground in the framework landscape, but in my personal development,
I always thought that the MVC pattern lacks the building blocks for most common application development,
like validation, security, data transformation, dependency injection and the application logic itself.
There is only the Model, Controller and the View (and the usual best practice is to put very little logic
in the controller). Sure, most of the MVC frameworks ship with some kind of validation or security component,
but each framework implements it in its own way. In that regard, Gabriela introduces a different way
of thinking about creating and structuring applications.

Central pattern in Gabriela is the middleware pattern which allows you to structure your code
based on what the code actually does. Security handling has its own middleware, validation, data transformation
and others.

Gabriela also has a unique and intuitive dependency injection system with which you don't have to
think about requiring your CommonJS modules but how to wire up your dependencies in a way
that makes sense for your application logic.

Gabriela is also completely reusable. Basic building block in Gabriela is a module (not to be confused with a CommonJS module) which you can make
completely independent from the rest of your application and reuse it in another Gabriela application. Another building
block of Gabriela is a plugin which is basically a collection of modules. A plugin can be anything; from a simple utility that
creates a public dependency or an entire application which you can initialize with just one line of code.

Another aspect of Gabriela is the event system. Gabriela implements the Mediator pattern as an event system with which
you can transfer the logic of communicating with different components in one place.

If you find these concepts interesting, read on. It is going to get a lot more interesting.

# Installation

Gabriela is still in alpha stage and you can install it with

`npm install gabriela@alpha`