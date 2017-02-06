# ezajax-node
a middleware which let broswer js or http client can invoke server method

# Chart
.
|____.git
| |____config
| |____description
| |____FETCH_HEAD
| |____HEAD
| |____hooks
| | |____applypatch-msg.sample
| | |____commit-msg.sample
| | |____post-update.sample
| | |____pre-applypatch.sample
| | |____pre-commit.sample
| | |____pre-push.sample
| | |____pre-rebase.sample
| | |____prepare-commit-msg.sample
| | |____update.sample
| |____index
| |____info
| | |____exclude
| |____logs
| | |____HEAD
| | |____refs
| | | |____heads
| | | | |____develop
| | | |____remotes
| | | | |____origin
| | | | | |____HEAD
| |____objects
| | |____info
| | |____pack
| | | |____pack-8cceffbb1678741eb465d234815980e15f234eec.idx
| | | |____pack-8cceffbb1678741eb465d234815980e15f234eec.pack
| |____packed-refs
| |____refs
| | |____heads
| | | |____develop
| | |____remotes
| | | |____origin
| | | | |____HEAD
| | |____tags
|____.gitignore
|____.gitlab-ci.yml
|____example
| |____ajax
| | |____test.es6
| |____index.es6
| |____web
| | |____index.html
| | |____libs
| | | |____angularjs
| | | | |____angular-state-helper.min.js
| | | | |____angular-ui-router.min.js
| | | | |____angular.min.js
| | | | |____ui-bootstrap-tpls.min.js
| | | |____animate.min.css
| | | |____bootstrap
| | | | |____css
| | | | | |____bootstrap.min.css
| | | | |____fonts
| | | | | |____glyphicons-halflings-regular.eot
| | | | | |____glyphicons-halflings-regular.svg
| | | | | |____glyphicons-halflings-regular.ttf
| | | | | |____glyphicons-halflings-regular.woff
| | | | | |____glyphicons-halflings-regular.woff2
| | | |____flat-ui
| | | | |____css
| | | | | |____flat-ui.min.css
| | | | |____fonts
| | | | | |____glyphicons
| | | | | | |____flat-ui-icons-regular.eot
| | | | | | |____flat-ui-icons-regular.svg
| | | | | | |____flat-ui-icons-regular.ttf
| | | | | | |____flat-ui-icons-regular.woff
| | | | | | |____selection.json
| | | | | |____lato
| | | | | | |____lato-black.eot
| | | | | | |____lato-black.svg
| | | | | | |____lato-black.ttf
| | | | | | |____lato-black.woff
| | | | | | |____lato-bold.eot
| | | | | | |____lato-bold.svg
| | | | | | |____lato-bold.ttf
| | | | | | |____lato-bold.woff
| | | | | | |____lato-bolditalic.eot
| | | | | | |____lato-bolditalic.svg
| | | | | | |____lato-bolditalic.ttf
| | | | | | |____lato-bolditalic.woff
| | | | | | |____lato-italic.eot
| | | | | | |____lato-italic.svg
| | | | | | |____lato-italic.ttf
| | | | | | |____lato-italic.woff
| | | | | | |____lato-light.eot
| | | | | | |____lato-light.svg
| | | | | | |____lato-light.ttf
| | | | | | |____lato-light.woff
| | | | | | |____lato-regular.eot
| | | | | | |____lato-regular.svg
| | | | | | |____lato-regular.ttf
| | | | | | |____lato-regular.woff
| | | | |____js
| | | | | |____flat-ui.min.js
| | | |____html5shiv.js
| | | |____jquery.min.js
| | | |____respond.min.js
|____gulpfile.js
|____index.es6
|____package.json
|____src
| |____client
| | |____angular_template.hbs
| | |____assets
| | | |____ajax.js
| | | |____es5-shim.js
| | | |____invoker.js
| | | |____json.js
| | | |____promise.js
| | |____js_handler.es6
| | |____normal_template.hbs
| |____container.es6
| |____decorator
| | |____params.es6
| | |____permission.es6
| | |____validate.es6
| |____ezajax.es6
| |____middleware
| | |____args_format.es6
| | |____args_validate.es6
| | |____context_init.es6
| | |____invoke.es6
| | |____invoke_check.es6
| | |____multiparty_parse.es6
| | |____permission_check.es6
| |____util
| | |____error.es6
| | |____logger.es6
|____test
| |____browser
| | |____angularjs
| | | |____basic.js
| | | |____throw_error.js
| | | |____with_args.js
| | |____angularjs.html
| | |____libs
| | | |____angular.js
| | | |____mocha.css
| | | |____mocha.js
| | | |____should.js
| | |____normal
| | | |____basic.js
| | | |____throw_error.js
| | | |____with_args.js
| | |____normal.html
| |____http_client
| | |____simple.es6
| |____server
| | |____ajax
| | | |____account.es6
| | | |____basic.es6
| | | |____permission.es6
| | | |____promise.es6
| | | |____throw_error.es6
| | | |____validate.es6
| | | |____with_args.es6
| | |____index.es6
