logoutBtn.addEventListener("click",function(){
    var req = new XMLHttpRequest();
    req.open("post","/logout");
    req.addEventListener("load",function(){
       window.location.replace("/");
    })
    req.send();
});

function deleteFromLibBtnFunc(){
    var deleteFromLibBtnElements = document.querySelectorAll(".deleteFromLib");

    for(let i=0;i<deleteFromLibBtnElements.length;i++){
        
        deleteFromLibBtnElements[i].addEventListener("click",function(){
            var mainClass = (deleteFromLibBtnElements[i].parentNode).parentNode;
            console.log(mainClass.id);
            var req = new XMLHttpRequest();
            req.open("POST","/deleteMov");
            req.setRequestHeader("Content-type","application/json");
            req.send(JSON.stringify({movObjId:mainClass.id}));
            req.addEventListener("load",function(){
                var respo = req.responseText;
                if(respo=="Removed From Library"){
                    window.location.reload();
                }else if(respo=="Internal Server Error"){
                    alert("Couldn't remove due to an error!");
                }else if(respo=="signin"){
                    window.location.replace("/signin");
                }
            });
        });
    }
}
deleteFromLibBtnFunc();