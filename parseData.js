'use strict';

window.constants = {
	'one-day'    : 86400000,
	'one-hour'   : this['one-day'] / 24,
	'one-minute' : this['one-hour'] / 60,
	'one-second' : this['one-minute'] / 60
}

var dataParser = ( function(){
	return {

		getData: function(){

			var data = this.data || this.filterData('action','h');
			return data;

		},

	 filterData: function(){

			if (!window.data) throw new Error('data was not loaded!');
			if ( arguments.length == 0 ) throw new Error('no filtering criteria were given.');
			var data = window.data;
			var old,key;
	 		for( var i=0; i<arguments.length; i++){
	 			old = data.length;
	 		  key = String(arguments[i])
	 			data = data.filter( function( object ){
					return object[ key ];
				});
				if ( old == data.length ){
					console.warn(`Filtering on ${ arguments[i] } is not removing anything from the data set.\n old data.length: ${old}, new data.length: ${data.length}`);
				}
				if( data.length == 0 ){
					console.warn(`Filtering on ${ arguments[i] } is creating an empty data set.`);
				}
	 		}//end for loop

			this.data = data;
			return data;

		},

		identifySessions: function(){
			var data = this.getData();
			var userEvents = this.users || this.identifyUniqueUsers();
			data.forEach( function( event ){
				if( Array.isArray( userEvents[ event.h ] )){
					userEvents[ event.h ].push( event );
				}
				else{
					userEvents[ event.h ] = [ event ];
				}
			});
			console.log(userEvents)
		},

		identifyUniqueUsers: function(){

			var data = this.getData();
			var users = {}, count = 0;

			data.forEach( function(event){
				if( !users[ String(event.h) ] ){
					users[ String(event.h) ] = true;
					count ++;
				}
			});

			this.userCount = count;
			this.users = users;
			return users;

		}
	}
})();

window.dataParser = dataParser;
console.log(window.dataParser.identifySessions());






