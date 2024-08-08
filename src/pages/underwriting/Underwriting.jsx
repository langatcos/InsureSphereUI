import Topbar from '../../components/Topbar'
import Sidebar from '../../components/Sidebar'
import './underwriting.scss'
import { TabContext } from '@mui/lab'
import { Box } from '@mui/material'
import React, { useState } from 'react'
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import BuyCover from '../../components/underwriting/CreateCover'
import CreateCover from '../../components/underwriting/CreateCover'





const Underwriting = () => {
  const [value, setValue] = useState("createCover");
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className='client'>
      <Topbar />
      <div className="clientcontainer">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="clientContents">
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                  <Tab label="Create Cover" value="createCover" />
                  <Tab label="Policy Details" value="policydetails" />

                </TabList>
              </Box>
              <TabPanel value="createCover"><CreateCover/></TabPanel>
              <TabPanel value="policydetails" ></TabPanel>


            </TabContext>
          </Box>
        </div>

      </div>

    </div>
  )
}


export default Underwriting
