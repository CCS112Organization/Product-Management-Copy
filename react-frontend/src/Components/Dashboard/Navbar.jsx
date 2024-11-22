import React, { useState } from 'react'
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import { SidebarData } from "./SidebarData";
import { IconContext } from 'react-icons';
import './Navbar.css';

export const Navbar = () => {
const[sidebar, setSidebar] = useState(false);
const showSidebar = () => setSidebar(!sidebar)
const navigate = useNavigate();

const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
};
  return (
    <>
    <IconContext.Provider value={{color: '#fff'}}>
        <div className = 'navbar'>
            <Link to='#' className='menu-bars'>
                <FaIcons.FaBars onClick={showSidebar} />
            </Link>
        </div>
        <nav className={sidebar ? 'nav-menu active': 'nav-menu'}>
            <ul className='nav-menu-items'  onClick={showSidebar}>
                <li className='navbar-toggle'>
                    <Link to="#" className="menu-bars">
                    <AiIcons.AiOutlineClose />
                    </Link>
                </li>
                {SidebarData.map((item, index) => {
                    return (
                        <li key={index} className={item.cName}>
                            {item.path === '/' ? (
                                <Link to={item.path} onClick={handleLogout}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            ) : (
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            )}
                        </li>
                        
                    )
                })}
            </ul>
        </nav>
        </IconContext.Provider>
    </>
  )
}

export default Navbar