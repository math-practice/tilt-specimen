var text = document.querySelector('.text');
var svg = document.querySelector('svg');
var w = window.innerWidth;
var h = window.innerHeight;
var maxRotation = 45;
var minRotation = -45;
var bg = ["#FF3C3C", "#009D3F", "#00109D"];
var bgCount = 0;

setText();

document.addEventListener("mousemove", updateView, false);

function setText() {
  if (bgCount !== 0){
    text.innerHTML = randomChar(3);
  }
  document.querySelector('body').style.backgroundColor = bg[bgCount % bg.length];
  bgCount ++;
}

function randomChar(num) {
  // var glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&/@§©¼½¾¿æ£';
  var glyphs = 'ABCDEFGHJKLMNOPQRSTUVWXYZ023456789#$%&@©¼½¾æ£';
  var arr = glyphs.split("");
  shuffle(arr);
  var chars = "";
  for (i = 0; i < num; i++) {
    chars += "<span class='char-" + i + "'>" + arr[i] + "</span>";
  }
  return(chars);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function updateView(event) {
  var x = event.pageX;
  var y = event.pageY;
  var hrot = (x / w * maxRotation * 2 - maxRotation);
  var vrot = (y / text.clientHeight * maxRotation * 2 - maxRotation);
  //rotate text
  text.style['font-variation-settings'] = "'HROT' " + hrot + ", 'VROT' " + vrot;
  //write values
  document.querySelector('.hrot_val').innerHTML = hrot.toFixed(2) + "°";
  document.querySelector('.vrot_val').innerHTML = vrot.toFixed(2) + "°";
  // console.log (hrot + ", " + vrot);
  // drawLine(x, y);
  drawLines(x, y);
  // changeColor(x, y);
}

function drawLine(x, y){
  var dot = document.querySelector('.circle_1');
  dot.setAttribute('cx',x);
  dot.setAttribute('cy',y);
  
  var line = document.querySelector('.line_1');
  line.setAttribute('x1','50vw');
  line.setAttribute('y1',text.clientHeight/2);
  line.setAttribute('x2',x);
  line.setAttribute('y2',y);
}

function drawLines(x, y){
  var dot = document.querySelector('.circle_1');
  dot.setAttribute('cx',x);
  dot.setAttribute('cy',y);
  
  var lines = document.querySelectorAll('.line_1'); 
  for (i = 0; i < lines.length; ++i) {
    lines[i].setAttribute('x1','50vw');
    lines[i].setAttribute('y1',text.clientHeight/2);
    lines[i].setAttribute('x2',x);
    lines[i].setAttribute('y2',y);
  }
}