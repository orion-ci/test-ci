function handleTime (time) {
  var date = new Date(time * 1000)
  var str = date.toLocaleDateString()
  str += ' ' + fillStr(date.getHours(), 2) + ':' + fillStr(date.getMinutes(), 2) + ':' + fillStr(date.getSeconds(), 2)
  return str
};
function fillStr (str, size, fill = '0') {
  var res = fill.repeat(size) + str
  return res.substr(-size)
};

export {
  handleTime
}
