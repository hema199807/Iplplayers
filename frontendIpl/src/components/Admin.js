import React,{useEffect, useState} from 'react';
import axios from 'axios';
import "./Admin.css";
import loader from "../images/preloader.gif";
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';


const ADMIN = () => {
    const [players,setPlayers]=useState([]);
    const [loading,setLoading]=useState(true);
    const [teamName,setTeamName]=useState("");
    const [pagesCount,setPagesCount]=useState([]);
    const [pageNo,setPageNo]=useState(Number);
    const [data,setData]=useState([]);

    const search = useLocation().search;
    useEffect(()=>{
        let mArr=[];
        var p=new URLSearchParams(search).get('p');
        setPageNo(p);
        axios("https://iplcricketteamplayers.herokuapp.com/getPlayers").then(({data})=>{
            
            function setArr(item){
                let pos=0;
                for(var i=0;i<mArr.length;i++){
                  if(mArr[i].name.toLowerCase()===item.from.toLowerCase()){
                    pos++;
                  }
                }
                if(pos===0){
                  mArr.push({name:item.from});
                }
            }
            for(var i=0;i<data.data.length;i++){
                if(mArr.length===0){
                  mArr.push({name:data.data[i].from})
                }
                else{
                  setArr(data.data[i]);
                }
            }
        
            var teamNameArr=data.data.filter((item)=>{
                if(item.from.toLowerCase()===mArr[(Number(p))-1].name.toLowerCase()){
                    return item;
                }
            })
            setData(data.data);
            setPagesCount(mArr);
            setTeamName(mArr[(Number(p))-1].name);
            setPlayers(teamNameArr);
            setLoading(false);
        })
    },[])
    function handlePagination(pagenumber){
        
        var updateteamNameArr=data.filter((item)=>{
            if(item.from.toLowerCase()===pagesCount[(Number(pagenumber))-1].name.toLowerCase()){
                return item;
            }
        })
        setPlayers(updateteamNameArr);
        setTeamName(pagesCount[(Number(pagenumber))-1].name);
        setPageNo(pagenumber);
        window.location.assign("https://hema199807.github.io/webappfrontend/#/admin?p="+pagenumber);
    }
    return ( 
        <>
        <Header />
        <div id="admin-main-div">
            {loading===true ?<img style={{position:"absolute",width:100+"px",height:100+"px",bottom: 360+"px",left:45+"%"}} src={loader}/>:
            <>
            <h1 id="display-teamname">{teamName}</h1>
            <Link to={`/add?teamName=${teamName}&p=${pageNo}`}><button id="add-player">Add Player</button></Link>
            <div id="players-details-div">
                {players.length && players.map((item,index)=>{
                    return <div key={index} className="players-wrapper">
                        <h3>Name: {item.playerName}</h3>
                        <p>Team Name: {item.from}</p><br/>
                        <p>Playing Status: {item.isPlaying===true?"Playing":"On-Bench"}</p><br/>
                        <p>Role: {item.description}</p><br/>
                        <p>Price: {item.price}</p>
                    </div>
                })}
            </div>
            <div id="align-page-no">
            {pagesCount.length && pagesCount.map((item,index)=>{
                return <div className="pagination" key={index}>
                        <button className={pageNo==index+1?"active":""} onClick={()=>handlePagination(index+1)}>{index+1}</button>
                </div>
            })}
            </div>
            </>}
        </div>
        </>
    );
}
 
export default ADMIN;