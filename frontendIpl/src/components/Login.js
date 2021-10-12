import React, {useEffect, useState} from 'react';
import './login.css';
import { Link } from 'react-router-dom';
import {useLocation} from "react-router-dom"
import Modal from 'react-modal';
import axios from 'axios';
import Header from './Header';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '3px',
        backgroundColor: 'black',
        border: 'solid 2px brown',
        width: '50%',
        height: '62%',
    }
};

const Login = () => {
    const [teamName,setTeamName]=useState("");
    const [playerId,setId]=useState("");
    const [Email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [count,setCount]=useState(0);
    const [modalIsOpen,setModal]=useState(false);
    const [FEmail,setFEmail]=useState("");
    const [userId,setUserId]=useState("");
    const [passwordModalIsOpen,setPasswordModal]=useState(false);
    const [FPassword,setFPassword]=useState("");
         
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
    })
    function createCookie(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toUTCString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=https://hema199807.github.io/webappfrontend/#/";
    }
    
    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    function handleLogin(e){
        e.preventDefault();
        if(!Email || !password){
            return alert("all fields are required");
        }
        const obj={
            "Email":Email.trim(),
            "Password":password.trim()
        }
        axios({
            method:'POST',
            url:'https://iplcricketteamplayers.herokuapp.com/login',
            headers:{'Content-Type':'application/json'},
            data:obj
        }).then(response=>{
            if(response.data.msg==="User does not Exist"){
                alert(response.data.msg);
                if(count==0){
                    window.location.assign("https://hema199807.github.io/webappfrontend/#/signup?teamName="+teamName+"&id="+playerId);
                }else{
                    window.location.assign("https://hema199807.github.io/webappfrontend/#/signup");
                }
            }
            if(response.data.msg==="Invalid user"){
                return alert(response.data.msg + " Check Password and Email")
            }if(response.data.msg==="Loggin successfully"){
                alert(response.data.msg);
                createCookie('userAccess', response.data.userToken, 1)
                createCookie('userName',response.data.username, 1)
                
                if(count==0){
                    var myCookie2 = readCookie('userName');
                    if(myCookie2){
                       window.location.assign("https://iplcricketteamplayers.herokuapp.com/details?teamName="+teamName+"&id="+playerId+"&s="+1);
                    }else{
                    window.location.assign("https://iplcricketteamplayers.herokuapp.com/details?teamName="+teamName+"&id="+playerId);
                    }
                }else{
                    var myCookie2 = readCookie('userName');
                    if(myCookie2){
                        if(myCookie2.toLowerCase()=="admin"){
                            window.location.assign("https://hema199807.github.io/webappfrontend/#/admin?p="+1);
                        } else{
                            window.location.assign("https://hema199807.github.io/webappfrontend/#/");
                        }
                    }
                   
                }
            }
        })
    }
    function handleClear(e){
        e.preventDefault();
        setEmail("");
        setPassword("");
    }
    function handleCancel(e){
        e.preventDefault();
        setEmail("");
        setPassword("");
        if(count==0){
            var myCookie2 = readCookie('userName');
            if(myCookie2){
                window.location.assign("https://iplcricketteamplayers.herokuapp.com/details?teamName="+teamName+"&id="+playerId+"&s="+1);
            }else{
                window.location.assign("https://iplcricketteamplayers.herokuapp.com/details?teamName="+teamName+"&id="+playerId);
            }
        }else{
            window.location.assign("https://hema199807.github.io/webappfrontend/#/");
        }
    }
    function handleForgetPassword(e){
        e.preventDefault();
        setEmail("");
        setPassword("");
        setModal(true);
    }
    function handleClose(){
        setModal(false);
    }
    function handleProceed(){
        if(!FEmail){
            return alert("all fields are required");
        }
        const obj={
            "Email":FEmail.trim()
        }
        axios({
            method:'POST',
            url:'https://iplcricketteamplayers.herokuapp.com/forgetpassword',
            headers:{'Content-Type':'application/json'},
            data:obj
        }).then(response=>{
            if(response.data.msg==="User does not Exist"){
                alert(response.data.msg);
                if(count==0){
                    window.location.assign("https://hema199807.github.io/webappfrontend/#/signup?teamName="+teamName+"&id="+playerId);
                }else{
                    window.location.assign("https://hema199807.github.io/webappfrontend/#/signup");
                }
            }else{
                setUserId(response.data.id);
                setFEmail("");
                setModal(false);
                setPasswordModal(true);
            }
        })
    }
    function checkPassword(){
        var passClass=document.getElementsByClassName("pass-check");
        if(new RegExp('(?=.*[a-z])').test(FPassword)){
            passClass[4].style.color="green";
        }else{
            passClass[4].style.color="red";
        }
        if(new RegExp('(?=.*[A-Z])').test(FPassword)){
            passClass[3].style.color="green";
        }else{
            passClass[3].style.color="red";
        }
        if(new RegExp('(?=.*[0-9])').test(FPassword)){
            passClass[2].style.color="green";
        }else{
            passClass[2].style.color="red";
        }
        if(new RegExp('(?=.*[@$!])').test(FPassword)){
            passClass[1].style.color="green";
        }else{
            passClass[1].style.color="red";
        }
        if(new RegExp('(?=.{8,})').test(FPassword)){
            passClass[0].style.color="green";
        }else{
            passClass[0].style.color="red";
        }
    }
    function handlePasswordChange(){
        if(!FPassword){
            return alert("all fields are required");
        }
        var passClass=document.getElementsByClassName("pass-check");
        if(passClass[0].style.color==="red"||passClass[1].style.color==="red"||
        passClass[2].style.color==="red"||passClass[3].style.color==="red" || 
        passClass[4].style.color==="red"){
           return alert("Password should match all the requirements")
        }
        const obj={
            "Password":FPassword.trim()
        }
        axios({
            method:'POST',
            url:'https://iplcricketteamplayers.herokuapp.com/updatePassword/'+userId,
            headers:{'Content-Type':'application/json'},
            data:obj
        }).then(response=>{
            if(response.data.msg==="password updated successfully"){
                setFPassword("");
                setPasswordModal(false);
                return alert(response.data.msg);
            }
        })
    }
    function handleCloseNew(){
        setPasswordModal(false);
    }
    return ( 
        <>
        <Header />
    <div id="login-background-img">
        <img src="https://www.thestatesman.com/wp-content/uploads/2020/09/QT-Cricket.jpg"/>
        <form id="login-form">
            <h2 style={{textAlign:"center"}}>Login</h2>

            <div id="input-div">Email:
                <input type="Email" spellCheck="false" placeholder="Enter your Email" name="email" id="email" 
                 value={Email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div>Password:
                <input type="Password" name="password" id="log-password"
                value={password} onChange={(e)=>setPassword(e.target.value)}
                onKeyDown={(e)=>e.key === "Enter" ? handleLogin(e) : null }/>
            </div>
            <button id="log-btn" onClick={(e)=>{handleLogin(e)}}>Login</button>
            <button id="clear-btn" onClick={(e)=>{handleClear(e)}}>Clear</button>
            <button id="cancel-btn" onClick={(e)=>{handleCancel(e)}}>Cancel</button>
            <button id="forgpass-btn" onClick={(e)=>{handleForgetPassword(e)}}>Forget Password</button>
            <div id="signupmsg-div">
                <p>Create an Account?<Link to={count===0?"/signup?teamName="+teamName+"&id="+playerId:"/signup"}>SignUp</Link></p>
            </div>
        </form>
        <Modal
            isOpen={modalIsOpen}
            style={customStyles}
        >
            <button className="btn btn-sm btn-danger" style={{ float: 'right'}} onClick={handleClose}>❌</button>
            <h3 style={{textAlign:"center",color:"white",marginTop:20+"px"}}>Forget Password</h3>
            <div id="Finput-div">Email:
                <input type="Email" spellCheck="false" placeholder="Enter your Email" name="email" id="Femail" 
                 value={FEmail} onChange={(e)=>setFEmail(e.target.value)}/>
            </div>
            <button id="pr-btn" onClick={handleProceed}>Proceed</button>      
        </Modal>
        <Modal
            isOpen={passwordModalIsOpen}
            style={customStyles}
        >
            <button className="btn btn-sm btn-danger" style={{ float: 'right'}} onClick={handleCloseNew}>❌</button>
            <h3 style={{textAlign:"center",color:"white",marginTop:20+"px"}}>New Password</h3>
            <div id="Finput-div">Password:
                <input type="password" name="email" id="Femail" 
                 value={FPassword} onChange={(e)=>setFPassword(e.target.value)}
                 onKeyUp={(e)=>{setFPassword(e.target.value,checkPassword())}}/>
            </div>
            <p className="pass-check" style={{color:'white',display:"block",marginBottom:0,marginLeft:100+"px",marginTop:10+"px"}}>.Length Should be 8 to 20 characters only</p>
            <p className="pass-check" style={{color:'white',display:"block",marginBottom:0,marginLeft:100+"px"}}>.Must contain any of the following symbols [@$!]</p>
            <p className="pass-check" style={{color:'white',display:"block",marginBottom:0,marginLeft:100+"px"}}>.Must have one number in between[0-9]</p>
            <p className="pass-check" style={{color:'white',display:"block",marginBottom:0,marginLeft:100+"px"}}>.Must contain at least one upper-case</p>
            <p className="pass-check" style={{color:'white',display:"block",marginBottom:0,marginLeft:100+"px"}}>.Must contain at least one lower-case</p>
            <button id="pr-btn" onClick={handlePasswordChange}>Proceed</button>      
        </Modal>
    </div> 
    </>
    );
}
 
export default Login;