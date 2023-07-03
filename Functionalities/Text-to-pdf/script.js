// PDF generated area
var areaCv = document.getElementById("txtarea");
var tTpButton = document.querySelector(".convert");
const textarea = document.querySelector("#txtarea");
const filename = document.querySelector("#filename");
var reset = document.querySelector(".reset");

function generateResume() {
  var doc = new jsPDF();
  var file = document.getElementById("filename").value;
  var splitText = doc.splitTextToSize(areaCv.value, 180);
  doc.text(15, 20, splitText);
  doc.save(file);
  tTpButton.disabled = true;
  tTpButton.style.opacity = "0.5";
  reset.disabled = true;
  reset.style.opacity = "0.5";
  textarea.value = "";
  textarea.style.height = "150px";
  filename.value = "";
  document.getElementById("fname").innerHTML = "";
  tTpButton.classList.remove("convert_hover");
  reset.classList.remove("reset_hover");
}
reset.disabled=true;
// Hover animation
tTpButton.addEventListener("mouseover", () => {
  tTpButton.classList.add("convert_hover");
});
tTpButton.addEventListener("mouseout", () => {
  tTpButton.classList.remove("convert_hover");
});
reset.addEventListener("mouseover", () => {
  reset.classList.add("reset_hover");
});
reset.addEventListener("mouseout", () => {
  reset.classList.remove("reset_hover");
});

// When the button is clicked, it executes the three functions
tTpButton.addEventListener("click", () => {
  generateResume();
});

// Auto Resize textarea
const sizeReset = (e) => {
  textarea.style.height = "100px";
  let scHeight = e.target.scrollHeight;
  textarea.style.height = `${scHeight}px`;
};

textarea.addEventListener("keyup", sizeReset);



reset.addEventListener("click", () => {
  tTpButton.disabled = true;
  tTpButton.style.opacity = "0.5";  
  reset.classList.remove("reset_hover");
  reset.disabled=true;
  reset.style.opacity="0.5";
  textarea.value = "";
  textarea.style.height = "150px";
  filename.value = "";
  document.getElementById("fname").innerHTML = "";
});

// function for validating the filename
function validate() {
  var regex = /^[a-zA-Z0-9 ]+$/;
  var name = filename.value;
  if (regex.test(name)) {
    return true;
  } else {
    return false;
  }
}

//function for checking the filename and to enable download button.
function checkfilename() {
  if (filename.value) {
    return false;
  } else {
    return true;
  }
}

//function to check the textarea and to enable the download button.
function checktext() {
  if (textarea.value) {
    return false;
  } else {
    return true;
  }
}




filename.addEventListener("keyup", () => {
  if (validate() && filename.value) {
    document.getElementById("fname").style.color = "#06FF00";
    document.getElementById("fname").innerHTML = "Valid filename";
    tTpButton.disabled = checktext();    
    tTpButton.disabled = false;
    tTpButton.style.opacity = "1";
    reset.disabled = false;
    reset.style.opacity = "1";
    tTpButton.style.pointerEvents = "auto";
  } else if (filename.value == "") {
    tTpButton.style.pointerEvents = "none";
    tTpButton.disabled = true;
    tTpButton.style.opacity = "0.5";    
  reset.classList.remove("reset_hover");
    reset.disabled = true;
    reset.style.opacity = "0.5";
    document.getElementById("fname").style.color = "#8a39e1";
    document.getElementById("fname").innerHTML = "Fill the filename";
  } else {
    document.getElementById("fname").style.color = "red";
    tTpButton.disabled = true;
    tTpButton.style.opacity = "0.5";
    reset.disabled = false;
    reset.style.opacity = "1";
    document.getElementById("fname").innerHTML =
      "Invalid filename. filename should contain only letters and numbers";
    tTpButton.style.pointerEvents = "none";
  }
});

textarea.addEventListener("keyup", () => {
  if (textarea.value) {
    tTpButton.disabled = checkfilename();   
    tTpButton.disabled = false;
    tTpButton.style.opacity = "1";
    reset.disabled = false;
    reset.style.opacity = "1";
    tTpButton.style.pointerEvents = "auto";
  } else {
    tTpButton.disabled=true;
    reset.disabled = true;
    reset.style.opacity = "0.5";
    tTpButton.style.opacity = "0.5";
    tTpButton.style.pointerEvents = "none";
  }
});