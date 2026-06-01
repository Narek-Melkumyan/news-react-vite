import {Outlet} from "react-router-dom";
import React from "react";
import SideBar from "../../components/sideBar.jsx";
import Header from "../../components/header.jsx";

function Layout() {
    return (
       <>
           <div className="app">

                <SideBar />

               <main className="main">

                        <Header />

                   <Outlet />

               </main>
           </div>

       </>
    );
}

export default Layout;