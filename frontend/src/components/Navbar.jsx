import React from 'react'
import { NavLink } from "react-router-dom";
import { useState } from 'react';
import "./nav.css"
function Navbar() {
const[yes,notyes]=useState(true)

  return (
    <div >
      <nav className={yes?'navbar backgroun' :'navbar background'}>
        <div className='navlist'>
        <div className='logo'>
        <img src={require('./question.jpg')} alt='Picture'></img> 
      <h1>QuestCraft</h1>
      </div>
     <li className={yes?'active':""  }   onClick={()=>notyes(true)}><NavLink to="/">Generate-Questions</NavLink></li>
        <li className={!yes?'active':""  }onClick={()=>notyes(false)}><NavLink to="/input">Insert-Questions</NavLink></li>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
