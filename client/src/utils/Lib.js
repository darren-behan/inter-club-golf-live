export default {
  // Logs in a user
  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
  generateUserDateTime: function(dbDateTime) {
    return new Date(
      dbDateTime._seconds * 1000 + dbDateTime._nanoseconds / 1000000,
    );
  }
}
