
const imageInput = document.getElementById("imageInput");
const originalPreview = document.getElementById("originalPreview");
const resultPreview = document.getElementById("resultPreview");
const removeBtn = document.getElementById("removeBtn");
const downloadBtn = document.getElementById("downloadBtn");

let resultBlob = null;

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (!file) return;

    const imageURL = URL.createObjectURL(file);

originalPreview.src = imageURL;

originalPreview.style.display = "block";

console.log(imageURL);
});

removeBtn.addEventListener("click", async () => {

    const file = imageInput.files[0];

    if (!file) {
        alert("اختر صورة أولاً");
        return;
    }

    removeBtn.innerText = "جاري إزالة الخلفية...";
    removeBtn.disabled = true;

    try {

        resultBlob = await removeBackground(file);

        resultPreview.src = URL.createObjectURL(resultBlob);

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء إزالة الخلفية");

    }

    removeBtn.innerText = "إزالة الخلفية";
    removeBtn.disabled = false;
});

downloadBtn.addEventListener("click", () => {

    if (!resultBlob) {
        alert("قم بإزالة الخلفية أولاً");
        return;
    }

    const link = document.createElement("a");

    link.href = URL.createObjectURL(resultBlob);

    link.download = "webbag-background-removed.png";

    link.click();
});
