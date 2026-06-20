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
    alert("اختر صورة أولًا");
    return;
  }

  btn.textContent = "جاري إزالة الخلفية...";

  const blob = await removeBackground(imageFile);

  const url = URL.createObjectURL(blob);

  preview.innerHTML = `<img src="${url}">`;

  downloadBtn.href = url;
  downloadBtn.style.display = "block";

  btn.textContent = "إزالة الخلفية";
});
