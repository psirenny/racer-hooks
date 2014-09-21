module.exports = function (derby) {
  derby.on('store', require('derby-hook'));
};
