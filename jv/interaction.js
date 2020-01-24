var project = document.getElementById("Project");
var process = document.getElementById("Process");
var projectBtn = document.getElementById("ProjectBtn");
var processBtn = document.getElementById("ProcessBtn");

document.getElementById("ProjectBtn").addEventListener("click", function(){
  document.getElementById("ProcessBtn").classList.remove("selected");
  document.getElementById("ProjectBtn").classList.add("selected");
  process.classList.remove("in");
  process.classList.add("out");
  project.classList.remove("out");
  project.classList.add("in");
});

document.getElementById("ProcessBtn").addEventListener("click", function(){
  document.getElementById("ProjectBtn").classList.remove("selected");
  document.getElementById("ProcessBtn").classList.add("selected");
  project.classList.remove("in");
  project.classList.add("out");
  process.classList.remove("out");
  process.classList.add("in");
  document.getElementById("Process").classList.add("in");
  document.getElementById("ProjectBtn").classList.remove("outout");
});
