var regBtn = document.getElementById("regBtn");
var messageDiv = document.getElementById("message");
var message = messageDiv.innerHTML;
message = message.trim();
if(message!=""){
    alert(message);
}

regBtn.addEventListener("click",function(){
    window.location.replace("/signup");
})