var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

// Show splash screen while waiting for data
var splashWindow = new UI.Window();

// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  text:'Downloading weather data...',
  font:'GOTHIC_28_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center',
  backgroundColor:'white'
});

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();

// Construct URL
var cityName = 'Seattle';
var myAPIKey = 'KEY-GOES-HERE';
var URL = 'http://api.openweathermap.org/data/2.5/forecast?q=' + cityName
          + '&appid=' + myAPIKey;

var seattleWeatherValues = {
  'thunderstorm': 'loud rain',
  'drizzle': "bit o' rain",
  'rain': 'normal',
  'snow': 'very cold rain',
  'atmosphere': 'rain suspended in air',
  'clear': 'too bright',
  'clouds': 'thinking about raining',
};

var parseFeed = function(data, quantity) {
  var items = [];
  for(var i = 0; i < quantity; i++) {
    // Always upper case the description string
    var weatherMain = data.list[i].weather[0].main.toLowerCase();
    console.log('weatherMain ='+weatherMain);
    var seattleWeather = seattleWeatherValues[weatherMain];
    if (seattleWeather === undefined) {
      seattleWeather = 'dunno, probably earthquake';
    }
    var title = seattleWeather;
    
    // Get date/time substring
    var time = data.list[i].dt_txt;
    time = time.substring(time.indexOf('-') + 1, time.indexOf(':') + 3);

    // Add to menu items array
    items.push({
      title:title,
      subtitle:time
    });
  }

  // Finally return whole array
  return items;
};

// Make the request
ajax(
  {
    url: URL,
    type: 'json'
  },
  function(data) {
    // Success!
    console.log('Successfully fetched weather data!');

    // Create an array of Menu items
    var menuItems = parseFeed(data, 10);

    // Check the items are extracted OK
    for(var i = 0; i < menuItems.length; i++) {
      console.log(menuItems[i].title + ' | ' + menuItems[i].subtitle);
    }
    
    // Construct Menu to show to user
    var resultsMenu = new UI.Menu({
      sections: [{
        title: 'Seattle Forecast',
        items: menuItems
      }]
    });

    // Show the Menu, hide the splash
    resultsMenu.show();
    splashWindow.hide();

    
  },
  function(error) {
    // Failure!
    console.log('Failed fetching weather data: ' + JSON.stringify(error));
  }
);
