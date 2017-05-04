# vsts-extension-board-control

## To Use

Install TypeScript & Gulp:

```
> npm install -g typescript gulp
```

Install node modules:

```
npm install
```

Hack the typings for the vss-web-extension-sdk package, because it's still supporting the old tsd way of doing things. I'm hoping this gets corrected soon, but I'm not holding my breath, it's been a issue since [2016](https://github.com/Microsoft/vss-web-extension-sdk/issues/8)

1. Modify the `node_modules/@types/node/index.d.ts` file, changing the require variable declaration to be RequireJS and NodeRequire (around line 73): `declare var require: Require|NodeRequire;`
2. Modify the `node_modules/@types/requirejs/index.d.ts` file, changing the require variable declaration to be RequireJS and NodeRequire (at the end of the file): `declare var require: Require|NodeRequire;`
3. Modify the `node_modules/vss-web-extension-sdk/typings/vss.d.ts` file, changing the require variable declaration to be RequireJS and NodeRequire (around line 233): `declare var require: Require|NodeRequire;`

### To Compile

To test compilation, you can run `gulp transpile-ts`. You should receive no errors.

