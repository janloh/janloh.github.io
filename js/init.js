function moveOn(items) {
  const notActivated = items.filter(item => !item.classList.contains('active'));
  if(notActivated.length !== 0) {
    notActivated[0].classList.add('active');
    setTimeout(() => moveOn(notActivated), 2000);
  }
}

function checkforCompletion() {
  console.log("go check");
  const dropzones = document.getElementById('dropzone').children;
  let counter = 0;
  for (i = 0; i < dropzones.length; i++) {
    if(dropzones[i].children.length) counter++;
    console.log(counter);
  }
  if(counter === 3) {
    location.reload();
  }
}

function initiateEmergency() {
  const secretOne = document.getElementById('secret-1');
  const secretTwo = document.getElementById('secret-2');
  const eatenItems = document.getElementsByClassName('eaten');
  secretOne.classList.add('layer-1');
  secretTwo.classList.add('layer-2');
  eatenItems[0].classList.add('active');
  setTimeout(() => moveOn(Array.from(eatenItems)), 2000);
}

function initiateAwesomness() {
  window.location.href += '/deep/deep.html';
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
  checkforCompletion();
}

document.addEventListener("DOMContentLoaded", (event) => {
  const counterWisely = document.getElementById('counter-wisely');
  const counterPoorly = document.getElementById('counter-poorly');
  counterWisely.innerHTML = getRandomInt(100);
  counterPoorly.innerHTML = getRandomInt(100);
});
