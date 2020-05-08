# FI Calc

[![Travis build status](http://img.shields.io/travis/jamesplease/fi-calc.svg?style=flat)](https://travis-ci.org/jamesplease/fi-calc)
[![Code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)

This is the development repository for [https://ficalc.app](https://ficalc.app).

### Contributing

Looking to help out? Refer to the [Contributing Guide](./CONTRIBUTING.md). Also, thanks!

### Deploying

First, install the `now` CLI:

```js
npm i -g now
```

Once you have this installed, there are [npm scripts](https://docs.npmjs.com/misc/scripts) to help with deployment.

- `npm run deploy` - Deploys the application to `staging.ficalc.app`.
- `npm run promote-staging` - Promotes the staging environment to production.
- `npm run deploy-prod` - Deploys the application to production.

> Heads up: if you're not me, you won't be able to deploy the application.

### Data Sources

- [U.S. Stock Market data](http://www.econ.yale.edu/%7Eshiller/data.htm) ([direct link](http://www.econ.yale.edu/%7Eshiller/data/ie_data.xls))

### Target environment support

- All evergreen browsers (including Edge)
- Android mobile browsers, iOS mobile Safari, iPadOS Safari

This app is not expected to work in Internet Explorer.
