import Tooltip from '@mui/material/Tooltip';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../configs/Config';
import SearchIcon from '@mui/icons-material/Search';
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
    TextField,
    MenuItem, FormControl, InputLabel, Select
} from '@mui/material'

const ContactDetails = ({ clientId }) => {
   
    const [contactDetails, setContactDetails] = useState("")
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addressTypes,setAddressTypes]=useState("")
    const [addressType,setAddressType]=useState("")
    const [address1,setAddress1]=useState("")
    const [address2,setAddress2]=useState("")
    const [address3,setAddress3]=useState("")
    const [address4,setAddress4]=useState("")
    const [addressId,setAdressId]=useState("")
    const [buttonAdd,setButtonAdd]=useState(true)
    const [buttonUpdate,setButtonUpdate]=useState(false)
    const [showEdits, setShowEdits]=useState(false)
    const [selectedRow,setSelectedRow]=useState("")

    
    useEffect(() => {
        fetch(API_BASE_URL + "/getCodesByCodesetId/21")
            .then((response) => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAddressTypes(data);
                }
            }).catch((error) => {
                console.log(error);
            });
    }, []);




    useEffect(() => {
        fetch(API_BASE_URL + "/getContactsByClientId/" + clientId)
            .then((response) => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setContactDetails(data);
                    console.log(data)
                }
            }).catch((error) => {

            });
    }, [clientId]);

    const fetchClientContacts = () => {
       fetch(API_BASE_URL + "/getContactsByClientId/" + clientId)
            .then((response) => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setContactDetails(data);
                  }
            }).catch((error) => {

            });
    };

    const handleAddContact = () => {
        setAddModalOpen(true)
        setButtonAdd(true)
        setButtonUpdate(false)
    }
    const handleEditContact = () => {
        setButtonAdd(false)
        setButtonUpdate(true)
        setAddModalOpen(true)

    }
    const handleDeleteContact = () => {

    }
    const handleAddSubmit=(e)=>{
        e.preventDefault()
        const newAddress= {clientId,addressType,address1,address2,address3,address3}
        console.log(JSON.stringify(newAddress))
        fetch(API_BASE_URL + "/addContact", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAddress)
        }).then(response => {
            if (response.ok) {
                setAddModalOpen(false);
                return response.json();
            } else {
                console.log("Error occurred");
            }
        }).then(() => {
            fetchClientContacts();
        }).catch(error => {
            console.log(error);
        });

    }
    const handleClickedRow=(addressId,addressType,address1,address2,address3,address4)=>{
        setAddressType(addressType)
        setAdressId(addressId)
        setAddress1(address1)
        setAddress2(address2)
        setAddress3(address3)
        setAddress4(address4)
        setButtonUpdate(true)
        setButtonAdd(false)
        setShowEdits(true)
        setSelectedRow(addressId);
    }

    const handleUpdateSubmit =()=>{
        const updateAddress={clientId,addressId,addressType,address1,address2,address3,address4}
        console.log(JSON.stringify(updateAddress))
        fetch(API_BASE_URL + "/editClientContact/" + clientId + "/" + addressId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateAddress)
        }).then(response => {
            if (response.ok) {
                setAddModalOpen(false);
                return response.json();
                //setRequiredAccountDetails(false)
            } else {
                console.log("Error occurred");
            }
        }).then(() => {
            fetchClientContacts(); // Refetch account details after successful update
        }).catch(error => {
            console.log(error);
        });
   
    }
    return (
        <div className="container">
            <div className='buttoncontainer'>
                <div className='actionholder'>
                    <Tooltip title="Add Account">
                        <ControlPointOutlinedIcon className='addAccount' onClick={handleAddContact} />
                    </Tooltip>
                </div>
                {showEdits &&<div className='actionholder'>
                    <Tooltip title="Edit Account">
                        <EditOutlinedIcon className='editAccount' onClick={handleEditContact} />
                    </Tooltip></div>}
                {showEdits &&<div className='actionholder'>
                    <Tooltip title="Delete Account">
                        <RemoveCircleOutlineOutlinedIcon className='deleteAccount' onClick={handleDeleteContact} />
                    </Tooltip>
                </div>}
            </div>
            <div className="tableSpace">
                <table className='table table-hover table-sm table-striped'>
                    <thead>
                        <tr >
                            <th>Address Type</th>
                            <th>Address 1</th>
                            <th>Address 2</th>
                            <th>Address 4</th>
                            <th>Address 4</th>
                        </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(contactDetails) && contactDetails.map(contact=>(
                        <tr key={contact.addressId} 
                        onClick={e=>{handleClickedRow (
                            contact.addressId,
                            contact.addressType,
                            contact.address1,
                            contact.address2,
                            contact.address3,
                            contact.address4)}
                            
                            } className={selectedRow === contact.addressId ? 'table-active-custom' : ''} style={{ cursor: 'pointer' }}>
                            <td>{contact.addressType}</td>
                            <td>{contact.address1}</td>
                            <td>{contact.address2}</td>
                            <td>{contact.address3}</td>
                            <td>{contact.address4}</td>
                        </tr>
                       ))}
                    </tbody>
                </table>

            </div>
            <div>
            <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
                <DialogTitle>Edit Bank Account</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Account Type</InputLabel>
                        <Select
                            value={addressType}
                            onChange={e => setAddressType(e.target.value)}
                        >
                            {Array.isArray(addressTypes) && addressTypes.map(type => (
                                <MenuItem key={type.id} value={type.description}>{type.description}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <TextField
                            label="Address 1"
                            type="text"
                            value={address1}
                            onChange={e => setAddress1(e.target.value)}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <TextField
                            label="Address 2"
                            type="text"
                            value={address2}
                            onChange={e => setAddress2(e.target.value)}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <TextField
                            label="Address 3"
                            type="text"
                            value={address3}
                            onChange={e => setAddress3(e.target.value)}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <TextField
                            label="Address 4"
                            type="text"
                            value={address4}
                            onChange={e => setAddress4(e.target.value)}
                        />
                    </FormControl>

                    

                   

                    {/*requiredAccountDetails && <div className="form-group row">
                        <label className='nobankAccount'> Capture All Account Details</label>
                    </div>*/}
                </DialogContent>

                <DialogActions>

                    <Button onClick={() => setAddModalOpen(false)} color="primary">
                        Cancel
                    </Button>
                    {buttonAdd &&<Button onClick={handleAddSubmit} color="primary">
                        Save
                    </Button>}
                    {buttonUpdate &&<Button onClick={handleUpdateSubmit} color="primary">
                        Update
                    </Button>}
                </DialogActions>
            </Dialog>
            </div>



        </div>



    )
}
export default ContactDetails