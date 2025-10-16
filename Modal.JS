function modalRetriever(){
  const modal = document.querySelector(".Modal");
  const modalImg = document.getElementById("modalImg");
  const modalCloser = document.querySelector(".modalCloser");
  const images = document.querySelectorAll('.GalleryImage');

  images.forEach(img=>{img.addEventListener('click',()=>
    {
      modal.style.display = "flex";
      modalImg.src = img.src;
    });});
    
  modalCloser.addEventListener('click',()=>{
  modal.style.display = "none";});
  
}


