let capture;
let weather;
let temperature = 0;
let forecast = "";
let calendar;
let news;
let weight;
let w_change;

let bx;
let by;
let boxSize = 25;
let overBox = false;
let locked = false;
let pressed = false;


function preload() {
  let w_url = "https://api.openweathermap.org/data/2.5/weather?q=Lubbock&units=imperial&APPID=e812164ca05ed9e0344b89ebe273c141";
  weather = loadJSON(w_url);
  
  calendar = loadTable("calendar.csv", "csv", "header");
  news = loadTable("articles.csv", "csv", "header");
}

function setup() {
  createCanvas(640, 480);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  
  temperature = weather.main.temp;
  forecast = weather.weather[0].description;
  
  bx = width/2;
  by = height-26;
  rectMode(RADIUS);
  strokeWeight(2);
  
  weight = random(100, 300);
  w_change = random(-10, 10);
}

function draw() {
  background(255);
  
  push();
  translate(width,0);
  scale(-1, 1);
  image(capture, 0, 0, 640, 480);
  pop();
  
  //Draw light source if button pressed
  if(mouseX > bx - boxSize &&
     mouseX < bx + boxSize &&
     mouseY > by - boxSize &&
     mouseY < by + boxSize) {
    overBox = true;
    if(!locked) {
      stroke(0);
      fill(244, 122, 158);
    }
  } 
  else {
      fill(244, 122, 158);
      overBox = false;
  }
  rect(width/2, height-26, 25, 25);
  
  if(pressed) {
    fill(250, 5, 0, 63);
    noStroke();
    rect(0, 0, 640, 480);
  }
  else {
    noFill();
    noStroke();
    rect(0, 0, 640, 480);
  }
  
  textFont('Georgia');
  textAlign(LEFT);
  
  // Draw current time
  fill(0, 200, 0, 103);
  noStroke();
  rect(10, 115, 90, 40, 25);
  fill(255);
  textSize(17);
  var min = minute();
  var hrs = hour();
  var mer = hrs < 12 ? "AM":"PM";
  min = min<10 ? "0" + min : min;
  hrs = formatting(hrs % 12);  
  text(hrs + ":" + min +" " + mer, 2, 100);
  
  // Draw current date
  var d = day();
  var m = month();
  var y = year();
  var weekday = new Date().toLocaleString('en-us', {weekday: 'long'});
  text(weekday, 2, 120);
  text(m + "/" + d + "/" + y, 2, 140);
  
  // Draw local weather
  fill(0, 0, 200, 103);
  noStroke();
  rect(10, 205, forecast.length*9, 40, 25);
  fill(255);
  textSize(17);
  noStroke();
  text("Lubbock", 2, 190);
  text(nfc(temperature, 0) + "°F", 2, 210);
  text(forecast.charAt(0).toUpperCase() + forecast.substring(1, forecast.length), 2, 233);
  
  // Draw current calendar events
  fill(10, 0, 0, 121);
  noStroke();
  rect(10, 347, 250, 70, 25);
  fill(255);
  textSize(17);
  text("Upcoming Events", 42, 298);
  fill(255);
  textSize(11);
  let rowCount = calendar.getRowCount();
  for(let i = 0, y = 315; i < rowCount; i++, y+=15) {
    text(calendar.get(i, "Date"), 4, y);
    text("@ " + calendar.get(i, "Time"), 35, y);
    text("-  " + calendar.get(i, "Event"), 100, y);
          
  }
  
  // Draw current news headlines
  fill(10, 0, 0, 121);
  noStroke();
  rect(640, 112, 270, 50, 25);
  fill(255);
  textSize(20);
  text("Current News", 445, 84);
  textSize(12);
  textAlign(RIGHT);
  rowCount = news.getRowCount();
  for(let j = 0, y = 100; j < rowCount; j++, y+=25) {
    text(news.get(j, "Headlines"), width-8, y);
  }
  
  // Draw weight from scale (a random number) and compare from yesterday (also random)
  fill(200, 0, 0, 161);
  noStroke();
  rect(640, 202, 145, 27, 25);
  fill(255);
  textSize(15);
  text("Current Weight", width-10, 198);
  textSize(12);
  let sign = nfc(w_change, 0) >= 0 ? "+" : "";
  let yesterday = d - 1;
  text(nfc(weight, 1) + " lbs (" + sign + nfc(w_change, 0) + " lbs, " + m + "/" + yesterday + ")", width-2, 214);
  
  textSize(13);
  textAlign(LEFT);
  text("<- (Toggle Lights)", width/2+30, height-20);
}

function formatting(num){
  if(int(num) < 10) {
    return "" + num;
  }
  return num;
}

function mousePressed() {
  if(overBox) {
    locked = true;
    fill(255, 255, 255);
  } 
  else 
    locked = false;
}

function mouseReleased() {
  if(overBox) {
    locked = false;
    pressed = !pressed;
  }
}
