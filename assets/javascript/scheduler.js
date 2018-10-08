var config = {
	apiKey: 'AIzaSyB27xa0pi1M-4djxsF-mlyRWbGgtatuNPc',
	authDomain: 'friendly-reminder-7a756.firebaseapp.com',
	databaseURL: 'https://friendly-reminder-7a756.firebaseio.com',
	projectId: 'friendly-reminder-7a756',
	storageBucket: 'friendly-reminder-7a756.appspot.com',
};
firebase.initializeApp(config);

var database = firebase.database();
var eventList;

function writeUserData(userId, fName, lName, pass) {
	//if its taken dont do it and complain
	database.ref('users/' + userId).set({
		'username': userId,
		'fName': fName,
		'lName' : lName,
		'pass': pass
		// 'schedule': ''
	});
}

function createGroup(groupName, currUser) {
	//add checker so you dont overwrite groups
	database.ref('groups/'+ groupName).set({
		'name': groupName,
		members: {
			[currUser]: true
		}
	});
	database.ref('groupUsers/'+groupName).set({
		[currUser]: true
	});
	database.ref('userGroups/'+currUser).update({
		[groupName]: true
	});
	$('#dropdown1').append('<li class=\'dropGroup\' id=\''+groupName+'\'>'+groupName+'</li>');
}

function joinGroup(groupName, currUser) {
	//add checker to make sure group exists
	database.ref('groups/'+groupName+'/members/').update({
		[currUser]:true
	});
	database.ref('groupUsers/'+groupName).update({
		[currUser]: true
	});
	database.ref('userGroups/'+currUser).update({
		[groupName]: true
	});
	$('#dropdown1').append('<li class=\'dropGroup\' id=\''+groupName+'\'>'+groupName+'</li>');
}

function updateUserSchedule(currUser) {
	var currSchedule = database.ref('schedules/'+currUser);
	
	currSchedule.set(eventList);    
}

$(document).on('click','#createAccount', function() {
    event.preventDefault();
    var newUser = $('#createUsername').val().trim();
    var newPass = $('#createPassword').val().trim();
    var newFName = $('#firstName').val().trim();
    var newLName = $('#lastName').val().trim();
    //var checker = database.ref('/users');
    
    // Tests to see if /users/<userId> has any data. 
    function checkIfUserExists(userId) {
        if ([newUser, newPass, newFName, newLName].includes('')) {
			console.log('Please fill out entire form');
			$('#accountDiv').addClass('fail');
    
        }
        else {
        	database.ref('/users').once('value').then(function(snapshot) {
				console.log(snapshot);
				console.log(snapshot.hasChild(userId))
				var checker = snapshot.hasChild(userId);
			if (checker) {
				console.log('Username Taken');
				$('#accountDiv').addClass('fail');
			}
			else {
				console.log('New User Created');
				writeUserData(newUser, newFName, newLName, newPass);
				$('#accountDiv').addClass('success');
			}
			}).catch(function (error) {
				console.log('Failed to check for account or make account', error);
			  });
		}
	}
	  
    checkIfUserExists(newUser);
    
    
});

