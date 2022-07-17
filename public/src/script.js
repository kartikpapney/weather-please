// IFFEE
var openweathermapapi;
var opencagedataapi;
(()=> {
  if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
  } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.open("GET", "Author.xml", false);
  xmlhttp.send();
  xmlDoc = xmlhttp.responseXML;
  var name = xmlDoc.getElementsByTagName("name")[0].innerHTML;
  var github = xmlDoc.getElementsByTagName("github")[0].innerHTML;
  var linkedin = xmlDoc.getElementsByTagName("linkedin")[0].innerHTML;
  opencagedataapi = xmlDoc.getElementsByTagName("opencagedataapi")[0].innerHTML;
  openweathermapapi = xmlDoc.getElementsByTagName("openweathermapapi")[0].innerHTML;
  document.getElementById("github").setAttribute("href", github);
  document.getElementById("linkedin").setAttribute("href", linkedin);
  document.getElementsByClassName("note")[0].innerHTML=`<p>Developed with ❤️ by ${name}</p>`;
})();

let weather = {
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/onecall?q=" +
        city +
        "&hourly,daily"+
        "&units=metric&appid=" +
        openweathermapapi
    )
      .then((response) => {
        if (!response.ok) {
          alert("Information not available");
          throw new Error("Information not available");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },

  displayWeather: function (data) {
    console.log(data);
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    document.querySelector(".city").innerText = name;
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + " °C";
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },

};

let geocode = {
  reverseGeocode: function (latitude, longitude) {
    var api_url = "https://api.opencagedata.com/geocode/v1/json";
    var request_url =
      api_url +
      "?" +
      "key=" +
      opencagedataapi +
      "&q=" +
      encodeURIComponent(latitude + "," + longitude) +
      "&pretty=1" +
      "&no_annotations=1";

    var request = new XMLHttpRequest();
    request.open("GET", request_url, true);

    request.onload = function () {
      if (request.status == 200) {
        var data = JSON.parse(request.responseText);
        weather.fetchWeather(data.results[0].components.city||data.results[0].components.county);
      }
    };

    request.onerror = function () {
      console.log("unable to connect to server");
    };

    request.send(); 
  },
  getLocation: function() {
    function success (data) {
      geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, console.error);
    }
  }
};


document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
});

geocode.getLocation();