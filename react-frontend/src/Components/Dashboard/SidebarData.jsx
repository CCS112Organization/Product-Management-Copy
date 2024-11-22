import React from 'react'
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io5";
import * as RiIcons from "react-icons/ri";

export const SidebarData = [
    {
        title: 'Home',
        path: '/dashboard',
        icon: <AiIcons.AiFillHome/>,
        cName: 'nav-text'
    },
    {
        title: 'Add Product',
        path: '/dashboard/addproduct',
        icon: <IoIcons.IoAddCircle />,
        cName: 'nav-text'
    },
    {
        title: 'Log-out',
        path: '/',
        icon: <RiIcons.RiLogoutCircleFill/>,
        cName: 'nav-text'
    }
]