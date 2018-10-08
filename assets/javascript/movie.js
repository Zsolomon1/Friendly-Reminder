$("#submitMovie").on("click", function() {
	$(".poster").html("");
	//getting the movie name from the main search page

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://api.themoviedb.org/3/movie/now_playing?page=1&language=en-US&api_key=73e53def52ff9a718eda18d64097f3bc",
		"method": "GET",
		"headers": {},
		"data": "{}"
	}

	$.ajax(settings).done(function(response) {
		console.log(response);
	}).then(function(response) {
		console.log(response);
		for (i = 0; i < 5; i++) {




			var movieName = response.results[i].title;
			console.log(movieName);
			var final_id = "";
			// function havefinal() {
			//first ajax call to get the movie id
			var queryURL = " https://api.themoviedb.org/3/search/movie?api_key=73e53def52ff9a718eda18d64097f3bc&query=" + movieName;
			$.ajax({
				url: queryURL,
				method: "GET"
			}).then(function(response) {
				var first_id = JSON.stringify(response.results[0].id);
				final_id = eval(first_id);
				//second ajax call to get the video key and transfer to the youtube link
				var queryURL =
					"https://api.themoviedb.org/3/movie/" + final_id + "/videos?api_key=73e53def52ff9a718eda18d64097f3bc&language=en-US";
				$.ajax({
					url: queryURL,
					method: "GET"
				}).then(function(response) {
					//  var num = JSON.stringify(response.results.length);
					//  for (var i = 0; i <= num; i++) {
					var key_first = JSON.stringify(response.results[1].key);
					var key_final = eval(key_first);
					var newdiv = $("<div><br><br>");
					//using that key we are showing youtube video
					newdiv.append(
						"<iframe width='280' height='220' src='https://www.youtube.com/embed/" + key_final + "' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>"
					);
					newdiv.append("<br>");
					$(".poster").prepend(newdiv);
					//  }
				});
			});
		}
		// }
	});
	// havefinal();


});
