import React from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";



export default function LandingPage(){

    const routeTo = useNavigate();
    return (
        <>
           <div className="landingPageContainer">
            <nav>
                <div className="navHeader">
                    <h2>Video Conferencing App</h2>
                </div>
                <div className="navList">
                    <p onClick={()=>{
                        routeTo("/guest");
                    }} >Join as Guest</p>
                    <p onClick={()=>{
                        routeTo("/auth");
                    }}>Register</p>
                    <button onClick={()=>{
                        routeTo("/auth");
                    }}>Login</button>
                </div>
            </nav>

            <div className="landingMainContainer">
                <div className="MainBlock1">
                    <h1><span>Connect</span> with your Loved Ones</h1>
                    <p>cover a distance by video conferencing app</p>
                    <Link to="/Auth">
                        <button>Get Started</button>
                    </Link>
                </div>

            <div className="MainBlock2">
                <img src="../public/mobile.png" alt="" />
            </div>
           </div>
        </div>

         
        </>
        
    )
}