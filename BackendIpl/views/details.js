
var st=0;
if(window.location.href.indexOf("&s=")!==-1){
    var teamName=window.location.search.split("teamName=")[1].split("&id")[0];
    var id=window.location.search.split("id=")[1].split("&s")[0]; 
    var s=window.location.search.split("s=")[1]; 
    st=1;
}else{
var teamName=window.location.search.split("teamName=")[1].split("&id")[0];
var id=window.location.search.split("id=")[1]; 
}



var playerWrapper=$("<div>").attr("id","player-wraper");
var playerWrapperHeadding=$("<div>").text("Player Details").attr("id","player-wraper-heading");
playerWrapper.append(playerWrapperHeadding);

var commentsWrapper=$("<div>").addClass("comments-wrapper").text("Comments");
var loginmsgdiv=$("<div>").text("Please Login to Post Comments").attr("id","loginmsg-div") 

commentsWrapper.append(loginmsgdiv);
var count=0


var playerlistWrapper=$("<div>").attr("id","playerlist-wrapper");
var playerlistHeadding=$("<div>").text("Players List").attr("id","player-list-heading");
playerlistWrapper.append(playerlistHeadding);


var namediv=$("<h3>").addClass("name");
var teamFrom=$("<h5>").addClass("teamfrom");
var role=$("<h5>").addClass("role");
var displayStatus=$("<p>").addClass("status");
var price=$("<p>").addClass("cost");



function createDetailsCard(cricketPlayers){
    
    var playerDiv=$("<div>").addClass("playerDiv");
    namediv.text("Name: "+cricketPlayers.playerName);
    teamFrom.text("Team Name: "+cricketPlayers.from.split("(")[0]);
    role.text("Role: "+cricketPlayers.description);
    let playerStatus=cricketPlayers.isPlaying===true? "Playing":"On-Bench";
    displayStatus.text("Player Status: "+playerStatus);
    price.text("Price:RS "+cricketPlayers.price);
    playerDiv.append(namediv,teamFrom,role,displayStatus,price,);
    commentsWrapper.attr("id",cricketPlayers._id);
    playerWrapper.append(playerDiv,commentsWrapper);
    $("#display-players").append(playerWrapper)
}

