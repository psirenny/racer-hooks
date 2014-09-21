module.exports = function () {
  return function (derby) {
    derby.on('store', require('derby-hook'));
  };
};
