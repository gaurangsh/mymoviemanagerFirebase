const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const XMLHttpRequest = require("xhr2");


app.use(express.json());
app.use(express.urlencoded());

const session = require("express-session");
app.use(express.static(__dirname + '/styles'))
//Setting ejs as default templating engine
// by def, if name of folder is views, then you dont need to specify the folder name
app.set("view engine",'ejs');
app.set("views");

app.use(session({
	secret: 'my secret',
  saveUninitialized: true,
  resave: false
}))

app.use(express.static("scripts"));
const db = require("./database/index.js");
db.init();

const userModelInstance = require("./database/models/user.js");
const userModel = userModelInstance.model;

const movieModelInstance = require("./database/models/movies.js");
const movieModel = movieModelInstance.model;

const libraryModelInstance = require("./database/models/library.js");
const libraryModel = libraryModelInstance.model;



app.get("/",function(req,res){
    
    if(req.session.isLoggedIn){
      res.redirect("/home");
    }else{
      res.redirect("/signin");
    }
});

app.get("/signup",function(req,res){
  res.render("signup.ejs",{message:""});
});

app.post("/signup",function(req,res){
  let userBody = req.body;
  let username = userBody.username;
  let password = userBody.password;
  let name = userBody.name;

  username = username.trim();
  password = password.trim();
  name = name.trim();

  if(!username){
    res.render("signup.ejs",{message:"Username is missing!"})
    return;
  }
  if(!password){
    res.render("signup.ejs",{message:"Password is missing!"})
    return;
  }
  if(!name){
    res.render("signup.ejs",{message:"Name is missing!"})
    return;
  }

  if(username && password && name){
    userModel.findOne({username:username}).then(function(user){
      if(!user){
        userModel.create({username:username,password:password,name:name}).then(function(){
          res.render("signin.ejs",{message:"User created! Please Sign In to continue"});
        }).catch(function(){
          res.render("signup.ejs",{message:"Internal Server Error!"});
        })
      }else{
        res.render("signup.ejs",{message:"Account Already Exists!"});
      }
    }).catch(function(){
      res.render("signup.ejs",{message:"Internal Server Error!"});
    });
  }
});

app.get("/signin",function(req,res){
  if(req.session.isLoggedIn){
    res.redirect("/home");
  }else{
    res.render("signin.ejs",{message:""});
  }
});

app.post("/signin",function(req,res){
  let userBody = req.body;
  let username = userBody.username;
  let password = userBody.password;
  username = username.trim();
  password = password.trim();
  if(!username){
    res.render("signin.ejs",{message:"Username is missing!"})
    return;
  }
  if(!password){
    res.render("signin.ejs",{message:"Password is missing!"})
    return;
  }

  if(username&&password){
    userModel.findOne({username:username, password:password}).then(function(user){
      if(user){
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.homeMeassage = "";
        res.redirect("/home");
      }else{
        res.render("signin.ejs",{message:"Please enter valid credentials!"});
        return;
      }
    }).catch(function(){
      res.render("signin.ejs",{message:"Internal Server Error!"});
      return;
    })
  }
});

app.get("/home",function(req,res){
  if(req.session.isLoggedIn){
    libraryModel.find({user:req.session.user.username}).then(function(libs){
      if(libs.length>0){
        libs.sort(function(a, b) {
          var keyA = a.createdOn,
            keyB = b.createdOn;
          // Compare the 2 dates
          if (keyA > keyB) return -1;
          if (keyA < keyB) return 1;
          return 0;
        });
      }
      var hm = req.session.homeMeassage;
      req.session.homeMeassage= "";
      res.render("home.ejs",{user:req.session.user,message:hm,libs:libs});
       
    }).catch(function(){
      res.render("home.ejs",{user:req.session.user,message:"Internal Server Error!",libs:[]});
    });
    
  }else{
    res.redirect("/signin");
  }
});

app.post("/logout",function(req,res){
  req.session.destroy();
  res.redirect("/signin");
});

