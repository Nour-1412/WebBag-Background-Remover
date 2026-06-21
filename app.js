import { removeBackground } from "https://cdn.jsdelivr.net/npm/@imgly/background-removal/+esm";

const input = document.getElementById("imageInput");
const btn = document.getElementById("removeBtn");
const preview = document.getElementById("preview");
const downloadBtn = document.getElementById("downloadBtn");

let imageFile;

input.addEventListener("change", (e) => {
  imageFile = e.target.files[0];
});

btn.addEventListener("click", async () => {
  if (!imageFile) {
    alert("اختر صورة أولاً");
    return;
  }

  btn.disabled = true;
  btn.textContent = "جاري إزالة الخلفية...";

  try {
    const blob = await removeBackground(imageFile);

    const url = URL.createObjectURL(blob);

    preview.innerHTML = `<img src="${url}" alt="الصورة بعد إزالة الخلفية">`;

    downloadBtn.href = url;
    downloadBtn.style.display = "block";
  } catch (error) {
    console.error(error);
    alert("حدث خطأ أثناء إزالة الخلفية");
  }

  btn.disabled = false;
  btn.textContent = "إزالة الخلفية";
});
