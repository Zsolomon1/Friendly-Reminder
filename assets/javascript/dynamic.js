$(".homePage").hide();
// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("scheduleModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
$(document.body).on("click", "#scheduleModal", function() {
    modal.style.display = "block";
})

// When the user clicks on <span> (x), close the modal
$(document.body).on("click", ".close", function() {
    modal.style.display = "none";
})

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


// Hide login/Create account, show homePage
// $("#login").on("click", function(event) {
//     event.preventDefault();
//     $(".landingPage").hide();
//     $(".homePage").show();
// })

