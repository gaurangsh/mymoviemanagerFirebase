

function addToLib(){
    var addToLibBtnElements = document.querySelectorAll("#addToLibBtn");
    var movIdEle = document.getElementById("movId");
    var movId = movIdEle.innerHTML;

    for(let i=0;i<addToLibBtnElements.length;i++){
        
        addToLibBtnElements[i].addEventListener("click",function(){
            var mainClass = (addToLibBtnElements[i].parentNode).parentNode;
            var libId = mainClass.id;
            var req = new XMLHttpRequest();
            req.open("POST","/addToLib");
            req.setRequestHeader("Content-type","application/json");
            req.send(JSON.stringify({libId:libId, movId:movId}));
            req.addEventListener("load",function(){
                var respo = req.responseText;
                console.log(respo);
                if(respo==="Movie Added"){
                    alert(respo);
                    window.history.back();
                }else if(respo === "Internal Server Error"){
                    alert(respo);
                    window.location.reload();
                }else if(respo === "signin"){
                    window.location.replace("/");
                }else if(respo=="Already Present"){
                    alert(respo);
                    window.location.reload();
                }
            });
        })
    }
}
addToLib();


logoutBtn.addEventListener("click",function(){
    var req = new XMLHttpRequest();
    req.open("post","/logout");
    req.addEventListener("load",function(){
       window.location.replace("/");
    })
    req.send();
});