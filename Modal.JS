const modal = document.querySelector("div.modal");
const modalImg = document.getElementById("modalImg");
const modalCloser = document.querySelector(".modalCloser");
const images = document.querySelectorAll('.GalleryImage');

images.forEach(img=>{
    img.addEventListener('click',()=>{
        modal.style.display = "flex";
        modalImg.src = img.src;
    });
});

// When the user clicks on <span> (x), close the modal
modalCloser.addEventListener('click',()=>{
  modal.style.display = "none";
});