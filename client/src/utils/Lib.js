export default {
  // Logs in a user
  capitalize: function(str) {
    return [...str].reduce(
      (s, c, i, a) => s + (i === 0 || a[i - 1] === ' ' ? c.toUpperCase() : c),
      ''
    )
  },
  removeByAttr: function(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 
           arr.splice(i,1);
       }
    }
    return arr;
  }
}
