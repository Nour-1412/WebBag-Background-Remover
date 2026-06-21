import { removeBackground } from "https://cdn.jsdelivr.net/npm/@imgly/background-removal/+esm";

const input = document.getElementById("imageInput");
const btn = document.getElementById("removeBtn");
const preview = document.getElementById("preview");
const downloadBtn = document.getElementById("downloadBtn");

let imageFile = null;

input.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png"];

  if (!allowedTypes.includes(file.type)) {
    alert("يرجى اختيار صورة بصيغة JPG أو PNG.");

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
});

btn.addEventListener("click", async () => {
  if (!imageFile) {
    alert("يرجى اختيار صورة بصيغة JPG أو PNG أولًا.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "جاري إزالة الخلفية...";

  try {
    const blob = await removeBackground(imageFile);

    const url = URL.createObjectURL(blob);

    preview.innerHTML = `
      <img src="${url}" alt="الصورة بعد إزالة الخلفية">
    `;

    downloadBtn.href = url;
    downloadBtn.style.display = "block";
  } catch (error) {
    console.error(error);

    alert(
      "تعذر معالجة الصورة. يرجى استخدام صورة بصيغة JPG أو PNG وبحجم مناسب."
    );
  }

  btn.disabled = false;
  btn.textContent = "إزالة الخلفية";
});
