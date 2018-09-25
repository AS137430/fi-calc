# Contributing

Thanks for your interest in helping out! This guide should help you to get up and running. If you have
additional questions, please [open an issue](https://github.com/jamesplease/fi-calc/issues/new).

## Developing

### Prerequisites

FI Calc is a JavaScript web app. To run it locally, you'll need to have the following
installed on your machine:

- [Node.js](https://nodejs.org/en/) v8.9.1+
- [npm](https://www.npmjs.com) v5.5.1+

### Installation

First, clone this repository.

```
git clone git@github.com:jmeas/fi-calc.git
```

Then, navigate into the repository directory and install the [npm](https://www.npmjs.com/) dependencies:

```
cd fi-calc && npm install
```

#### Developer Scripts

These are npm scripts that should help you with development.

- `npm run watch`: Develop locally
- `npm test`: Run the tests with a watcher
- `npm run test -- --coverage`: Generate a coverage report
