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
  },
  eliminateDuplicates: function(arr) {
    var i,
        len = arr.length,
        out = [],
        obj = {};
  
    for (i = 0; i < len; i++) {
      obj[arr[i]] = 0;
    }
    for (i in obj) {
      out.push(i);
    }
    return out;
  },
  compare: function( a, b ) {
    if ( a.id < b.id ){
      return 1;
    }
    if ( a.id > b.id ){
      return -1;
    }
    return 0;
  }
}
