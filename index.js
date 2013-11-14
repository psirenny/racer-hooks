module.exports = function (store) {
  var __slice = [].slice;

  store.hook = function(method, pattern, fn) {
    return store.shareClient.use('after submit', function(shareRequest, next) {
      var backend, collectionName, docName, firstDot, fullPath, matches, op, opData, regExp, relPath, segments, session, snapshot, _i, _len, _ref;
      opData = shareRequest.opData;
      if (opData.del || opData.create) {
        collectionName = pattern;
        if (collectionName !== shareRequest.collection) {
          return next();
        }
      } else {
        firstDot = pattern.indexOf('.');
        if (firstDot === -1) {
          if (!patternToRegExp(pattern).test(collectionName)) {
            return next();
          }
        } else {
          collectionName = pattern.slice(0, firstDot);
          if (collectionName !== shareRequest.collection) {
            return next();
          }
        }
      }
      snapshot = shareRequest.snapshot, docName = shareRequest.docName, backend = shareRequest.backend;
      session = shareRequest.agent.connectSession;
      switch (method) {
        case 'del':
          if (!opData.del) {
            return next();
          }
          fn(docName, shareRequest.prev.data, session, backend);
          break;
        case 'create':
          if (!opData.create) {
            return next();
          }
          fn(docName, shareRequest.snapshot.data, session, backend);
          break;
        case 'change':
          _ref = opData.op;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            op = _ref[_i];
            segments = op.p;
            if (op.si || op.sd) {
              segments = segments.slice(0, -1);
            }
            relPath = segments.join('.');
            fullPath = collectionName + '.' + docName + '.' + relPath;
            regExp = patternToRegExp(pattern);
            matches = regExp.exec(fullPath);
            if (matches) {
              fn.apply(null, __slice.call(matches.slice(1)).concat([lookup(segments, snapshot.data)], [op], [session], [backend]));
            }
          }
      }
      return next();
    });
  };

  store.onQuery = function(collectionName, source, cb) {
    return this.shareClient.use('query', function(shareRequest, next) {
      var session;
      if (shareRequest.options.backend !== source) {
        return next();
      }
      session = shareRequest.agent.connectSession;
      shareRequest.query = deepCopy(shareRequest.query);
      if (collectionName === '*') {
        return cb(shareRequest.collection, shareRequest.query, session, next);
      } else {
        return cb(shareRequest.query, session, next);
      }
    });
  };

  var lookup, patternToRegExp;

  patternToRegExp = function(pattern) {
    var end;
    end = pattern.slice(pattern.length - 2, pattern.length);
    if (end === '**') {
      pattern = pattern.slice(0, pattern.length - 2);
    } else {
      end = '';
    }
    pattern = pattern.replace(/\./g, "\\.").replace(/\*/g, "([^.]*)");
    return new RegExp(pattern + (end ? '.*' : '$'));
  };

  lookup = function(segments, doc) {
    var curr, part, _i, _len;
    curr = doc;
    for (_i = 0, _len = segments.length; _i < _len; _i++) {
      part = segments[_i];
      if (curr !== void 0) {
        curr = curr[part];
      }
    }
    return curr;
  };

  return function (req, res, next) {
    return next();
  }
};