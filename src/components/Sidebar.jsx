import React from 'react'
import './sidebar.scss'

import DashboardIcon from '@mui/icons-material/Dashboard';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import MedicationLiquidOutlinedIcon from '@mui/icons-material/MedicationLiquidOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import DeckOutlinedIcon from '@mui/icons-material/DeckOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined';
import SavingsIcon from '@mui/icons-material/Savings';
import { Link } from 'react-router-dom';
const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className="Highlights">

                <div className="header">
                    Highlights
                </div>
                <Link to="/" className='link'>
                    <div className="menuitem">
                        <DashboardIcon className='icon' />
                        Dashboard
                    </div>
                </Link>
                <div className="menuitem">
                    <ConfirmationNumberOutlinedIcon className='icon' />
                    Tickets
                </div>
            </div>
            <div className="Highlights">

                <div className="header">
                    Functions
                </div>
                <Link to="/products" className='link'>
                    <div className="menuitem">
                        <Inventory2OutlinedIcon className='icon' />
                        Products
                    </div>
                </Link>
                <Link to="/clients" className='link'>
                <div className="menuitem">
                    <Diversity1OutlinedIcon className='icon' />
                    Client Management
                </div>
                </Link>
                <Link to="/underwriting" className='link'>
                <div className="menuitem">
                    <DeckOutlinedIcon className='icon' />
                    Underwriting
                </div>
                </Link>
                <div className="menuitem">
                    <SupportAgentOutlinedIcon className='icon' />
                    Care
                </div>
                <div className="menuitem">
                    <MedicationLiquidOutlinedIcon className='icon' />
                    Claims
                </div>
                <div className="menuitem">
                    <PaidOutlinedIcon className='icon' />
                    Accounts
                </div>
                <Link to="/banks" className='link'>
                <div className="menuitem">
                    <SavingsIcon className='icon' />
                    Banks
                </div>
                </Link>
            </div>
            <div className="Highlights">

                <div className="header">
                    System Settings
                </div>
                <div className="menuitem">
                    <GroupOutlinedIcon className='icon' />
                    Users
                </div>
                <Link className='link' to="/system">
                    <div className="menuitem">
                        <SettingsOutlinedIcon className='icon' />
                        System Attributes
                    </div>
                </Link>

            </div>
        </div>
    )
}

export default Sidebar

