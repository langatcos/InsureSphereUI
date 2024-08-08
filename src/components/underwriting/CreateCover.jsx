import React, { useEffect, useState } from "react";
import { API_BASE_URL } from '../../configs/Config';
import { BeenhereRounded } from "@mui/icons-material";
import DatePicker from 'react-datepicker';
import SearchIcon from '@mui/icons-material/Search';
import "./createcover.css"
import {
    Box, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField
} from '@mui/material'
const CreateCover = () => {
    const [products, setProducts] = useState("")
    const [productBenefits, setProductBenefits] = useState("")
    const [availablebenefits, setAvailablebenefits] = useState(false)
    const [selectedBenefits, setSelectedBenefits] = useState([]);
    const [EffectiveDate, setEffectiveDate] = useState("")
    const [policyholderName, setPolicyholdername] = useState("")
    const [open, setOpen] = useState(false);
    const [searchResults, setSearchResults]=useState([])
    const [filter,setFilter]=useState("")
    const [filteredResults,setFilteredResults]=useState([])
    const [searchresult2,setSearchresult2]=useState("")
    

    useEffect(() => {
        fetch(API_BASE_URL + "/getallproducts")
            .then(response => response.json())
            .then(data => {

                if (Array.isArray(data)) {
                    setProducts(data);
                }
                // console.log(data)
            })

    }, [])

    useEffect(() => {
        if (filter === '') {
          setFilteredResults(searchResults);
        } else {
          setFilteredResults(
            searchResults.filter((result) => {
                return (
                    (result.clientType && typeof result.clientType === 'string' && result.clientType.toLowerCase().includes(filter.toLowerCase())) ||
                    (result.title && typeof result.title === 'string' && result.title.toLowerCase().includes(filter.toLowerCase())) ||
                    (result.companyName && typeof result.companyName === 'string' && result.companyName.toLowerCase().includes(filter.toLowerCase())) ||
                    (result.firstName && typeof result.firstName === 'string' && result.firstName.toLowerCase().includes(filter.toLowerCase())) ||
                    (result.surname && typeof result.surname === 'string' && result.surname.toLowerCase().includes(filter.toLowerCase())) ||
                    (result.id && result.id.toString().includes(filter))
                );
            })
          );
        }
      }, [filter, searchResults]);
    const handleSelectBenefitDetails = (productId) => {
        setSelectedBenefits([])
        fetch(API_BASE_URL + "/getdistinctproductbenefits/" + productId)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProductBenefits(data);


                    setAvailablebenefits(true)
                }

            })
            .catch(error => {
                console.log("" + error)
                setAvailablebenefits(false)
            })

    }

    const handleCheckboxChange = (benefitId) => {
        const newSelectedBenefits = selectedBenefits.includes(benefitId)
            ? selectedBenefits.filter(id => id !== benefitId)
            : [...selectedBenefits, benefitId];

        setSelectedBenefits(newSelectedBenefits);
        console.log(selectedBenefits)
    };
    const handleSearch = (e) => {
        console.log(policyholderName)

        fetch(API_BASE_URL + "/getclientbySearchvalue/" + policyholderName)
            .then((response) => response.json())
            .then(data => {              
                if(Array.isArray(data)){
                    setSearchResults(data);                
                     setOpen(true);
                     console.log(data)
                }
            }).catch(error => {
                //setNoResults(true);

            })

    }
    
    const handleClose = () => {
        setOpen(false);
        setFilter("")
    };

   

    return (
        <div>
            <form>
                <div className="form-group">
                    <label>Policy Holder Name</label>
                    <div className="search">

                        <input placeholder='Search ...'
                         onChange={e => {
                            setPolicyholdername(e.target.value)
                            setFilteredResults([])
                            setFilter("")


                        }} />
                        <SearchIcon className='icon' onClick={handleSearch} />

                    </div>
                    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                        <DialogTitle>Search Results</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Filter"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Client Type</TableCell>
                                            <TableCell>Names</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.isArray(filteredResults) && filteredResults.map((result) => (
                                            <TableRow
                                                key={result.id}
                                                onClick={() => handleSearch(result.id, result.clientType, result.title, result.firstName, result.surname, result.companyName)}
                                                className='SearchModal'
                                            >
                                                <TableCell>{result.id}</TableCell>
                                                <TableCell>{result.clientType}</TableCell>
                                                <TableCell>{result.title} {result.firstName} {result.surname} {result.companyName}</TableCell>


                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>


                </div>
                <div className="form-group">
                    <label>Effective Date</label>
                    <div className="iteminput">




                        <DatePicker
                            selected={EffectiveDate}
                            onChange={(date) => setEffectiveDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                            showYearDropdown
                            yearDropdownItemNumber={60}
                            scrollableYearDropdown

                        />
                    </div>

                </div>
                <div className="form-group">
                    <label >Product Name</label>
                    <select className="form-control" onChange={e => handleSelectBenefitDetails(e.target.value)} >
                        <option value="">---Select---</option>
                        {Array.isArray(products) && products.map(product => (
                            <option key={product.productId} value={product.productId}>{product.productName}</option>
                        ))}

                    </select>
                    {availablebenefits && <div className="benefits">
                        <label >Benefits</label>
                        <div className="benefits-list">
                            {Array.isArray(productBenefits) && productBenefits.map(ben => (
                                <div key={ben.benefitId} className="benefit-item">
                                    <input
                                        type="checkbox"
                                        id={`benefit-${ben.benefitId}`}
                                        checked={selectedBenefits.includes(ben.benefitId)}
                                        onChange={() => handleCheckboxChange(ben.benefitId)}
                                    />
                                    <label htmlFor={`benefit-${ben.benefitId}`}>{ben.benefitName}</label>
                                </div>
                            ))}
                        </div>

                    </div>}
                </div>

            </form>

        </div>


    )

}
export default CreateCover