import React from "react";
import "./Header.css";


class Header extends React.Component{
    

    render(){
        return (
           <nav className="Nav">
             <div className="Nav-menus">
               <div className="Nav-brand">
		 <h1> Ethereum Dapp</h1>
                 <a className="Nav-brand-logo" href="/">
                   EthereumDapp
                 </a>
               </div>
             </div>
           </nav>
       );
    }
}

export default Header;
