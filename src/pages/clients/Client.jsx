import { TabContext } from '@mui/lab'
import { Box } from '@mui/material'
import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import './client.scss'
import ClienManagement from './ClienManagement'
import ClientSettings from '../../components/clientsettings/ClientSettings'

const Client = () => {
    const [value, setValue] = useState("clientmanagement");
    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };
  return (
    <div className='client'>
        <Topbar/>
        <div className="clientcontainer">
            <div className="sidebar">
             <Sidebar/>
            </div>
            <div className="clientContents">
            <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                                    <Tab label="Clients" value="clientmanagement" />
                                    <Tab label="Client Settings" value="clientsettings" />

                            </TabList>
                            </Box>
                            <TabPanel value="clientmanagement"><ClienManagement/></TabPanel>
                            <TabPanel value="clientsettings" ><ClientSettings/>
                            </TabPanel>

                           

                        </TabContext>
                    </Box>
            </div>
            
        </div>
      
    </div>
  )
}

export default Client
