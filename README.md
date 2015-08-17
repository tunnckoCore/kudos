# [kudos][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] 

> kudos done right - unopinionated, made simple, so simple it hurts!

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]


## Install
```
npm i kudos --save
npm test
```


## Usage
> For more use-cases see the [tests](./test.js)

```js
var Kudos = require('kudos')

var kudos = new Kudos({
  element: document.querySelector('#kudos')
  delay: 1000
})

kudos
  .on('kudo:in', function () {
    // you can start styling your kudo
    // change classes and etc
    console.log('in')
    // `.active` class is set by default
  })
  .on('kudo:out', function () {
    console.log('out')
  })
  .once('kudo:complete', function () {
    // `.complete` class is set by default
    console.log('complete')
  })
```


## Related
- [apidocs-cli](https://github.com/tunnckocore/apidocs-cli): Command-line app for generating API docs from code comments. Can be used as API of `helper-apidocs` package.
- [dush](https://github.com/tunnckocore/dush): Minimalist 1.5kb event delegation for the browser (IE8+) and nodejs.
- [gitclone-cli](https://github.com/tunnckocore/gitclone-cli): Git clone github repository with pattern like `user/repo#branch`
- [minigrid](http://alves.im/minigrid): Minimal 2kb zero dependency cascading grid layout
- [minimist-plugins](https://github.com/jonschlinkert/minimist-plugins): Simple wrapper to make minimist pluggable. ~20 sloc.


## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/tunnckoCore/kudos/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.


## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckocore.tk][author-www-img]][author-www-url] [![keybase tunnckocore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]


[npmjs-url]: https://www.npmjs.com/package/kudos
[npmjs-img]: https://img.shields.io/npm/v/kudos.svg?label=kudos

[license-url]: https://github.com/tunnckoCore/kudos/blob/master/LICENSE.md
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg


[codeclimate-url]: https://codeclimate.com/github/tunnckoCore/kudos
[codeclimate-img]: https://img.shields.io/codeclimate/github/tunnckoCore/kudos.svg

[travis-url]: https://travis-ci.org/tunnckoCore/kudos
[travis-img]: https://img.shields.io/travis/tunnckoCore/kudos.svg

[coveralls-url]: https://coveralls.io/r/tunnckoCore/kudos
[coveralls-img]: https://img.shields.io/coveralls/tunnckoCore/kudos.svg

[david-url]: https://david-dm.org/tunnckoCore/kudos
[david-img]: https://img.shields.io/david/tunnckoCore/kudos.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg


[author-www-url]: http://www.tunnckocore.tk
[author-www-img]: https://img.shields.io/badge/www-tunnckocore.tk-fe7d37.svg

[keybase-url]: https://keybase.io/tunnckocore
[keybase-img]: https://img.shields.io/badge/keybase-tunnckocore-8a7967.svg

[author-npm-url]: https://www.npmjs.com/~tunnckocore
[author-npm-img]: https://img.shields.io/badge/npm-~tunnckocore-cb3837.svg

[author-twitter-url]: https://twitter.com/tunnckoCore
[author-twitter-img]: https://img.shields.io/badge/twitter-@tunnckoCore-55acee.svg

[author-github-url]: https://github.com/tunnckoCore
[author-github-img]: https://img.shields.io/badge/github-@tunnckoCore-4183c4.svg

[freenode-url]: http://webchat.freenode.net/?channels=charlike
[freenode-img]: https://img.shields.io/badge/freenode-%23charlike-5654a4.svg

[new-message-url]: https://github.com/tunnckoCore/messages
[new-message-img]: https://img.shields.io/badge/ask%20me-anything-green.svg