import React,{useEffect, useState} from 'react';
import "./header.css";
import { Link} from 'react-router-dom';
import logo from "../images/logo.png";
import Cookies from 'js-cookie';

const Header = () => {
    const [count,setCount]=useState(0);
    const [status,setStatus]=useState(0);
    const [discss,setDisCss]=useState("");
    const [userType,setUserType]=useState("");
    
    useEffect(()=>{
        if(window.location.href.indexOf("?c=")!==-1){
            createCookie('userAccess',"",-1);
            createCookie('userName',"",-1);
            setDisCss("");
            setStatus(0);
            window.location.assign("https://hema199807.github.io/webappfrontend/#/");
        }
        else{
            var myCookie1 =Cookies.get('userAccess');
            var myCookie2 =Cookies.get('userName');
            if(myCookie1){
                setCount(1);
            }
            if(myCookie2){
                setUserType(myCookie2);
                if(myCookie2.toLowerCase()!=="admin"){
                    setStatus(1);
                }
                else{
                    if(myCookie2.toLowerCase()==="admin"){
                        setStatus(2);
                    }
                }
            }
        }
        
    },[])
    
  
    function handleToSignOut(){
       setDisCss("sign-out user-out");
    }
    function handleClose(){
        setDisCss("")
    }
    function createCookie(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toUTCString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=https://hema199807.github.io/webappfrontend/#/";
    }
    function handleSignOut(){
        createCookie('userAccess',"",-1);
        createCookie('userName',"",-1);
        setDisCss("");
        setStatus(0);
        window.location.assign("https://hema199807.github.io/webappfrontend/#/");
    }
    return ( 
       <>
        <header id="top-bar">
            <div id="logo">
                <Link to="/">
                <img src={logo} alt="ipl logo"/>
                </Link>
            </div>
            <div>
                <h1 id="title">IPL Cricket Players</h1>
            </div>
            <div id="access">
                {status==0?<>
                <div id="registration-div">
                   <Link to="/signup"> <button id="hsign-btn">SignUp</button> </Link>
                </div>
                <div id="login-div">
                  <Link to="/login"> <button id="hlogin-btn">Login</button> </Link>
                </div>
                <div>
                <i className="fas fa-user-circle user-logo"></i>
                </div></>:status==1?
                <div>
                <i className="fas fa-user-circle user-logo" onClick={handleToSignOut}><span id="user-span">{userType}</span></i>
                <div className={discss===""?"sign-out":discss}>
                <button className="btn btn-sm btn-danger" style={{ float: 'right'}} onClick={handleClose}>❌</button>
                <div id="user-name">{userType}</div>
                <div style={{marginBottom: 16+"px"}} onClick={handleSignOut}>Sign Out</div>
                </div>
                </div>:
                <div>
                <i className="fas fa-user-circle user-logo" onClick={handleToSignOut}>Admin</i>
                <div className={discss===""?"sign-out":discss}>
                <button className="btn btn-sm btn-danger" style={{ float: 'right'}} onClick={handleClose}>❌</button>
                <div style={{marginBottom: 16+"px"}} onClick={handleSignOut}>Sign Out</div>
                </div>
                </div>
                }
            </div>
            </header>
            
        </>
        
    );
}
 
export default Header;