let nimeElement = document.getElementById('name');
let mailiElement = document.getElementById('email');
let textarea = document.getElementById('sonum');
let saada = document.getElementById('saada');
let Andmed = [nimeElement.value, mailiElement.value, textarea.value];

saada.addEventListener("click", function () {
  if (nimeElement.length == 0 || mailiElement.length == 0 || textarea.value == '') {
    document.getElementById("teade").innerHTML = alert("Palun täida kõik väljad")
  } else {
    document.getElementById("teade").innerHTML = alert("Sõnum saadetud!")
    console.log(nimeElement.value, mailiElement.value, textarea.value);
  
  }
});
