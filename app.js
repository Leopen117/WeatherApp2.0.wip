const text0 = document.getElementById("text0");
const text1 = document.getElementById("text1");
const text2 = document.getElementById("text2");
const text3 = document.getElementById("text3");
const text4 = document.getElementById("text4");
const text5 = document.getElementById("text5");
const text6 = document.getElementById("text6");
const pic0 = document.getElementByName("pic0");
const pic1 = document.getElementByName("pic1");
const pic2 = document.getElementByName("pic2");
const pic3 = document.getElementByName("pic3");
const pic4 = document.getElementByName("pic4");
const pic5 = document.getElementByName("pic5");
const pic6 = document.getElementByName("pic6");
const button = document.getElementById("submit");

const foo = document.querySelector
const locationName = document.getElementById("location");
let percipitation;
let weatherCode;
let maxTemp;
let time;
let timeArray = [];
let tempArray = [];
let dataJsonTempWeatherCode;

async function getLatLonOfLocationName(){
    const urlLocation = `https://nominatim.openstreetmap.org/search?q=${locationName.value}&format=json`;
    const dataPromiseLocation = await fetch(urlLocation);
    let dataJsonLocation = await dataPromiseLocation.json();
    let lat = dataJsonLocation[0].lat;
    let lon = dataJsonLocation[0].lon;
    getTempAndWeatherCodeForLatLong(lat, lon)

}

async function getTempAndWeatherCodeForLatLong(lat, lon){
    const urlTempWeatherCode = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max`;
    const dataPromiseTempWeahterCode = await fetch(urlTempWeatherCode);
    dataJsonTempWeatherCode = await dataPromiseTempWeahterCode.json();

    for (let i = 0; i < 7; i++) {
        time = dataJsonTempWeatherCode.daily.time[i].split("-");
        time = time[2] + "." + time[1] + "." + time[0]
        timeArray.push(time);
        let pic =[pic0, pic1, pic2, pic3, pic4, pic5, pic6];
        let text = [text0, text1, text2, text3, text4, text5, text6];
        weatherCode = dataJsonTempWeatherCode.daily.weather_code[i];
        maxTemp = dataJsonTempWeatherCode.daily.temperature_2m_max[i];
        tempArray.push(maxTemp);
        picChange(pic[i], text[i]);
    }
    new Chart(document.getElementById('tempChart'), {
        type: 'line',
        data: {
          labels: timeArray,
          datasets: [{
            label: '7-Tage Temperaturentwicklung in °C',
            data: tempArray,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
}

function picChange(pic, text){
if(weatherCode == 60 | weatherCode == 61) {
    percipitation = "Heute empfehle ich mindestens eine Regenjacke!";
    pic.src = "Images/static/cloudy.jpg";
} else if(weatherCode == 62 | weatherCode == 63) {
    percipitation = "Heute empfehle ich dir eine Regenjacke UND einen Schirm!";
    pic.scr = "Images/static/rain.jpg";
} else if(weatherCode == 64 | weatherCode == 65) {
    percipitation = "Heute empfehle ich dir zu hause zu bleiben oder ein Boot zu nehmen!";
    pic.src = "Images/static/lightning.jpg";   
} else {
    percipitation = "Heute bleibt es trocken!";
    pic.src = "Images/static/sun.jpg";
}
text.innerHTML = "<u><strong>" + time + "</u></strong>" +"<br>" +"Es werden maximal " + maxTemp + "°C ! <br> " + percipitation;
}
button.addEventListener("click", getLatLonOfLocationName);


          
