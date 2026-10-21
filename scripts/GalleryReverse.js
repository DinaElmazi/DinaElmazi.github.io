function galleryImageAddReverse(folderName, imageAmount){
  const gallery = document.querySelector(".Gallery");

    for (let i = imageAmount; i >= 1; i--) {
      const img = document.createElement("img");
      img.src = `images/${folderName}/${i}.png`;
      img.classList.add("GalleryImage");
      img.loading = "lazy";
      gallery.appendChild(img);
    }
}