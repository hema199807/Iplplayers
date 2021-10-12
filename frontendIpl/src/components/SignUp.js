import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom"
import Header from './Header';
import './signup.css';

const SignUp = () => {
    const [fullName,setFullName]=useState("");
    const [teamName,setTeamName]=useState("");
    const [playerId,setId]=useState("");
    const [Email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [count,setCount]=useState(0);
    
    const search = useLocation().search;
    useEffect(()=>{
        if(window.location.href.indexOf("?")==-1){
            setCount(1);
        }else{
            const teamname = new URLSearchParams(search).get('teamName');
           
            const id=new URLSearchParams(search).get('id');
            setTeamName(teamname);
            setId(id);
        }
    },[])
    function handleSignUp(e){
        let format=/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        e.preventDefault();
        if(!Email || !password || !fullName || !confirmPassword){
            return alert("all fields are required");
        }if(fullName.length<3 || fullName.length>25){
            return alert("User Name length should be minimum 3 Charecters and max 25");
        }
        if(format.test(fullName)){
            return alert('UserName should be characters only');
        }
        
        if(password.trim() !== confirmPassword.trim()){
            return alert("confirmPassword Should be matched with password");
        }
        if(Email.trim().indexOf("@") ===0||Email.trim().indexOf("@") ===-1 || Email.trim().indexOf(".com") ===-1){
            return alert("email should be example@example.com");
        }
        if(Email.trim().length<8 || Email.trim().indexOf(".com")-Email.trim().indexOf("@")===1){
            return alert("email should be example@example.com and length should be min 8");
        }
        var passClass=document.getElementsByClassName("pass-check");
        if(passClass[0].style.color==="red"||passClass[1].style.color==="red"||
        passClass[2].style.color==="red"||passClass[3].style.color==="red" || 
        passClass[4].style.color==="red"){
           return alert("Password should match all the requirements")
        }
       
        const obj={
        "UserName":fullName.trim(),
        "Email":Email.trim(),
        "Password":password.trim(),
        "ConfirmPassword":confirmPassword.trim()}
        axios({
            method:'POST',
            url:'https://iplcricketteamplayers.herokuapp.com/signup',
            headers:{'Content-Type':'application/json'},
            data:obj
        }).then(response=>{
            if(response.data.message==="user already exist"){
                setEmail("");
                setPassword("");
                setFullName("");
                setConfirmPassword("");
                return alert(response.data.message);
            }else{
               
                alert(response.data.message);
                if(count==0){
                    window.location.assign("https://hema199807.github.io/webappfrontend/#/login?teamName="+teamName+"&id="+playerId);
                }else{
                    window.location.assign("https://hema199807.github.io/webappfrontend/#/");
                }
            }
           
        })
       
    }
    function handleClear(e){
        e.preventDefault();
        setEmail("");
        setPassword("");
        setFullName("");
        setConfirmPassword("");
    }
    function handleCancel(e){
        e.preventDefault();
        setEmail("");
        setPassword("");
        setFullName("");
        setConfirmPassword("");
        if(count==0){
            window.location.assign("https://iplcricketteamplayers.herokuapp.com/details?teamName="+teamName+"&id="+playerId);
        }else{
            window.location.assign("https://hema199807.github.io/webappfrontend/#/");
        }
    }
    function checkPassword(){
        var passClass=document.getElementsByClassName("pass-check");
        if(new RegExp('(?=.*[a-z])').test(password)){
            passClass[4].style.color="green";
        }else{
            passClass[4].style.color="red";
        }
        if(new RegExp('(?=.*[A-Z])').test(password)){
            passClass[3].style.color="green";
        }else{
            passClass[3].style.color="red";
        }
        if(new RegExp('(?=.*[0-9])').test(password)){
            passClass[2].style.color="green";
        }else{
            passClass[2].style.color="red";
        }
        if(new RegExp('(?=.*[@$!])').test(password)){
            passClass[1].style.color="green";
        }else{
            passClass[1].style.color="red";
        }
        if(new RegExp('(?=.{8,})').test(password)){
            passClass[0].style.color="green";
        }else{
            passClass[0].style.color="red";
        }
    }
    return ( 
        <>
        <Header />
    <div id="signup-background-img">
        <img src="https://www.thestatesman.com/wp-content/uploads/2020/09/QT-Cricket.jpg"/>
        <form id="signup-form">
            <h2 style={{textAlign:"center"}}>SignUp</h2>
            <div id="inputname-div">User Name:
                <input type="text" spellCheck="false" placeholder="Enter your Full name" name="Username" id="fullname" 
                 value={fullName} onChange={(e)=>setFullName(e.target.value)}/>
            </div>
            <div>Email:
                <input type="Email" spellCheck="false" placeholder="Enter your Email" name="email" id="email" 
                 value={Email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div>Password:
                <input type="Password" name="password" id="password"
                value={password} onChange={(e)=>setPassword(e.target.value)}
                onKeyUp={(e)=>{setPassword(e.target.value,checkPassword())}}/>
            </div>
            <p className="pass-check">.Length Should be 8 to 20 characters only</p>
            <p className="pass-check">.Must contain any of the following symbols [@$!]</p>
            <p className="pass-check">.Must have one number in between[0-9]</p>
            <p className="pass-check">.Must contain at least one upper-case</p>
            <p className="pass-check">.Must contain at least one lower-case</p>
            <div id="confirm-div">Confirm Password:
                <input type="Password" name="confirm-password" id="confirmpassword"
                value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
            </div>
            <button id="sig-btn" onClick={(e)=>{handleSignUp(e)}}>SignUp</button>
            <button id="clear-btn" onClick={(e)=>{handleClear(e)}}>Clear</button>
            <button id="signup-cancel-btn" onClick={(e)=>{handleCancel(e)}}>Cancel</button>
            
        </form>
    </div> 
    </>
    );
}
 
export default SignUp;