import { removeBackground } from "https://cdn.jsdelivr.net/npm/@imgly/background-removal/+esm";

const input = document.getElementById("imageInput");
const btn = document.getElementById("removeBtn");
const preview = document.getElementById("preview");
const downloadBtn = document.getElementById("downloadBtn");

const originalPreview = document.getElementById("originalPreview");
const originalImage = document.getElementById("originalImage");

const loadingBox = document.getElementById("loadingBox");
const progressBar = document.getElementById("progressBar");

let imageFile = null;

input.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png"];

  if (!allowedTypes.includes(file.type)) {
    alert("يرجى اختيار صورة بصيغة JPG أو PNG فقط.");

    input.value = "";
    imageFile = null;
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("حجم الصورة كبير جدًا. يرجى اختيار صورة أقل من 5 ميجابايت.");

    input.value = "";
    imageFile = null;
    return;
  }

  imageFile = file;

  originalImage.src = URL.createObjectURL(file);
  originalPreview.style.display = "block";

  preview.innerHTML = "";
  downloadBtn.style.display = "none";
});

btn.addEventListener("click", async () => {
  if (!imageFile) {
    alert("يرجى اختيار صورة أولًا.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "جاري إزالة الخلفية...";

  loadingBox.style.display = "block";
  progressBar.style.width = "0%";

  let progress = 0;

  const timer = setInterval(() => {
    if (progress < 90) {
      progress += 10;
      progressBar.style.width = progress + "%";
    }
  }, 500);

  try {
    const blob = await removeBackground(imageFile);

    clearInterval(timer);

    progressBar.style.width = "100%";

    const url = URL.createObjectURL(blob);

    preview.innerHTML = `
      <h3>الصورة بعد إزالة الخلفية</h3>
      <img src="${url}" alt="الصورة بعد إزالة الخلفية">
    `;

    downloadBtn.href = url;
    downloadBtn.style.display = "block";

    setTimeout(() => {
      loadingBox.style.display = "none";
      progressBar.style.width = "0%";
    }, 700);

  } catch (error) {
    clearInterval(timer);

    loadingBox.style.display = "none";
    progressBar.style.width = "0%";

    console.error(error);

    alert("تعذر معالجة الصورة. يرجى استخدام صورة بصيغة JPG أو PNG وبحجم مناسب.");
  }

  btn.disabled = false;
  btn.textContent = "إزالة الخلفية";
});
