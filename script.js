const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    uvIndex = document.querySelector(".uv-index"),
    uvText = document.querySelector(".uv-text"),
    WindSpeed = document.querySelector(".wind-speed"),
    sunRise = document.querySelector(".sun-rise"),
    sunSet = document.querySelector(".sun-set"),
    humidity = document.querySelector(".humidity"),
    visibility = document.querySelector(".visibility"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status"),
    visibilityStatus = document.querySelector(".visibility-status"),
    weatherCards = document.querySelector("#weather-cards"),
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".week"),
    tempUnit = document.querySelectorAll(".temp-unit"),
    searchFrom = document.querySelector("#search"),
    search = document.querySelector("#query")

let currentCity = "";
let currentUnit = "c";
let hourlyorweek = "week";

//function to get date and time

function getDateTime() {
    let now = new Date();
    hour = now.getHours(),
        minute = now.getMinutes();

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    hour = hour % 12;
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        hour = "0" + minute;
    }

    let daystring = days[now.getDay()];
    return `${daystring}, ${hour}:${minute}`;

}
//Updating date and time
date.innerText = getDateTime();
setInterval(() => {
    date.innerText = getDateTime();
}, 1000);

// function to get public ip with fetch
function getPublicIp() {
    fetch("https://geolocation-db.com/json/", {
        method: "GET",
        headers: {},
    })
        .then((response) => response.json())
        .then((data) => {
            // console.log(data);
            currentCity = data.city;
            getWeatherData(data.city, currentUnit, hourlyorweek);
        })
        .catch((err) => {
            console.error(err);
        });
}
getPublicIp();

// function to get weather data

function getWeatherData(city, unit, hourlyorweek) {
    cityName.innerHTML = city
    const apiKey = "KKPR2WPLVM47LEY2G6SHMHEEX";
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
        {
            method: "GET",
            headers: {},
        }
    )
        .then((response) => response.json())
        .then((data) => {
            let today = data.currentConditions;
            if (unit === "c") {
                temp.innerText = today.temp;
            } else {
                temp.innerText = celciusToFahrenheit(today.temp)
            }
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            rain.innerText = "perc - " + today.precip + "%";
            uvIndex.innerText = today.uvindex;
            WindSpeed.innerText = today.windspeed;
            measureUvIndex(today.uvindex);
            mainIcon.src = getIcon(today.icon);
            changeBackground(today.icon);
            humidity.innerText = today.humidity + "%";
            updateHumidityStatus(today.humidity);
            visibility.innerText = today.visibility;
            updateVisibilityStatus(today.visibility);
            airQuality.innerText = today.winddir;
            updateAirQualityStatys(today.winddir);
            if (hourlyorweek === "hourly") {
                updateForecast(data.days[0].hours, unit, "day")
            } else {
                updateForecast(data.days, unit, "week")
            }
            sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
            sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
        })
        .catch((err) => {
            alert("City Not Found in Our Database");
        });
}

// function to convert celcius to fahrenheit
function celciusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);
}
submit.addEventListener("click", () => {
    getWeatherData(query.value)
})

// function to get uv index status

function measureUvIndex(uvIndex) {
    if (uvIndex <= 2) {
        uvText.innerText = "Low"
    }
    else if (uvIndex <= 5) {
        uvText.innerText = "Moderate";
    }
    else if (uvIndex <= 7) {
        uvText.innerText = "High";
    }
    else if (uvIndex <= 10) {
        uvText.innerText = "Very High";
    } else {
        uvText.innerText = "Extreme";
    }
}

function updateHumidityStatus(humidity) {
    if (humidity <= 30) {
        humidityStatus.innerText = "Low";
    }
    else if (humidity <= 60) {
        humidityStatus.innerText = "Moderate";
    } else {
        humidityStatus.innerText = "High";
    }
}

// function to get visibility status
function updateVisibilityStatus(visibility) {
    if (visibility <= 0.3) {
        visibilityStatus.innerText = "Dense Fog";
    }
    else if (visibility <= 0.16) {
        visibilityStatus.innerText = "Moderate Fog";
    }
    else if (visibility <= 0.35) {
        visibilityStatus.innerText = "Light Fog";
    }
    else if (visibility <= 1.13) {
        visibilityStatus.innerText = "Very Light Fog";
    }
    else if (visibility <= 2.16) {
        visibilityStatus.innerText = "Light Mist";
    }
    else if (visibility <= 5.4) {
        visibilityStatus.innerText = "Very Light Mist";
    }
    else if (visibility <= 10.8) {
        visibilityStatus.innerText = "Clear Air";
    } else {
        visibilityStatus.innerText = "Very Clear Air";
    }
}

// function to get air quality status
function updateAirQualityStatys(airquality) {
    if (airquality <= 50) {
        airQualityStatus.innerText = "Good👌";
    }
    else if (airquality <= 100) {
        airQualityStatus.innerText = "Moderate😐";
    }
    else if (airquality <= 150) {
        airQualityStatus.innerText = "Unhealthy for Sensitive Groups😷";
    }
    else if (airquality <= 200) {
        airQualityStatus.innerText = "Unhealthy😷";
    }
    else if (airquality <= 250) {
        airQualityStatus.innerText = "Very Unhealthy😨";
    } else {
        airQualityStatus.innerText = "Hazardous😱";
    }
}

// convert time to 12 hour format
function convertTimeTo12HourFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12' 
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;
}

