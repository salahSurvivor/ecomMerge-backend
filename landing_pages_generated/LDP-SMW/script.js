document.addEventListener('DOMContentLoaded', function() {
    // Simple gallery functionality
    const images = document.querySelectorAll('.gallery img');
    let currentIndex = 0;
    
    function showImage(index) {
        images.forEach(img => img.classList.remove('active'));
        images[index].classList.add('active');
    }
    
    // Auto-rotate images every 3 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }, 3000);
    
    // Buy button interaction
    const buyButton = document.querySelector('.buy-button');
    let productId = null

    document.getElementById('buyNowBtn').addEventListener('click', function () {
        productId = document.getElementById("p_id").value;
        window.location.href = `./forme.html?idp=${productId}`
    });
    
});
