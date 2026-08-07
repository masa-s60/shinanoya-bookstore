const imageInput = document.querySelector(".p-form__image");
const imageClearButton = document.querySelector(".p-form__image-clear");

imageClearButton.addEventListener("click", () => {
  event.preventDefault();
  imageInput.value = "";
});