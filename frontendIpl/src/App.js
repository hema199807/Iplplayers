import axios from 'axios';
import React, {Component} from 'react';
import "./App.css";
import Icon from "./images/search-icon.svg";
import loader from "./images/preloader.gif";
import Header from './components/Header';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      teamNames:[],
      searchValue:"",
      teamName:false,
      loading:true,
    }
  }
  componentDidMount(){
      var myCookie2 = this.readCookie('userName');
      if(myCookie2){
        if(myCookie2.toLowerCase()=="admin"){
          window.location.assign("https://hema199807.github.io/webappfrontend/#/admin?p="+1);
        }
      }
    
    let mArr=[];
   
    axios("https://iplcricketteamplayers.herokuapp.com/getPlayers").then(({data})=>{
      
      function setArr(item){
        let pos=0;
        for(var i=0;i<mArr.length;i++){
          if(mArr[i].name===item.from){
            pos++;
          }
        }
        if(pos===0){
          mArr.push({name:item.from,id:item._id});
        }
      }

      for(var i=0;i<data.data.length;i++){
        if(mArr.length===0){
          mArr.push({name:data.data[i].from,id:data.data[i]._id})
        }
        else{
          setArr(data.data[i]);
        }
      }
      
      this.setState({teamNames:mArr},()=>{
        this.setState({loading:false});
      })
    })
  }
  readCookie=(name)=>{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }
 
  handleSubmit=(e)=>{
    e.preventDefault();
  }
  handleChange=(event)=>{
    this.setState({searchValue:event.target.value})
  }
  handleClick=(e)=>{
    const {searchValue,teamNames}=this.state;
    if(e.key==="Enter"){
      if(searchValue !== ""){
        if(teamNames.length){
          {this.onSearchValue()}
        }
      }
    }
  }
  onSearchValue=()=>{
    const {searchValue,teamNames}=this.state;

    let updateValue=teamNames.filter((item)=>{
      let searchTeamName;
      let updateTeamNames=item.name;
      updateTeamNames=updateTeamNames.split(" ");
      updateTeamNames=updateTeamNames.join("");
      let getValue=item.name.split(")")[0];
      updateTeamNames=updateTeamNames.split(")")[0];
      let setUpdateTeamNames=getValue.split("(")[1];
      let setUpdateTeam=setUpdateTeamNames.split(" ")[0]+setUpdateTeamNames.split(" ")[1]+" "+setUpdateTeamNames.split(" ")[2];
      if(setUpdateTeam.toLowerCase()===searchValue.trim().toLowerCase()){
        return searchTeamName=searchValue.trim();
      }
      if(searchValue.trim().toLowerCase()===getValue.split("(")[0].toLowerCase() || 
      searchValue.trim().toLowerCase()===getValue.split("(")[1].toLowerCase() || 
      searchValue.trim().toLowerCase()===updateTeamNames.split("(")[0].toLowerCase() ||
      searchValue.trim().toLowerCase()===updateTeamNames.split("(")[1].toLowerCase()){
        return searchTeamName=searchValue.trim();
      }
      if(item.name.toLowerCase()===searchValue.trim().toLowerCase() || 
        item.name.split(" ").join("").toLowerCase()===searchValue.trim().toLowerCase()){
        return searchTeamName=searchValue.trim();
      }
    })
    if(updateValue.length){
      var myCookie2 = this.readCookie('userName');
      if(myCookie2){
        window.location.assign("https://iplcricketteamplayers.herokuapp.com/details?teamName="+updateValue[0].name+"&id="+updateValue[0].id+"&s="+1);
      }else{
      window.location.assign("https://iplcricketteamplayers.herokuapp.com/details?teamName="+updateValue[0].name+"&id="+updateValue[0].id);
      }
    }else{
      this.setState({teamName:true})
    }
    this.setState({searchValue:""})
  }
  render() { 
    const {searchValue,teamName,loading}=this.state;
    return ( 
      <>
      <Header />
      <div id="landingpage-background-img">
        <img src="https://www.thestatesman.com/wp-content/uploads/2020/09/QT-Cricket.jpg" style={{width:100+"%",height:100+"%"}}/>
        {loading===true ?<img style={{position:"absolute",width:100+"px",height:100+"px",bottom: 360+"px",left:45+"%"}} src={loader}/>:teamName===false?
        <form onSubmit={(e)=>{this.handleSubmit(e)}} id="form">
          <img id="search-icon" src={Icon} alt="Search Icon" />
          <input type="text" placeholder="Enter Ipl TeamName Get Players" 
          name="search-box" onChange={(event)=>{this.handleChange(event)}} 
          onKeyDown={(e)=>{this.handleClick(e)}} id="search-box" value={searchValue} />
        </form>:
        <>
        <form onSubmit={(e)=>{this.handleSubmit(e)}} id="form">
         <img id="search-icon" src={Icon} alt="Search Icon" />
         <input type="text" placeholder="Enter Ipl TeamName Get Players" 
         name="search-box" onChange={(event)=>{this.handleChange(event)}} 
         onKeyDown={(e)=>{this.handleClick(e)}} id="search-box" value={searchValue} />
       </form>
        <h6 style={{fontSize:20+"px",color:"red",position:"absolute",bottom: 330+"px",left:45+"%"}}>Not Found</h6>
      </>}
      </div>
      </>
    );
  }
}
 
export default App;