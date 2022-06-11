
var logoutBtn = document.getElementById("logoutBtn");
var initialCreateDiv = document.getElementById("initialCreateDiv");
var addLibBtn = document.getElementById("addLibBtn");
var libDetailsDiv = document.getElementById("libDetailsDiv");
var cancelBtn = document.getElementById("cancelBtn");
var libInfoSubmitBtn = document.getElementById("libInfoSubmitBtn");

var libTitleInp = document.getElementById("libTitleInp");
var libDescInp = document.getElementById("libDescInp");
var messageDiv = document.getElementById("message");
var message = messageDiv.innerHTML;
message = message.trim();
if(message!=""){
    alert(message);
}


function deleteLibs(){
    var deleteBtnElements = document.querySelectorAll("#libDeleteBtn");

    for(let i=0;i<deleteBtnElements.length;i++){
        
        deleteBtnElements[i].addEventListener("click",function(){
            var mainClass = (deleteBtnElements[i].parentNode).parentNode;
            console.log(mainClass.id);
            var req = new XMLHttpRequest();
            req.open("POST","/deleteLib");
            req.setRequestHeader("Content-type","application/json");
            req.send(JSON.stringify({libId:mainClass.id}));

            req.addEventListener("load",function(){
                window.location.reload();
            });
        })
    }
}
deleteLibs();

function openLibs(){
    var openBtnElements = document.querySelectorAll("#libEditBtn");

    for(let i=0;i<openBtnElements.length;i++){
        
        openBtnElements[i].addEventListener("click",function(){
            var mainClass = (openBtnElements[i].parentNode).parentNode;
            console.log(mainClass.id);
            var req = new XMLHttpRequest();
            
            var libNameEle = mainClass.children;
            libNameEle = libNameEle[0].children;
            libNameEle = libNameEle[0];
            var requesturl = "/openLib/"+mainClass.id+"/"+libNameEle.innerHTML;
            req.open("GET",requesturl);
            req.setRequestHeader("Content-type","application/json");
            req.send(JSON.stringify({libName:libNameEle.innerHTML}));

            req.addEventListener("load",function(){
                if(req.responseText=="Internal Server Error"){
                    alert("Internal Server Error");
                    window.location.reload();
                }else{
                    window.open(requesturl,"_self");
                }
            });
        })
    }
}
openLibs();


libInfoSubmitBtn.addEventListener("click",function(){
    var req2 = new XMLHttpRequest();
    req2.open("post","/createLib");

    

    var libTitle = libTitleInp.value;
    var libDesc = libDescInp.value;
    libTitle = libTitle.trim();
    libDesc = libDesc.trim();

    req2.setRequestHeader("Content-type","application/json");
    req2.send(JSON.stringify({title:libTitle, desc:libDesc}));

    req2.addEventListener("load",function(){
        window.location.reload();
    })
    

    
})

addLibBtn.addEventListener("click",function(){
    initialCreateDiv.style.display = "none";
    libDetailsDiv.style.display = "flex";
});

cancelBtn.addEventListener("click",function(){
    initialCreateDiv.style.display = "flex";
    libDetailsDiv.style.display = "none";
});

logoutBtn.addEventListener("click",function(){
    var req = new XMLHttpRequest();
    req.open("post","/logout");
    req.addEventListener("load",function(){
       window.location.replace("/");
    })
    req.send();
});