// function to change weather icons
function getIcon(condition) {
    if (condition === "partly-cloudy-day") {
        return "https://i.ibb.co/PZQXH8V/27.png";
    } else if (condition === "partly-cloudy-night") {
        return "https://i.ibb.co/Kzkk59k/15.png";
    } else if (condition === "rain") {
        return "https://i.ibb.co/kBd2NTS/39.png";
    } else if (condition === "clear-day") {
        return "https://i.ibb.co/rb4rrJL/26.png";
    } else if (condition === "clear-night") {
        return "https://i.ibb.co/1nxNGHL/10.png";
    } else {
        return "https://i.ibb.co/rb4rrJL/26.png";
    }

}

// function to get day name from date
function getDayName(date) {
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return days[day.getDay()];
}

//get hours from hh:mm:ss
function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
        hour = hour - 12;
        return `${hour}:${min} PM`
    } else {
        return `${hour}:${min} AM`;
    }
}

//function to update Forecast
function updateForecast(data, unit, type) {
    weatherCards.innerHTML = "";

    let day = 0;
    let numCards = 0;
    // 24 cards if hourly weather and 7 for weekly 
    if (type === "day") {
        numCards = 24;
    } else {
        numCards = 7;
    }
    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");
        let dayName = getHour(data[day].datetime);
        if (type === "week") {
            dayName = getDayName(data[day].datetime);
        }
        let dayTemp = data[day].temp;
        if (unit === "f") {
            dayTemp = celciusToFahrenheit(data[day].temp);
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempUnit = "°C";
        if (unit === "f") {
            tempUnit = "°F";
        }
        card.innerHTML = `
         
        <h2 class="day-name">${dayName}</h2>
        <div class="card-icon">
            <img src="${iconSrc}" class="day-icon" alt="" />
        </div>
        <div class="day-temp">
        <h2 class="temp">${dayTemp}</h2>
        <span class="temp-unit">${tempUnit}</span>
    </div>
      `;
        weatherCards.appendChild(card);
        day++;
    }
}

// function to change background depending on weather conditions
function changeBackground(condition) {
    const body = document.querySelector("body");
    let bg = "";
    if (condition === "partly-cloudy-day") {
        bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
    } else if (condition === "partly-cloudy-night") {
        bg = "https://i.ibb.co/RDfPqXz/pcn.jpg";
    } else if (condition === "rain") {
        bg = "https://i.ibb.co/h2p6Yhd/rain.webp";
    } else if (condition === "clear-day") {
        bg = "https://i.ibb.co/WGry01m/cd.jpg";
    } else if (condition === "clear-night") {
        bg = "https://i.ibb.co/kqtZ1Gx/cn.jpg";
    } else {
        bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
    }
    body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bg})`
}

fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f");
});
celciusBtn.addEventListener("click", () => {
    changeUnit("c");
});

// function to change unit
function changeUnit(unit) {
    if (currentUnit !== unit) {
        currentUnit = unit;
        tempUnit.forEach((elem) => {
            elem.innerText = `°${unit.toUpperCase()}`;
        });
        if (unit === "c") {
            celciusBtn.classList.add("active")
            fahrenheitBtn.classList.remove("active")
        } else {
            celciusBtn.classList.remove("active")
            fahrenheitBtn.classList.add("active")
        }
        getWeatherData(currentCity, currentUnit, hourlyorweek);
    }
}

hourlyBtn.addEventListener("click", () => {
    changeTimespan("hourly");
});
weekBtn.addEventListener("click", () => {
    changeTimespan("week");
});

// function to change hourly to weekly or vice versa
function changeTimespan(unit) {
    if (hourlyorweek !== unit) {
        hourlyorweek = unit;

        if (unit === "hourly") {
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        } else {
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        // update weather on time change
        getWeatherData(currentCity, currentUnit, hourlyorweek);
    }
}

// function to handle search form
searchFrom.addEventListener("submit", (e) => {
    e.preventDefault();
    let location = search.value;
    if (location) {
        currentCity = location;
        getWeatherData(currentCity, currentUnit, hourlyorweek);
    }
});

const modeButton = document.getElementById('modeButton');
const modeIcon = document.getElementById('modeIcon');
const modeText = document.getElementById('modeText');

modeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    let mode = 'light';
    setMode(mode);
    if (document.body.classList.contains('dark-mode')) {
        modeIcon.classList.remove('fa-moon');
        modeIcon.classList.add('fa-sun');
        modeText.textContent = 'Light Mode';
        mode = 'dark';
        setMode(mode);
    } else {
        modeIcon.classList.remove('fa-sun');
        modeIcon.classList.add('fa-moon');
        modeText.textContent = 'Dark Mode';
        mode = 'light';
        setMode(mode);
    }
});

// Get the sidebar and main
const sidebar = document.querySelector('.sidebar');
const main = document.querySelector('.main');

function setMode(mode) {
    if (mode === 'light') {
        sidebar.style.backgroundColor = 'rgba(255, 255, 255, 0.815)';
        sidebar.style.color = 'black';
        main.style.backgroundColor = '#f6f6f8';
        main.style.color = 'black';
    } else {
        sidebar.style.backgroundColor = 'rgb(68, 67, 67)';
        sidebar.style.color = 'white';
        main.style.backgroundColor = 'rgb(66, 62, 62)';
        main.style.color = 'white';
    }
}

const darkModeButton = document.querySelector('#dark-mode-button');
const body = document.querySelector('body');

darkModeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
});

  