$(document).on("click", "#login", function() {

        //firebase login functionality
        //
        event.preventDefault();
        var logUser = $('#username').val().trim();
        var logPass = $('#password').val().trim();
        console.log('login click');


        //maybe add function name as input
        // function logBS() {
        //     console.log('bs');
        // }
        function checkIfUserExists(userId) {
            if ([logUser, logPass].includes('')) {
				console.log('Please fill out entire form');
				
				$('#logDiv').addClass('fail');
            }
            else {
            database.ref('/users').once('value').then(function(snapshot) {
                console.log(snapshot);
                console.log(snapshot.hasChild(userId));
                var checker = snapshot.hasChild(userId);
				if (checker) {
					console.log('Username exists');
					console.log(snapshot.child(userId).child('pass').val());
					var storedPass = snapshot.child(userId).child('pass').val();
					if (storedPass==logPass) {
						console.log('success');
						localStorage.setItem("name", userId);
						$(".landingPage").hide();
						$(".homePage").show();  
						//nest the rest of the code here? probably yes though this seems sus
						postLoginScreen();
					}
					else {
						console.log('Wrong Username/Password');
						$('#logDiv').addClass('fail');
					}
				}
			}).catch(function (error) {
				console.log('Failed to login', error);
			});
			}
        }  

        checkIfUserExists(logUser);

	function postLoginScreen() {

		var weatherAPIKey = "31cf0d281ebbf40675ce6d09d12a89dc";
		var weatherQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=atlanta&appid=" + weatherAPIKey;

		function getSched() {
			database.ref('/schedules/'+localStorage.getItem("name")).once('value').then(function(snapshot) {

				//eventList = snapshot.val();
				// console.log(snapshot.val(), snapshot.val);
				eventList = Object.keys(snapshot.val()).map(i => snapshot.val()[i]);
				// console.log(eventList, eventList[0]);
				$('#scheduler').fullCalendar('renderEvents', eventList);	

			
			}).catch(function (error) {
				console.log('No schedule yet', error);
			  });
		}
		getSched();

		function createCalendar(newEvent) {
			$(document).off("click");
			$('#scheduler').fullCalendar({
				defaultView: 'agendaWeek',
				navLinks: true, // can click day/week names to navigate views
				editable: false,
				eventLimit: true, // allow "more" link when too many events
				events: newEvent,
				eventClick: function(calEvent, jsEvent, view) {
					// Clear the displayWeather div
					$("#displayWeather").html("");
					// Get the start time and end time of the event.
					var calEventStart = calEvent.start._i;
					var calEventEnd = calEvent.end._i;
					calEventStart = moment(calEventStart).unix();
					calEventEnd = moment(calEventEnd).unix();
					// This will display the weather

					$.ajax({
						url: weatherQueryURL,
						method: "GET"
					}).then(function(response) {
						var responseTime;
						// Hint: To convert from Kelvin to Fahrenheit: F = (K - 273.15) * 1.80 + 32

						for (var i = 0; i < 40; i++) {
							responseTime = moment(response.list[i].dt_txt).unix();
							if (calEventStart <= responseTime && responseTime <= calEventEnd) {
								var displayWeather = $("#displayWeather");
								var location = "<h6>Location: " + response.city.name + "</h6>";
								var timeDate = "<h6>Date & Time: " + response.list[i].dt_txt + "</h6>";
								var Temp = "<h6>Temperature: " + Math.floor((response.list[i].main.temp_max - 273.15) * 1.80 + 32) + "°F</h6>";
								var humidity = "<h6>Humidity: " + response.list[i].main.humidity + "%</h6>";
								var baseDescription = response.list[i].weather[0].description;
								var capitalDescription = baseDescription.charAt(0).toUpperCase() + baseDescription.slice(1);
								var weatherDescription = "<h6>Description: " + capitalDescription + "</h6>";
								var icon = $("<img>");
								icon.addClass("p1");
								icon.attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
								displayWeather.append(icon);
								displayWeather.append(location + timeDate + Temp + humidity + weatherDescription);
							}
						}
					});
				}
			});

			// Add new events to the schedule
			$(document).on("click", "#addToSchedule", function(event) {
				event.preventDefault();
				var startTime = $("#userStartTime").val();
				var endTime = $("#userEndTime").val();
				var reason = $("#userReason").val();
				var addedEvent = {
					title: reason,
					start: startTime,
					end: endTime
				}
				$('#scheduler').fullCalendar('renderEvent', addedEvent);
				//eventList.push(addedEvent);
				//allows schedule to be made correctly even if no schedule previously exists
				if (eventList) {
					eventList.push(addedEvent);
				}
				else {
					eventList= [addedEvent];
				}

				// Update Firebase
				updateUserSchedule(localStorage.getItem("name"));
				// Clear text values and remove the modal
				$("#userStartTime").val("");
				$("#userEndTime").val("");
				$("#userReason").val("");
				modal.style.display = "none";
			});

			// Find free time
			$(document).on("click", "#findFreeTime", function(event) {
				event.preventDefault();
				// Sort eventList by start time
				function sortByKey(array, key) {
					return array.sort(function(a, b) {
						var x = a[key];
						var y = b[key];
						return ((x < y) ? -1 : ((x > y) ? 1 : 0));
					});
				}

				sortByKey(eventList, "start");
				console.log(eventList);

				// Remove existing events from calendar
				$('#scheduler').fullCalendar('removeEvents');

				// Render new events where start time is the previous event's end time and end time is the next event's start time.
				for (var j = 0; j < (eventList.length); j++) {

					if (j == (eventList.length - 1)) {
						function nextDate(dayIndex) {
							var today = new Date();
							today.setDate(today.getDate() + (dayIndex - 1 - today.getDay() + 7) % 7 + 1);
							return today;
						}
						var freeTimeEvent = {
							title: "Free time",
							start: eventList[j].end,
							end: nextDate(6).toLocaleString()
						}
						$('#scheduler').fullCalendar('renderEvent', freeTimeEvent);
					} else if (eventList[j].end < eventList[j + 1].start) {
						var freeTimeEvent = {
							title: "Free time",
							start: eventList[j].end,
							end: eventList[j + 1].start
						}
						$('#scheduler').fullCalendar('renderEvent', freeTimeEvent);
					}
				}
			})

			// Revert back to individual schedule view
			$(document).on("click", "#showSchedule", function() {
				event.preventDefault();
				$('#scheduler').fullCalendar('removeEvents');
				getSched();
			});

			$(document).on("click", "#createGroup", function() {
				event.preventDefault();
				console.log($('#newGroup'))
				var newGroupName = $('#newGroup').val().trim();
			
				createGroup(newGroupName, localStorage.getItem("name"));
				// $('#newGroup').val();
			});

			$(document).on("click", "#joinGroup", function() {
				event.preventDefault();
				console.log($('#groupToJoin'));
				var joinName = $('#groupToJoin').val().trim();

				joinGroup(joinName, localStorage.getItem("name"));
				// $('#groupToJoin').val('');
			});
			//grabs data to populate dropdown button
			database.ref('/userGroups/'+localStorage.getItem("name")).once('value').then(function(snapshot) {
				var userGroups = snapshot.val();
				var userGroupsArray = Object.keys(userGroups);
				console.log(userGroups);
				console.log(userGroupsArray);
				for (var i=0;i<userGroupsArray.length;i++) {
					$('#dropdown1').append('<li class=\'dropGroup\' id=\''+userGroupsArray[i]+'\'>'+userGroupsArray[i]+'</li>');
				}
			}).catch(function (error) {
				console.log('Not in groups yet', error);
			  });
			  
			//gives dropdown functionality thanks to materialize
			$('.dropdown-trigger').dropdown();

			$(document).on('click', '.dropGroup', function() {
				// console.log('does something :O')
				// console.log($('this'));
				console.log(this);  
				var currGroup = this.id;
				var groupEventsList;
				
				console.log(currGroup);
				//localStorage.setItem('group', currGroup);
				var key_Arr;
				var results = [];
				database.ref('groupUsers/'+currGroup).once('value')
				.then(groupUserSnap => {
					var users = groupUserSnap.val();
					var promises = [];
					for (var user in users) {
						var p = database.ref(`schedules/${user}`).once('value');
						promises.push(p);
					}
					return Promise.all(promises)
				})
				.then(userSnapshots => {
					// var results = [];
					userSnapshots.forEach(userSnap => {
						var data = userSnap.val();
						results.push(data);
					})
					console.log(results);
					return results;

				}).then( function(snap) {
					var localEventsList= results.map(function(obj) {
						return Object.keys(obj).sort().map(function(key) {
							return obj[key];
						});
					});
					console.log(localEventsList);
					groupEventsList=[].concat.apply([], localEventsList);
					console.log(groupEventsList);
					return groupEventsList
				})
				.then(function(snapFin) {

							function sortByKey(array, key) {
								return array.sort(function(a, b) {
								var x = a[key]; var y = b[key];
								return ((x < y) ? -1 : ((x > y) ? 1 : 0));
								});
							}
						
							sortByKey(groupEventsList, "start");
							console.log(eventList);
						
							// Remove existing events from calendar
							$('#scheduler').fullCalendar('removeEvents');
						
							// Render new events where start time is the previous event's end time and end time is the next event's start time.
							for (var j = 0; j < (eventList.length); j++) {
								
								if (j == (eventList.length - 1)) {
									function nextDate(dayIndex) {
										var today = new Date();
										today.setDate(today.getDate() + (dayIndex - 1 - today.getDay() + 7) % 7 + 1);
										return today;
									}
									var freeTimeEvent = {
										title: "Free time",
										start: eventList[j].end,
										end: nextDate(6).toLocaleString()
									}
									$('#scheduler').fullCalendar('renderEvent', freeTimeEvent);
								}
								else if (eventList[j].end < eventList[j + 1].start) {
									var freeTimeEvent = {
										title: "Free time",
										start: eventList[j].end,
										end: eventList[j + 1].start
									}
									$('#scheduler').fullCalendar('renderEvent', freeTimeEvent);
								}        
							}
						}).catch(function (error) {
							console.log('Can\'t merge schedules', error);
						  });
			});                        
		}



		// Call the createCalendar function with the values in the event list
		console.log(eventList);
		createCalendar(eventList);


	}
});

