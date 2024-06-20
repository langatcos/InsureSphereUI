import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import './products.scss'
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import ProductAttributes from './ProductAttributes';
import ProductDetails from '../../components/products/ProductDetails';

const Products = () => {
    const [value, setValue] = useState("products");

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className='products'>
            <Topbar />
            <div className="productscontainer">
                <div className="sidebar"><Sidebar /></div>
                <div className="productcontents" >
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                                    <Tab label="Products" value="products" />
                                    <Tab label="Product Field Mapping" value="attributes" />
                                    <Tab label="Rates" value="rates" />
                                    <Tab label="Duplicate Checks" value="duplicates" />
                                </TabList>
                            </Box>
                            <TabPanel value="products" >
                                <ProductAttributes />
                            </TabPanel>
                            <TabPanel value="attributes"><ProductDetails/></TabPanel>

                            <TabPanel value="rates">Rates</TabPanel>
                            <TabPanel value="duplicates">Duplicate Checks</TabPanel>

                        </TabContext>
                    </Box>
                </div>
            </div>
            Products
        </div>
    )
}

export default Products
