racer-hooks
===========

Derby/Racer middleware that uses [derby-hook](https://github.com/derbyparty/derby-hook) to add hook functions to the store.

Installation
------------

    $ npm install racer-hooks --save

Usage
-----

In your server file:

    var derby = require('derby');
    var hooks = require('racer-hooks');

    // ...

    derby.use(hooks());
