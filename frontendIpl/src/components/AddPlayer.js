import React, {useEffect, useState} from 'react';
import './Addplayer.css';
import {useLocation} from "react-router-dom"
import axios from 'axios';
import Header from './Header';


const AddPlayer = () => {
    const [playerName,setPlayerName]=useState("");
    const [team,setTeam]=useState("");
    const [role,setRole]=useState("");
    const [status,setStatus]=useState("");
    const [price,setPrice]=useState("");
    const [typeCode,setTypeCode]=useState("");
    const [code,setCode]=useState("");
    const [teamName,setTeamName]=useState("");
    const [count,setCount]=useState(0);
    const [playerId,setPlayerId]=useState("");
    const [pageNumber,setPageNumber]=useState(0);

    const search = useLocation().search;
    useEffect(()=>{
        var myCookie1 =readCookie('userAccess');
        var myCookie2 =readCookie('userName');
        if(!myCookie1||!myCookie2){
            alert("Your session Expired please login")
            window.location.assign("https://hema199807.github.io/webappfrontend/#/")
        }
        setCode(getRandomString(6));
        if(window.location.href.indexOf("?")==-1){
            setCount(1);
             
        }else{
            const teamname=new URLSearchParams(search).get('teamName');
            const id=new URLSearchParams(search).get('id');
            setTeamName(teamname);
            setPlayerId(id);
            if(window.location.href.indexOf("p=")!=-1){
                const pageNo=new URLSearchParams(search).get('p');
                setPageNumber(pageNo);
               
            }
            
        }
      
    },[])
    function readCookie(name){
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    function getRandomString(length) {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for ( var i = 0; i < length; i++ ) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }
    function handleCancel(){
        if(count==0){
            if(pageNumber>0){
               return window.location.assign("https://hema199807.github.io/webappfrontend/#/admin?p="+pageNumber);
            }else{
                return  window.location.assign("https://iplcricketteamplayers.herokuapp.com/details?teamName="+teamName+"&id="+playerId+"&s="+1);
            }
        }
        
    }

    function handleAdd(){
        
        if(status!==false ){
            if(status!==true){
                return alert("status required");
            }
        }
        if(!playerName|| !team || !price || !role || !typeCode){
            return alert("all fields are required")
        }
        if(playerName.length<3 || playerName.length>50){
            return alert("Player Name length should be minimum 3 Charecters and max 50");
        }
        if(count===0){
            let name=teamName.split("%20").join(" ");
           
            if(name.trim().toLowerCase()!==team.trim().toLowerCase()){
                return alert("invalid Team name!  Team Name Should be Matched with the Team Name where you clicked Add Player button Example format is:-RR(Rajasthan Royals)");
            }
           
        }
        if(typeCode !==code){
            return alert("Please Enter correct Code");
        }
       
      
        const obj1={
            "playerName":playerName.trim(),
            "from":team.trim(),
            "price":price.trim(),
            "isPlaying":status,
            "description":role.trim()
        }
        const obj2={
            "code":typeCode.trim()
        }
        
        axios({
            method:'POST',
            url:'https://iplcricketteamplayers.herokuapp.com/addPlayers',
            headers:{'Content-Type':'application/json'},
            data:[obj1,obj2]
        }).then((response)=>{
           
            if(response.data.message==="Player already exist"){
                setPlayerName("");
                setTeam("");
                if(status!==false ){
                    if(status===true){
                        setStatus("");
                    }
                }if(status===false ){
                    setStatus("");
                }
                
                setPrice("");
                setRole("");
                setTypeCode("");
                return alert(response.data.message);
            }
            if(response.data.message="Player added successfully"){
                alert(response.data.message);
                let confirmMessage=window.confirm("if you want to add another player details click on ok else click on cancele");
                if(confirmMessage){
                    setPlayerName("");
                    setTeam("");
                    setStatus("");
                    setPrice("");
                    setRole("");
                    setTypeCode("");
                }else{
                    if(count==0){
                        if(pageNumber>0){
                           return window.location.assign("https://hema199807.github.io/webappfrontend/#/admin?p="+pageNumber);
                        }else{
                            return  window.location.assign("https://iplcricketteamplayers.herokuapp.com/details?teamName="+teamName+"&id="+playerId+"&s="+1);
                        }
                        
                    }
                   
                }
            }

        })
    }

    return ( 
        <>
        <Header />
        <div id="addplayers-main-div">
            <div id="players-div">
                <h3 style={{textAlign:"center",color:"mediumblue",marginBottom:30+"px",marginTop:20+"px"}}>Enter Player Details</h3>
                <div className="player-add-div">
                    <div className="name-div">
                        Player Name :
                    </div>
                    <input type="text" spellCheck="false" name="playerName" id="player-add-input" 
                    value={playerName} onChange={(e)=>setPlayerName(e.target.value)} />
                </div>
                <div className="player-add-div">
                    <div className="name-div">
                        Team Name :
                    </div>
                    <input type="text" spellCheck="false" name="teamname" id="player-team-input"
                    value={team} onChange={(e)=>setTeam(e.target.value)} />
                </div>
                <div className="player-add-div">
                    <div className="name-div">
                     Role :
                    </div>
                    <input type="text" spellCheck="false" placeholder="ex:- Batting,Bowling,All-rounder,etc..." name="role" id="player-role-input"
                    value={role} onChange={(e)=>setRole(e.target.value)}/>
                </div>
                <div className="player-add-div">
                    <div id="status-div">
                    Player Status :
                    </div>
                    <div style={{display: "inline-block"}}>
                        <label htmlFor="playing" id="play-lab">Playing</label>
                        <input type="radio"  name='status' id="playing" checked={status===true} onChange={()=>setStatus(Boolean(true))}/>
                        
                    </div>
                    <div style={{display: "inline-block"}}>
                        <label htmlFor="on-bench" id="ben-lab">On-Bench</label>
                        <input type="radio" name='status' id="on-bench" checked={status===false} onChange={()=>setStatus(Boolean(false))}/>  
                    </div>
                </div>
                <div className="player-add-div">
                    <div className="name-div">
                        Price :
                    </div>
                    <input type="text" spellCheck="false" name="price" id="player-price-input" placeholder="ex:-1Cr,20Lacs,10,000" 
                    value={price} onChange={(e)=>setPrice(e.target.value)}/>
                </div>
                <div className="player-add-div">
                    <div className="name-div">
                        code :
                    </div>
                    <input type="text" spellCheck="false" name="price" id="player-input" 
                    value={typeCode} onChange={(e)=>setTypeCode(e.target.value)}/>
                    <p style={{color:"red",fontSize:"16"+"px"}}> *Please Enter below Code</p>
                </div>
                <div className="code-div">
                    {code}
                </div>
                <div>
                <button id="can-btn" onClick={handleCancel}>Cancel</button>
                <button id="add-btn" onClick={handleAdd}>Add</button>
                </div>
            </div> 
            
        </div> 
        </>
    );
}
 
export default AddPlayer;
