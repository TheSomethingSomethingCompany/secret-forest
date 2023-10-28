"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"


  
export default function Navbar(){

    const [displayIcon,setDisplayIcon]= useState(false);
    
    var [loggedIn, setLoggedIn] = useState(true);

    if(window.localStorage.getItem("loggedIn")){
        loggedIn = true;
    }

    function login(){
        setLoggedIn(true)
    }

    function logout(){
        localStorage.removeItem("loggedIn");
        setLoggedIn(false)
    }

    function smallLogin(){
        setLoggedIn(true)
        handleIcon()
    }

    function smallLogout(){
        localStorage.removeItem("loggedIn");
        setLoggedIn(false)
        handleIcon()
    }

    const handleIcon= ()=>{
        setDisplayIcon(!displayIcon);
    }


    useEffect(()=>{
        if(window.localStorage.getItem("loggedIn")){
            setLoggedIn(true);
        }
    },[]);
    
    useEffect(()=>{
        if (!loggedIn)
            window.localStorage.removeItem("loggedIn");
    },[loggedIn]);


    return (
        <header className="bg-slate-950 text-white w-full fixed top-0 left-0 z-10 text-1xl">

                <nav className="max-w-full mx-1 h-[50px] flex justify-between items-center p-3">

        <div>
            <Link href="/" onClick={handleIcon}>TheSomethingSomethingCompany</Link>
        </div>

{/* large screen */}
<ul className="hidden md:flex">
    <li className="mr-2 lg:mr-4 hover:text-teal-300">
        <Link href="/"><button className="rounded-full font-bold  py-1 px-1 mt-1">Home</button></Link>
    </li>

    {loggedIn ? 
    (   <>
        
        <li className="mr-2 lg:mr-4 hover:text-teal-300">
            <Link href="#"><button className="rounded-full font-bold  py-2 px-1">Requests</button></Link>
        </li>

        <li className="mr-2 lg:mr-4 hover:text-teal-300">
            <Link href="#"><button className="rounded-full font-bold  py-2 px-1">Chats</button></Link>
        </li>

        <li className="mr-2 lg:mr-4 hover:text-teal-300">
            <Link href="#"><button className="rounded-full font-bold  py-2 px-1">Profile</button></Link>
        </li>

        <li className="mr-2 lg:mr-4 hover:text-teal-300">
            <Link href="#" onClick={logout}><button className="rounded font-bold bg-teal-600 py-2 px-4">Logout</button></Link>
        </li>

        </>
    ) 
    : 
    (<li className="mr-2 lg:mr-4 hover:text-teal-300">
    <a><button className="rounded font-bold bg-teal-600 py-2 px-4" onClick={() => setLoggedIn(true)}>Login</button></a>
        </li>)}
</ul>

{/* small screen icon */}
<div onClick={handleIcon} className="flex md:hidden">
     {displayIcon ? (<p>X</p>):(<p>E</p>)}
</div>

{/* small screen navbar */}

<div className={displayIcon ? 
    "md:hidden absolute top-[50px] right-0 bottom-0 left-0 flex justify-center items-center w-full bg-slate-800  text-center h-screen ease-in duration-300"
     : 
    "md:hidden absolute top-[50px] right-0 left-[-100%] flex justify-center items-center w-full h-screen bg-slate-800 text-white text-center ease-in duration-300"
    }>  
    
    {/* nav links */}
    <div className="w-full">
        <ul className="font-bold text-1xl">

            <li onClick={handleIcon} className="py-5 hover:text-text-teal-300">
                <Link href="/">Home</Link>
            </li>

            {loggedIn ? 
            (   <>
                                            
                <li onClick={handleIcon} className="py-5 hover:text-text-teal-300">
                    <Link href="#">Requests</Link>
                </li>

                <li onClick={handleIcon} className="py-5 hover:text-text-teal-300">
                    <Link href="#">Chat</Link>
                </li>

                <li onClick={handleIcon} className="py-5 hover:text-text-teal-300">
                    <Link href="#">Profile</Link>
                </li>

                <li className="py-5 hover:text-text-teal-300">
                    <Link href="#" onClick={smallLogout}>Logout</Link>
                </li>

                </>
            )
            :
            (<li className="py-5 hover:text-text-teal-300">
            <Link href="#" onClick={smallLogin}>Login</Link>
                </li>)}

        </ul>
    </div>

</div>

</nav>
        </header>
    )
   
}


