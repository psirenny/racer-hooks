racer-hooks
===========

Add server side hooks to [racer](https://github.com/codeparty/racer).

Installation
------------

    $ npm install racer-hooks

In *"/lib/server/index.js":

    require('racer-hooks')(store);

Usage
-----

    store.on('change', 'collection.*.property',
      function (documentId, value) {
        ...
      }
    );