app.post("/createLib",function(req,res){
  if(req.session.isLoggedIn){
    let libBody = req.body;
    let title = libBody.title;
    title = title.trim();
    let desc = libBody.desc;
    desc = desc.trim();
    let libUser = req.session.user.username;
    let today = new Date();
    let dateOfCreation = today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear();
    let createdOn = Date.now();
    let libId = title+createdOn+(Math.random()*100);
    if(!title || !desc|| title.length>20 || desc.length>150){
      res.render("home.ejs",{user:req.session.user,message:"Please keep length within the given constraints!"});
      return;
    }
    if(title && desc && title.length>0 && desc.length>0){
      libraryModel.findOne({libraryId:libId}).then(function(lib){
        if(lib){
          req.session.homeMeassage = "Please try Again!";
          res.redirect("/home");
          return;
        }else{
          libraryModel.create({Title:title,
            Description:desc,
            user:libUser,
            libraryId:libId,
            createdOn:createdOn,
            dateOfCreation:dateOfCreation
          }).then(function(){
            req.session.homeMeassage = "Library Created";
            res.redirect("/home");
            return;
          }).catch(function(){
            req.session.homeMeassage = "Internal Server Error!";
            res.redirect("/home");
            return;
          });
          
        }
      }).catch(function(){
        req.session.homeMeassage = "Internal Server Error!";
        res.redirect("/home");
      })
    }
  }else{
    res.redirect("/home");
  }
});

app.post("/search",function(req,res){
  if(!req.session.isLoggedIn){
    res.redirect("/signin");
    return;
  }
  var searchBody = req.body;
  var searchVal = searchBody.movieName;
  var redirectUrl = "/search/"+searchVal;
  res.redirect(redirectUrl);
});

app.get("/search/:searchVal",function(req,res){
  if(!req.session.isLoggedIn){
    res.redirect("/signin");
    return;
  }
  var searchVal = req.params.searchVal;
  searchVal=searchVal.trim();
  var requesturl = "http://www.omdbapi.com/?s="+searchVal+"&apikey=d554bd3c";
  var ourReq = new XMLHttpRequest();
  ourReq.open("GET",requesturl);
  ourReq.send();
  ourReq.addEventListener("load",function(){
    var resBody = ourReq.responseText;

    var resBodyJS = JSON.parse(resBody);
    var Response = resBodyJS.Response;
    let count = 0;
    if(Response=="True"){
      var movArr = resBodyJS.Search;
      var newArrmd = [];
      
      function cb(newBody,j){
        newArrmd.push({newBody}) ;
        //JSON.stringify(newArrmd)
        if(count==movArr.length-1){
          res.render("movieslist.ejs",{showRes:true,movies:newArrmd});
        }
      }
      for(let i=0;i<movArr.length;i++){
        
        let detailReq = new XMLHttpRequest();
        let detailReqUrl = "http://www.omdbapi.com/?i="+movArr[i].imdbID+"&r=json&apikey=d554bd3c";
        detailReq.open("GET",detailReqUrl);
        detailReq.send();
      
        detailReq.addEventListener("load",function(){
            var newBody = {};
            
            var movDet = detailReq.responseText;
            /*newArrmd.push(movDet);
            newArrmd = JSON.stringify(newArrmd);
            var movDetJS = JSON.parse(newArrmd);
            console.log(movDetJS);*/
            var tmovDet= movDet+"";
            var movDetJS = JSON.parse(tmovDet);
            newBody.Title = movDetJS.Title;
            newBody.Year = movDetJS.Year;
            newBody.Plot = movDetJS.Plot;
            newBody.image = movDetJS.Poster;
            newBody.imdbRating = movDetJS.imdbRating;
            newBody.imdbID = movDetJS.imdbID;
            newBody.Language = movDetJS.Language;
            //newBody = movDet;
            cb(newBody,i);
            count = count+1;
          });
        

      }
    }else{
        res.render("movieslist.ejs",{showRes:false,movies:[]});
    }
    
    /*res.render("movieslist.ejs");*/
  });
  
});

app.post("/deleteLib",function(req,res){
  if(req.session.isLoggedIn && req.session.user){
    var libBody = req.body;
    var libraryId = libBody.libId;
    var username = req.session.user.username;
    libraryModel.findOneAndDelete({libraryId:libraryId, user:username}).then(function(){
      movieModel.deleteMany({user:req.session.user.username, libraryId:libraryId}).then(function(movs){
        console.log(movs);
      }).catch(function(){
        console.log("couldnt delete, Server error");
      })
        
      
      req.session.homeMeassage = "Library Deleted!";
      res.redirect("/home");
    }).catch(function(){
      req.session.homeMeassage = "Error:Could'nt delete library!";
      res.redirect("/home");
    })
  }else{
    res.redirect("/signin");
  }
});

