
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
  }, 400);

  try {
    const normalizedImage = await convertToPng(imageFile);

    const blob = await removeBackground(normalizedImage);

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

    alert("تعذر معالجة الصورة حاليًا. جرّبي صورة أخرى أو حدّثي الصفحة.");
  }

  btn.disabled = false;
  btn.textContent = "إزالة الخلفية";
});

async function convertToPng(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("فشل تحويل الصورة"));
        }
      }, "image/png");
    };

    img.onerror = () => reject(new Error("تعذر قراءة الصورة"));

    img.src = URL.createObjectURL(file);
  });
}
