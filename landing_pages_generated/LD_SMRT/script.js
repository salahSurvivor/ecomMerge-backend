let productId = null

document.getElementById('buyNowBtn').addEventListener('click', function () {
    productId = document.getElementById("p_id").value;
    window.location.href = `./forme.html?idp=${productId}`
});
  