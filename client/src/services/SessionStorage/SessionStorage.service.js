export default {
  get: function(key) {
    return sessionStorage.getItem(key)
  },
  set: function(key, value) {
    return sessionStorage.setItem(key, value);
  },
  remove: function(key) {},
  clear: function() {}
}