$("#submitRestaurant").on("click", function() {
	var q = $("#textarea1").val().trim();

	var queryURL = "https://developers.zomato.com/api/v2.1/search?q=" + q + "&city_id=288&apikey=b13b32626d4cb71b9f846dd77d89bd03";

	$.ajax({
			url: queryURL,
			method: "GET"
		})


		// We store all of the retrieved data inside of an object called "response"
		.then(function(response) {
			console.log(response);
			$("#w1 > tbody").html("");
			for (var i = 0; i < 10; i++) {

				$("#w1 > tbody").append("<tr><td class='td'>" + response.restaurants[i].restaurant.name + "</td><td class='td'>" + response.restaurants[i].restaurant.location.address + "</td><td class='td'>" + response.restaurants[i].restaurant.user_rating.rating_text + "</td><td class='td'>" + response.restaurants[i].restaurant.cuisines + "</td><tr>");


				// var address=$("<p>");
				//   address.text("Address:"+response.restaurants[i].restaurant.location.address);
				//   address.addClass("a1");
				//   d.append(address);


				//   var rating=$("<p>");
				//   rating.text("Rating:"+response.restaurants[i].restaurant.user_rating.rating_text);
				//   rating.addClass("r1");
				//   d.append(rating);

				//   var rating=$("<p>");
				//   rating.text("Aggregate-Rating:"+response.restaurants[i].restaurant.user_rating.aggregate_rating);
				//   rating.addClass("ag1");
				//   d.append(rating);

				//   var votes=$("<p>");
				//   votes.text("Votes:"+response.restaurants[i].restaurant.user_rating.votes);
				//   votes.addClass("v1");
				//   d.append(votes);


				//   var cuisiens=$("<p>");
				//   cuisiens.text("cuisiens:"+response.restaurants[i].restaurant.cuisines);
				//   cuisiens.addClass("c1");
				//   d.append(cuisiens);

				//   var currency=$("<p>");
				//   currency.text("currency:"+response.restaurants[i].restaurant.currency);
				//   currency.addClass("c22");
				//   d.append(currency);



				//   $("#w1").append(d);




			}
		});
});