export default {
  capitalize: function(string) {
    if (string === "" || string === null || string === undefined) {
      return;
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  removeByAttr: function(arr, attr, value) {
    var i = arr.length;
    while (i--) {
      if (arr[i] &&
        arr[i].hasOwnProperty(attr) &&
        (arguments.length > 2 && arr[i][attr] === value)) {
        arr.splice(i, 1);
      }
    }
    return arr;
  }
}