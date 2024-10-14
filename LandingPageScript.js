document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('mouseenter', () => {
        document.querySelectorAll('.box').forEach(b => {
            b.style.flex = '1';
            b.style.backgroundSize = 'cover';
        });
        box.style.flex = '3';
        box.style.backgroundSize = '150%';
        box.style.opacity = "1";
    });

    box.addEventListener('mouseleave', () => {
        document.querySelectorAll('.box').forEach(b => {
            b.style.flex = '1';
            b.style.backgroundSize = 'cover';
            b.style.opacity = "0.3";
        });
    });
});