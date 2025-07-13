let productId = null
let paymentMode = ''

document.getElementById('buyNowBtn').addEventListener('click', function () {
    productId = document.getElementById("p_id").value;
    paymentModeInputs = document.getElementsByName("payementMode");
    for(let i=0; i<paymentModeInputs.length; i++){
        if(paymentModeInputs[i].checked){
            paymentMode = paymentModeInputs[i].value
        }
    }  
    window.location.href = `./forme.html?idp=${productId}&payMode=${paymentMode}`
});
  