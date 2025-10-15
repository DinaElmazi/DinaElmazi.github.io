/* New Stuff*/
function GalleryImageAdd(folderName, imageAmount){
  const gallery = document.querySelector(".GalleryContent");

    for (let i = 1; i <= imageAmount; i++) {
      const img = document.createElement("img");
      img.src = `images/${folderName}/${i}.png`;
      img.classList.add("GalleryImage");
      img.loading = "lazy";
      gallery.appendChild(img);
    }
}