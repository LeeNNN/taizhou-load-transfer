function generateTuYuanID() {
  var tuYuanID = 'PD_' + new Date().Format('yyyyMMddHHmmss') + random32()
  return tuYuanID
}
function random32() {
    var str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var random = '';
    for (var i = 16; i > 0; i--) {
        var index = Math.round(Math.random()*62);
        random += str[index];
    }
    return random;
}
export {
  generateTuYuanID
}
