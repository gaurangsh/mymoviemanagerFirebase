var loginBtn = document.getElementById("loginBtn");
var messageDiv = document.getElementById("message");
var message = messageDiv.innerText;
message = message.trim();
if(message!=""){
    alert(message);
}

loginBtn.addEventListener("click",function(e){
    e.preventDefault();
    window.location.replace("/signin");
})