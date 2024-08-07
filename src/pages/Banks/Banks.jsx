import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import Codes from '../../components/codes/Codes'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import './banks.scss'
import BankSetups from '../../components/banks/BankSetups'



const Banks = () => {
    const [value, setValue] = useState("banks");

    const handleTabChange = (event, newValue) =>{
        setValue(newValue);
    }
    return (
        <div className='systemattributes'>
            <Topbar />
            <div className="systemcontainer">
                <div className="sidebar"><Sidebar/></div>
                <div className='systemcontents'>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                                    <Tab label="Banks" value="banks" />
                                    <Tab label="banks settings" value="bankssettings" />
                                    
                                </TabList>
                            </Box>
                            

                            <TabPanel value="banks" >
                               <BankSetups/>
                            </TabPanel>
                            <TabPanel value="bankssettings">Banks Additional Info </TabPanel>


                        </TabContext>
                    </Box>
                </div>
            </div>


        </div>
    )
}

export default Banks
