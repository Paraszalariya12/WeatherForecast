


$(document).ready(function () {
    $('#txtCityName').typeahead({
        source: function (query, result) {

            $("#div_weather").hide();
            // Make AJAX request to fetch suggestions
            $.ajax({
                url: 'https://api.weatherapi.com/v1/search.json',
                method: 'GET',
                data: {
                    key: '16259518516b4af594e111520240703',
                    q: query
                },
                success: function (data) {
                    // Extract city names from response
                    var suggestions = data.map(function (item) {
                        return item.name;
                    });
                    // Pass suggestions to the Typeahead plugin
                    result(suggestions);
                },
                error: function (xhr, status) {
                    $("#div_weather").hide();
                    showToast("Something Went Wrong")
                }
            });
        }
    });

    $('#btn_Search').click(function () {
        var query = $('#txtCityName').val();

        if (query != "") {

            $("#spinner-div").show();
            // Make AJAX request to fetch weather data
            $.ajax({
                url: 'https://api.weatherapi.com/v1/current.json',
                method: 'GET',
                data: {
                    key: '16259518516b4af594e111520240703',
                    q: query,
                    aqi: 'no'
                },
                success: function (response) {
                    $("#div_weather").show();
                    // Handle successful response
                    console.log(response);
                    // Display weather data
                    $("#h5_datetime").text(getCurrentDateTime());
                    $('#city').text(response.location.name);
                    $('#temperature').text(response.current.temp_c);
                    $('#temperature_feranhit').text(response.current.temp_f);
                    $('#weatherDescription').text(response.current.condition.text);
                    $('#windSpeed').text(response.current.wind_kph + ' km/h');
                    $('#humidity').text('Humidity: ' + response.current.humidity + '%');
                    /*$("#my_image").attr("src", "https://"+response.current.condition.icon);*/

                    var iconUrl = response.current.condition.icon;
                    var $img = $('<img>').attr('src', iconUrl);
                    $('#iconContainer').html("");
                    $('#iconContainer').append($img);
                },
                error: function (xhr, status, error, ab) {
                    $("#div_weather").hide();
                    var jsonObject = JSON.parse(xhr.responseText);
                    showToast(jsonObject.error.message);
                    // Handle error
                    //console.error('Error:', error);
                },
                complete: function () {
                    $("#spinner-div").hide(); //Request is complete so hide spinner
                }
            });
        }
        else {
            showToast("Please Enter Your City Name.");
        }
    });
});
function showToast(message) {
    toastr.error(message);
}
function getCurrentDateTime() {
    // Get current date and time
    var now = new Date();

    // Get day of the week (e.g., "Tuesday")
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var dayOfWeek = days[now.getDay()];

    // Get hour (0-23)
    var hour = now.getHours();

    // Convert hour to 12-hour format (1-12)
    var hour12 = hour % 12 || 12;

    // Get AM or PM
    var ampm = hour < 12 ? 'AM' : 'PM';

    // Combine day of the week and time in the specified format
    var dateTime = dayOfWeek + ', ' + hour12 + ' ' + ampm;

    return dateTime;
}