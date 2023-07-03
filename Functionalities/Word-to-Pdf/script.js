var addfile = document.querySelector("#addfile");
var pdf = document.querySelector(".pdf");
var tTpButton = document.querySelector(".dwpdf");
var reset = document.querySelector(".reset");
var addfilelab = document.querySelector("#addfilelab");
reset.disabled = true;
var opt = {
  margin: 1,
  pagebreak: { mode: "avoid-all" },
  filename: "StudentPortal.pdf",
  image: { type: "jpeg", quality: 0.98 },
  html2canvas: { scale: 1 },
  jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
};
addfile.addEventListener("change", (e) => {
  // addfile.files[0].name.substring(addfile.files[0].name.length - 4)
  if (
    addfile.files[0].name.substring(addfile.files[0].name.length - 4) === "docx"
  ) {
    console.log(
      addfile.files[0].name.substring(addfile.files[0].name.length - 4)
    );
    console.time();
    var reader = new FileReader();
    reader.onloadend = function (event) {
      var arrayBuffer = reader.result;
      mammoth
        .convertToHtml({ arrayBuffer: arrayBuffer })
        .then(function (resultObject) {
          pdf.innerHTML = resultObject.value;
          pdf.style.color = "#222";
          console.log(resultObject.value);
        });
      console.timeEnd();
    };
    reader.readAsArrayBuffer(addfile.files[0]);
    pdf.style.display = "none";
    tTpButton.disabled = false;
    tTpButton.style.opacity = "1";
    reset.disabled = false;
    reset.style.opacity = "1";
    if (addfile.value != null) {
      addfilelab.innerHTML =
        '<i class="fa fa-check" aria-hidden="true" ></i> Uploaded .doc file';
      addfilelab.style.pointerEvents = "none";
    }
  }
});
function dwnldpdf() {
  pdf.style.display = "block";
  console.log("Saving Pdf");
  html2pdf().set(opt).from(pdf).save();
  setTimeout(() => {
    pdf.style.display = "none";
  }, 1);
  tTpButton.classList.remove("dwpdf_hover");  
  reset.classList.remove("reset_hover");
  addfile.value = null;
  tTpButton.disabled = true;
  tTpButton.style.opacity = "0.5";
  reset.disabled = true;
  reset.style.opacity = "0.5";
  addfilelab.innerHTML = '<i class="fa fa-cloud-upload"></i> Upload .doc file';
  addfilelab.style.pointerEvents = "auto";
}

tTpButton.addEventListener("click", dwnldpdf);

tTpButton.addEventListener("mouseover", () => {
  tTpButton.classList.add("dwpdf_hover");
});
tTpButton.addEventListener("mouseout", () => {
  tTpButton.classList.remove("dwpdf_hover");
});
reset.addEventListener("mouseover", () => {
  reset.classList.add("reset_hover");
});
reset.addEventListener("mouseout", () => {
  reset.classList.remove("reset_hover");
});

reset.addEventListener("click", () => {
  addfile.value = null;
  tTpButton.classList.remove("dwpdf_hover");
  reset.classList.remove("reset_hover");
  tTpButton.disabled = true;
  tTpButton.style.opacity = "0.5";
  reset.disabled = true;
  reset.style.opacity = "0.5";
  addfilelab.innerHTML = '<i class="fa fa-cloud-upload"></i> Upload .doc file';
  addfilelab.style.pointerEvents = "auto";
});
