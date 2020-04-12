# FI Calc

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

### Target browser support

To be honest, I haven't had an opportunity to do extensive browser testing. Eventually,
I would like to support all evergreen browsers, including Microsoft Edge. I do not intend to
support Internet Explorer.
