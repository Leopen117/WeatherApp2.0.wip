const button = document.getElementById("submit");
const locationName = document.getElementById("location");
let textCardBoxHead = document.getElementById("textCardBoxHead");
let cardBox = document.getElementById("cardBox");
let dataJsonTempWeatherCodeDate;
let dateArray = [];
let tempArray = [];
let date;
let temp;
let perci;
let image;
let chart;

// Get Data blbla foo
async function getLatLonOfLocationName() {
  const urlLocation = `https://nominatim.openstreetmap.org/search?q=${locationName.value}&format=json`;
  const dataPromiseLocation = await fetch(urlLocation);
  let dataJsonLocation = await dataPromiseLocation.json();
  let lat = dataJsonLocation[0].lat;
  let lon = dataJsonLocation[0].lon;
  getTempAndWeatherCodeForLatLong(lat, lon);
}
async function getTempAndWeatherCodeForLatLong(lat, lon) {
  const urlTempWeatherCode = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max`;
  const dataPromiseTempWeahterCode = await fetch(urlTempWeatherCode);
  dataJsonTempWeatherCodeDate = await dataPromiseTempWeahterCode.json();
  cardContent();
}
// Build card content data
function cardContent() {
  cardBox.replaceChildren();
  dateArray.length = 0;
  tempArray.length = 0;
  for (let i = 0; i < 7; i++) {
    date = dataJsonTempWeatherCodeDate.daily.time[i].split("-");
    date = date[2] + "." + date[1] + "." + date[0];
    dateArray.push(date);
    temp = dataJsonTempWeatherCodeDate.daily.temperature_2m_max[i];
    tempArray.push(temp);
    weatherCode = dataJsonTempWeatherCodeDate.daily.weather_code[i];
    if ((weatherCode == 60) | (weatherCode == 61)) {
      perci = "Heute empfehle ich mindestens eine Regenjacke!";
      image = "Images/static/cloudy.jpg";
    } else if ((weatherCode == 62) | (weatherCode == 63)) {
      perci = "Heute empfehle ich dir eine Regenjacke UND einen Schirm!";
      image = "Images/static/rain.jpg";
    } else if ((weatherCode == 64) | (weatherCode == 65)) {
      perci =
        "Heute empfehle ich dir zu hause zu bleiben oder ein Boot zu nehmen!";
      image = "Images/static/lightning.jpg";
    } else {
      perci = "Heute bleibt es trocken!";
      image = "Images/static/sun.jpg";
    }

    createCard(date, temp, perci, image, i);
  }
  chart.update();
}

// content card building
function createCard(date, temp, perci, image, i) {
  if (i == 0) {
    let pic0 = document.getElementById("pic0");
    pic0.src = image;
    textCardBoxHead.innerHTML = `<p id="text" class="card-text"><u><strong>${date}</u></strong><br>Es werden maximal ${temp}°C !<br>${perci}</p>
    <p class="block">
      <button type="button" class="btn btn-primary" data-bs-toggle="button">Mehr Infos gefällig?</button>
    </p>`;
  } else {
    cardBox.innerHTML += `<div class="card mx-auto" style="width: 18rem">
      <img id="pic" src=${image} width="198" height="164.5" class="card-img-top pt-3 img-fludi"
      alt="Wetter">
      <div class="card-body">
        <p id="text" class="card-text"><u><strong>${date}</u></strong><br>Es werden maximal ${temp}°C !<br>${perci}</p>
      </div>
      <p class="block">
        <button type="button" class="btn btn-primary" data-bs-toggle="button">Mehr Infos gefällig?</button>
      </p>`;
  }
}

// weather chart
chart = new Chart(document.getElementById("tempChart"), {
  type: "line",
  data: {
    labels: dateArray,
    datasets: [
      {
        label: "7-Tage Temperaturentwicklung in °C",
        data: tempArray,
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

button.addEventListener("click", getLatLonOfLocationName);
