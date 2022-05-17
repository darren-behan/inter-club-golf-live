/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  get: function (key) {
    return sessionStorage.getItem(key);
  },
  set: function (key, value) {
    return sessionStorage.setItem(key, value);
  },
  remove: function () {},
  clear: function () {},
};
