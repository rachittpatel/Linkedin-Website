import React from "react";
import NavBarComponent  from "@/Components/Navbar";



export default function UserLayout({children}) {
  return (
    <div>

     <NavBarComponent/>
      {children}
 

    
      
      </div>

  )
}


