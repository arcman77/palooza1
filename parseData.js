'use strict';

window.constants = {
	'test': function(){console.log(this)},
	'one-day'    : function(){ return 86400000;},
	'one-hour'   : function(){ return this['one-day']() / 24;},
	'one-minute' : function(){ return this['one-hour']() / 60;},
	'one-second' : function(){ return this['one-minute']() / 60;}
}

var dataParser = ( function(){
	return {

		getData: function(){

			var data = this.data || this.filterData('action','h','ts');
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
			var userSessions = [];
			var idCount = 0;

			data.forEach( function( event ){
				if( Array.isArray( userEvents[ event.h ] )){
					userEvents[ event.h ].push( event );
				}
				else{
					userEvents[ event.h ] = [ event ];
				}
			});

			for( var userId in userEvents ){
				// console.log(userId)
				userEvents[ userId ] = userEvents[ userId ].sort(function(a,b){
					return a.ts - b.ts;
				});
				// console.log( userEvents[ userId ])
			}

			this.userEvents = userEvents;

			var previousTS, currentEvent, sessionEvents, start;

			for(var id in userEvents ){//loop through all users

				previousTS = userEvents[ id ][0].ts;
				start = previousTS;
				sessionEvents = [];

				for(var i in userEvents[ id ]){//loop through all events on a user
					currentEvent = userEvents[ id ][i];
					console.log(userEvents[id][i])
					if( currentEvent.ts - previousTS < window.constants['one-hour']()){
						sessionEvents.push( currentEvent );
						previousTS = currentEvent.ts;
					}
					else{
						 console.log('MORE', (currentEvent.ts - previousTS) /1000)
						 console.log(currentEvent)
						var sessionInfo = { 
							events: sessionEvents,
							duration: currentEvent.ts - start,
							start: start,
							stop: currentEvent.ts,
							userId: id,
							id: idCount
						};

						userSessions.push( sessionInfo );
						idCount++;
					  sessionEvents = [];
						previousTS = currentEvent.ts;
					}//end else

				}//end inner for

			}//end outer for

			this.sessions = userSessions;
			this.sessionsCount = userSessions.length;
			// console.log(userSessions)
			return userSessions;

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