app.post("/addToLib",function(req,res){
  if(!req.session.isLoggedIn || !req.session.user){
    res.send("signin");
    return;
  }
  var searchBody = req.body;
  var libId = searchBody.libId;
  var movId = searchBody.movId;
  movieModel.findOne({imdbID:movId,libraryId:libId,user:req.session.user.username}).then(function(mov){
    if(mov){
      res.send("Already Present")
    }else{
      let detailReq = new XMLHttpRequest();
      let detailReqUrl = "http://www.omdbapi.com/?i="+movId+"&r=json&apikey=d554bd3c";
      detailReq.open("GET",detailReqUrl);
      detailReq.send();
      detailReq.addEventListener("load",function(){
          var newBody = {};
          
          var movDet = detailReq.responseText;
          /*newArrmd.push(movDet);
          newArrmd = JSON.stringify(newArrmd);
          var movDetJS = JSON.parse(newArrmd);
          console.log(movDetJS);*/
          var tmovDet= movDet+"";
          var movDetJS = JSON.parse(tmovDet);
          newBody.Title = movDetJS.Title;
          newBody.Year = movDetJS.Year;
          newBody.Plot = movDetJS.Plot;
          newBody.image = movDetJS.Poster;
          newBody.imdbRating = movDetJS.imdbRating;
          newBody.imdbID = movDetJS.imdbID;
          newBody.Language = movDetJS.Language;
          console.log(libId);
          console.log(movId);
          console.log(movDet);
          console.log(movDetJS);
          //newBody = movDet;
          movieModel.create({
            Title:newBody.Title,
            Year:newBody.Year,
            MovieDesc:newBody.Plot,
            imdbID:newBody.imdbID,
            PosterImg:newBody.image,
            user:req.session.user.username,
            libraryId:libId,
            imdbRating:newBody.imdbRating,
            Language:newBody.Language,
            objId: newBody.imdbID+libId+Date.now(),
            addedOn: Date.now()
          }).then(function(){
            res.send("Movie Added");
          }).catch(function(){
            console.log(2);
            res.send("Internal Server Error");
          })
        });
    }
  }).catch(function(){
    console.log(1);
    res.send("Internal Server Error");
  })
});

app.get("/addToLib/:movieId",function(req,res){
  var movId = req.params.movieId;
  if(req.session.isLoggedIn && req.session.user){
    libraryModel.find({user:req.session.user.username}).then(function(libs){
      if(libs.length>0){
        libs.sort(function(a, b) {
          var keyA = a.createdOn,
            keyB = b.createdOn;
          // Compare the 2 dates
          if (keyA > keyB) return -1;
          if (keyA < keyB) return 1;
          return 0;
        });
      }
      var hm = req.session.homeMeassage;
      req.session.homeMeassage= "";
      res.render("librarySelector.ejs",{movId:movId,libs:libs});
       
    }).catch(function(){
      res.render("librarySelector.ejs",{movId:movId,libs:[]});
    });
  }else{
    res.redirect("/signin");
  }
});

app.get("/openLib/:libId/:libName",function(req,res){
  var libId = req.params.libId;
  var libName = req.params.libName;
  if(req.session.isLoggedIn && req.session.user){
    movieModel.find({libraryId:libId, user:req.session.user.username}).then(function(mov){
      if(mov.length == 0){
        res.render("library.ejs",{movies:mov,libName:libName,showRes:false});
        return;
      }else{
        res.render("library.ejs",{movies:mov,libName:libName,showRes:true});
        return;
      }
    }).catch(function(){
      res.send("Internal Server Error");
    });
  }else{
    res.redirect("/signin");
  }
});

app.post("/deleteMov",function(req,res){
  var movObjId = req.body.movObjId;
  if(req.session.isLoggedIn && req.session.user){
    movieModel.findOneAndDelete({user:req.session.user.username,objId:movObjId}).then(function(){
      res.send("Removed From Library");
    }).catch(function(){
      res.send("Internal Server Error");
    })
  }else{
    res.send("signin");
  }
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
});
