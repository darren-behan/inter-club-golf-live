export default {
  get: function(key) {
    return localStorage.getItem(key);
  },
  set: function (key, value) {
    return localStorage.setItem(key, value);
  },
  remove: function(key) {
    return localStorage.removeItem(key);
  },
  clear: function() {
    return localStorage.clear();
  }
}