function createDetailsDiv(playersList){
    let list=$("<div>").addClass("players-list").text(playersList.playerName).attr("id",playersList._id);
    if(id===playersList._id){
        list.addClass("active-div players-list")
    }
    playerlistWrapper.append(list);
    $("#display-players").append(playerlistWrapper);
    list.click(function(){
        var card=document.getElementsByClassName("players-list active-div");
        card[0].className="players-list";
        list.removeClass( "players-list" ).addClass("players-list active-div")
        console.log($(this).attr("id"));
        var p_id=$(this).attr("id")
        if(st==1){
            location.assign("https://iplcricketteamplayers.herokuapp.com/details?teamName="+teamName+"&id="+p_id+"&s="+1);
        }else{
            location.assign("https://iplcricketteamplayers.herokuapp.com/details?teamName="+teamName+"&id="+p_id);
        }
        
    })
}
if(st==0){
    
$.get("https://iplcricketteamplayers.herokuapp.com/getPlayersByTeamName/"+teamName,function(data){
   
   
    if(data.data.length>0){
        $("#load").css("display","none");
    }
    $("#team-name").text(data.data[0].from);
    $("#players-count").text("Total Players:- "+data.data.length);
    for(var i=0;i<data.data.length;i++){
        if(id===data.data[i]._id){
            createDetailsCard(data.data[i]);
        }
        createDetailsDiv(data.data[i]);
    }
   
   
    
    $("#home").attr("href","https://hema199807.github.io/webappfrontend/#/");
    var loginDiv=$("<button>").text("Login").attr("id","login-btn");
    var signupDiv=$("<button>").text("SignUp").attr("id","signup-btn");
    $("#registration-div").append(signupDiv);
    $("#login-div").append(loginDiv);
    loginDiv.click(function(){
        console.log("clicked");
        location.assign("https://hema199807.github.io/webappfrontend/#/login?teamName="+teamName+"&id="+id);
    })
    signupDiv.click(function(){
        location.assign("https://hema199807.github.io/webappfrontend/#/signup?teamName="+teamName+"&id="+id);
    })
})
}else{
    var connectionOptions={
        "force new connection":true,
        "reconnectionAttempts":"Infinity",
        "timeout":10000,
        "transports":["websocket"]
    }
       var socket=io.connect("https://iplcricketteamplayers.herokuapp.com",connectionOptions);
       
       $.get("https://iplcricketteamplayers.herokuapp.com/auth",function(data){
            var USERNAME=data.userName;
            var TOKEN=data.usertoken;
       
       if(USERNAME){
            if(USERNAME.toLowerCase()=="admin"){
                location.assign("https://hema199807.github.io/webappfrontend/#/admin?p="+1);
            }
        }
       axios.get("https://iplcricketteamplayers.herokuapp.com/getPlayersByTeamNameAuth/"+teamName,{
           headers: {
            authorization: `bearer ${TOKEN.trim()}`,
           },
        }).then((response)=>{
       

   
    if(response.data.data.length>0){
        $("#load").css("display","none");
    }
    $("#team-name").text(response.data.data[0].from);
    $("#players-count").text("Total Players:- "+response.data.data.length);
    for(var i=0;i<response.data.data.length;i++){
        if(id===response.data.data[i]._id){
            createDetailsCard(response.data.data[i]);
        }
        createDetailsDiv(response.data.data[i]);
    }



    $("#home").attr("href","https://hema199807.github.io/webappfrontend/#/");
   
    $(".user-logo").append($("<span>").text(USERNAME.trim()).attr("id","user-span"));
    $("#add-players").css("display","block");
    $("#add-players").click(function(){
        location.assign("https://hema199807.github.io/webappfrontend/#/add?teamName="+teamName+"&id="+id);
    })
    let closeBtn=$("<button>").addClass("btn btn-sm btn-danger").css("float","right").text("❌");
    let goToHome=$("<p>").text("Sign Out").css("margin-bottom",16+"px");
    let userName=$("<p>").text(USERNAME.trim()).css( "margin-top",48+"px","margin-bottom",10+"px");

    $("#sign-out").append(closeBtn,userName,goToHome);
    $(".user-logo").click(function(){
        $("#sign-out").css("display","inline-block");
        closeBtn.click(function(){
            $("#sign-out").css("display","none");
        })
        goToHome.click(function(){ 
            location.assign("https://hema199807.github.io/webappfrontend/#/?c=1");
        })  
    })
    $("#loginmsg-div").css("display","none");
    var commentsDiv=$("<div>")
    var inputBox=document.createElement("input");
    inputBox.placeholder="Comment Here as "+USERNAME.trim();
    inputBox.className="comments-div";
    inputBox.spellcheck=false;
    commentsDiv.append(inputBox);
    commentsWrapper.append(commentsDiv)
    var cancleComment=$("<button>").attr("id","c-btn-c").text("Cancel");
    var sendComment=$("<button>").attr("id","s-btn-c").text("send");
    commentsWrapper.append(cancleComment,sendComment,$("<hr>").attr("id","comment-hr"))
    
    
    
    async function postComments(){
        let currentDate=await new Date();
        let month=currentDate.getMonth() + 1;
        month=month < 10 ? "0"+month :month;
        let year=currentDate.getFullYear();
        let getDate=currentDate.getDate();
        getDate=getDate < 10 ? "0"+getDate :getDate;
        let addDate= year+"-"+month+"-"+getDate;
        var hours = currentDate.getHours();
        hours = hours < 10 ? "0" + hours : hours;
        var minutes = currentDate.getMinutes() < 10 ? "0" +currentDate.getMinutes() : currentDate.getMinutes();
        var seconds = currentDate.getSeconds() < 10 ? "0" + currentDate.getSeconds() : currentDate.getSeconds();
        let currentTime=hours+":"+minutes+":"+seconds;
        const obj={
            "CommenterName":USERNAME.trim(),
            "PlayerId":id.trim(),
            "Message":inputBox.value.trim(),
            "TimeStamp":addDate+" "+currentTime
        }
        inputBox.value=""
        socket.emit("new-Comment",obj);
            
    }
    function deleteComment(player_id){
        
        socket.emit("delete-comment",player_id);
    }
   
    inputBox.addEventListener("keyup",function(e){
        if(e.code==="Enter"){
            if(inputBox.value===""){
                return alert("comment should not be empty, please type something then send");
            }else{
                postComments();
            }
        }
    })
    cancleComment.click(function(){
        inputBox.value="";
        $("#c-btn-c").css("display","none");
        $("#s-btn-c").css("display","none");
    })
    commentsDiv.click(function(){ 
        $("#c-btn-c").css("display","inline-block");
        $("#s-btn-c").css("display","inline-block");
    })

    sendComment.click(function(){
        if(inputBox.value===""){
            return alert("comment should not be empty, please type something then send")
        }
        else{
            postComments();
        }
      
        
    })

   function createCommentcards(cardDetails){
        var displaycommentsDiv=$("<div>").addClass("display-comments-div");
        var timeUserwrapper=$("<div>").attr("id","time-user-wrapper");
        var messagewrapper=$("<div>").text(cardDetails.Message).attr("id","comment-msg");
        var userwrapper=$("<div>").text(cardDetails.CommenterName);
        var timeStamp=$("<div>").text(cardDetails.TimeStamp).css("font-size","18px");
        if(USERNAME.trim()===cardDetails.CommenterName){
            console.log(cardDetails._id);
            var Deleteicon=$("<i>").addClass("fas fa-trash delete-icon").attr("id",cardDetails._id);
            timeUserwrapper.append(userwrapper,timeStamp);
            displaycommentsDiv.append(timeUserwrapper,messagewrapper,Deleteicon);
            commentsWrapper.append(displaycommentsDiv);
            Deleteicon.click(function(){
                deleteComment(Deleteicon.attr("id"))
            })
            
        }else{
            timeUserwrapper.append(userwrapper,timeStamp);
            displaycommentsDiv.append(timeUserwrapper,messagewrapper);
            commentsWrapper.append(displaycommentsDiv); 
        }
                
    }
  
    axios.get("https://iplcricketteamplayers.herokuapp.com/getComments",{
           headers: {
            authorization: `bearer ${TOKEN.trim()}`,
           },
        }).then((response)=>{
        if(response.data.data.length){
            var getCommentsById=response.data.data.filter((item)=>{
                if(item.PlayerId===id){
                    return item
                }
            })
            for(var i=0;i<getCommentsById.length;i++){
               
                createCommentcards(getCommentsById[i])
                
            } 
           
        }
    })
   
    
    socket.on("new-comment",function(getComment){
        
        var hide=document.getElementsByClassName("display-comments-div");
        for(var i=0;i<hide.length;i++){
            hide[i].style.display="none";
        }
        if(getComment.length){
            var getCommentsByPlayerId=getComment.filter((item)=>{
                if(item.PlayerId===id){
                    return item
                }
            })
            for(var i=0;i<getCommentsByPlayerId.length;i++){
               createCommentcards(getCommentsByPlayerId[i]) 
            }
            
        }
    })
   socket.on("afterDeleteComment",function(updateComments){
    var hide=document.getElementsByClassName("display-comments-div");
    for(var i=0;i<hide.length;i++){
        hide[i].style.display="none";
    }
    
    if(updateComments){
        var updateCommentsById=updateComments.filter((item)=>{
            if(item.PlayerId===id){
                return item
            }
        })
        for(var i=0;i<updateCommentsById.length;i++){
            createCommentcards(updateCommentsById[i])
                
        }    
    }
    
   })

    })
    })
}
