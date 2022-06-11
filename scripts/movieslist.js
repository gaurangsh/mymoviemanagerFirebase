function addToLibBtnFunc(){
    var addToLibBtnElements = document.querySelectorAll(".addToLib");

    for(let i=0;i<addToLibBtnElements.length;i++){
        
        addToLibBtnElements[i].addEventListener("click",function(){
            var mainClass = (addToLibBtnElements[i].parentNode).parentNode;
            console.log(mainClass.id);
            var geto = "/addToLib/"+mainClass.id;
            window.open(geto,"_self");
        })
    }
}
addToLibBtnFunc();

logoutBtn.addEventListener("click",function(){
    var req = new XMLHttpRequest();
    req.open("post","/logout");
    req.addEventListener("load",function(){
       window.location.replace("/");
    })
    req.send();
});