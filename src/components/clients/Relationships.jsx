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
    MenuItem,FormControl,InputLabel,Select
} from '@mui/material'

const Relationships = ({ clientId }) => {
    const [relationshipExist, setRelationshipExist] = useState(false)
    const [relationships, setRelationships] = useState("")
    const [searchValue, setSearchValue] = useState("")
    const [showSearch, setShowSearch] = useState(false)
    const [searchResults, setSearchResults] = useState("")
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [relationshipTypes, setRelationshipTypes] = useState([]);
    const [selectedRow, setSelectedRow] = useState("")
    const [selectedRelationshipType,setSelectedRelationshipType]=useState("")
    const [relationshipField,setRelationshipField]=useState("")
    const [selectedDependantRow, setSelectedDependantRow]=useState("")
    const [showEdits,setShowEdits]=useState(false)
    const [modalOpen,setModalOpen]=useState(false)
    const [relationshipToEdit,setRelationshipToEdit]=useState("")
    const [parentClientIdToEdit,setParentClientIdToEdit]=useState("")
    const [childClientIdToEdit,setChildClientIdToEdit]=useState("")
    const [relationship,setRelationship]=useState("")
    const [showAddRelationship,setShowAddRelationship]=useState(true)
    const [showDependantEx,setShowDependantEx]=useState(false)
 

    useEffect(() => {
        fetch(API_BASE_URL + "/getCodesByCodesetId/20")
            .then((response) => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRelationshipTypes(data);
                }
            }).catch((error) => {
                console.log(error);
            });
    }, []);
    useEffect(() => {
        fetch(API_BASE_URL + "/getRelationships/" + clientId)
            .then(response => response.json())
            .then((data) => {
                setRelationships(data)
                setRelationshipExist(true)
                const clientChild = data[0]?.childClientId;
                console.log("This is the ClientChildId:"+clientChild)
                if(clientId===clientChild){
                    setShowAddRelationship(false)
                    setShowEdits(false)
                    setShowDependantEx(true)
                }

            }).catch(error => {
                setRelationshipExist(false)
            })

    }, [])
    const fetchClientrelationships=()=>{
        fetch(API_BASE_URL + "/getRelationships/" + clientId)
            .then(response => response.json())
            .then((data) => {
                setRelationships(data)
                setRelationshipExist(true)
                const clientChild = data[0]?.childClientId;
                if(clientId===clientChild){
                    setShowAddRelationship(false)
                    setShowEdits(false)
                    setShowDependantEx(true)
                }
                

            }).catch(error => {
                setRelationshipExist(false)
            })
    }

    const fetchClientClientRelationship=()=>{
        fetch(API_BASE_URL + "/getRelationships/" + clientId)
            .then(response => response.json())
            .then((data) => {
                setRelationships(data)
                setRelationshipExist(true)

            }).catch(error => {
                setRelationshipExist(false)
            }) 
    };
    const handleAddRelation = () => {
        setShowSearch(true)
        setShowEdits(false)
        setSelectedDependantRow("")


    }

    useEffect(() => {
        if (filter === '') {
            setFilteredResults(searchResults);
        } else {
            setFilteredResults(
                searchResults.filter((result) => {
                    return (
                        (result.clientType && typeof result.clientType === 'string' && result.clientType.toLowerCase().includes(filter.toLowerCase())) ||
                        (result.title && typeof result.title === 'string' && result.title.toLowerCase().includes(filter.toLowerCase())) ||
                        (result.firstName && typeof result.firstName === 'string' && result.firstName.toLowerCase().includes(filter.toLowerCase())) ||
                        (result.surname && typeof result.surname === 'string' && result.surname.toLowerCase().includes(filter.toLowerCase())) ||
                        (result.id && result.id.toString().includes(filter))
                    );
                })
            );
        }
    }, [filter, searchResults]);

    const handleSearch = (e) => {
        e.preventDefault()

        fetch(API_BASE_URL + "/getclientbySearchvalue/" + searchValue)
            .then((response) => response.json())
            .then(data => {
                setSearchResults(data);
                const clienttype = data[0]?.clientType;

                if (clienttype === 1) {

                } else {

                    console.log("coprorate cannot be linked to Individual")

                }
                //console.log(data)
                setOpen(true);

            }).catch(error => {
                //setNoResults(true);

            })

        console.log("This is Searching .....")
    }
    const selectedClient = (clientId, clientType, title, firstName, surname, companyName) => {
        setRelationshipField(true)
        setSelectedRow(clientId)
        console.log("This is the clientID" + clientId)

    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSaveRelationship=()=>{
        const parentClientId=clientId
        const childClientId=selectedRow
        const relationship=selectedRelationshipType
        const newRelationship={parentClientId,childClientId,relationship}

        fetch(API_BASE_URL + "/addclientRelationship", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRelationship)
        }).then(response => {
            if (response.ok) {
                handleClose()
                //setShowAddSection(false);
                return response.json();
                
            } else {
                console.log("Error occurred");
            }
        }).then(() => {
            fetchClientClientRelationship();
        }).catch(error => {
            console.log(error);
        });
    }
    const handleResultsClick=(childClientId,parentClientId,relationship)=>{
        //console.log(childClientId)
        setSelectedDependantRow(childClientId)
        setRelationshipToEdit(relationship)
        setShowEdits(true)
        setParentClientIdToEdit(parentClientId)
        setChildClientIdToEdit(childClientId)
        if(childClientId===clientId){
            setShowEdits(false)
        }
        
        
    }
    const handleEditClick=()=>{
        setModalOpen(true)

    }

    const handleUpdateSubmit=(e)=>{
        e.preventDefault()
        console.log("Submitted")
        const parentClientId=parentClientIdToEdit
        const childClientId=childClientIdToEdit
        const relationship=relationshipToEdit
        
        const newRelationship={parentClientId,childClientId,relationship}
        //console.log(JSON.stringify(newRelationship))
        fetch(API_BASE_URL + "/editClientRelationship/" + childClientId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRelationship)
        }).then(response => {
            if (response.ok) {
                setModalOpen(false);
                return response.json();
                //setRequiredAccountDetails(false)
            } else {
                console.log("Error occurred");
            }
        }).then(() => {
            fetchClientrelationships(); // Refetch account details after successful update
        }).catch(error => {
            console.log(error);
        });
    }
    const handleDeleteRelationship = () => {

        if (selectedDependantRow) {
            fetch(API_BASE_URL + "/deleteRelationship/"+childClientIdToEdit, {
                method: 'DELETE'
            }).then((response) => {
                if (response.ok) {
                    console.log("ClientRelationship  deleted successifully");
                    fetchClientClientRelationship()
                }
                else {
                    console.error("Failed to delete Relationship");
                }
            }).catch((error) => {
                console.error("Error deleting Relationship:", error);
            });
        }
        else {
            console.log("No Relationships Selected for Deletion")
        }

    }
    return (
        <div className='client'>

            <div className='buttoncontainer'>
                {showAddRelationship &&<div className='actionholder'>
                    <Tooltip title="Add Relation">
                        <ControlPointOutlinedIcon className='addAccount' onClick={handleAddRelation} />
                    </Tooltip>
                </div>}
                {showEdits &&<div className='actionholder'>
                    <Tooltip title="Edit Relationships">
                        <EditOutlinedIcon className='editAccount' onClick={handleEditClick} />
                    </Tooltip></div>}
                    {showEdits &&<div className='actionholder'>
                    <Tooltip title="Remove Relationship">
                        <RemoveCircleOutlineOutlinedIcon className='deleteAccount' onClick={handleDeleteRelationship} />
                    </Tooltip>
                </div>}
            </div> <br></br>
            {showSearch && <form onSubmit={handleSearch}>
                <div className="search">
                    <input type='text' placeholder='Search ...' onChange={(e) => {
                        setSearchValue(e.target.value)

                    }} />
                    <SearchIcon className='icon' onClick={handleSearch} />
                </div>
            </form>}
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
                                        onClick={() => selectedClient(result.id, result.clientType, result.title, result.firstName, result.surname, result.companyName)}
                                        className={selectedRow === result.id ? 'table-active-custom' : ''}
                                    >
                                        <TableCell>{result.id}</TableCell>
                                        <TableCell>{result.clientType}</TableCell>
                                        <TableCell>{result.title} {result.firstName} {result.surname} {result.companyName}</TableCell>


                                    </TableRow>
                                ))}




                            </TableBody>
                        </Table>
                    </TableContainer>
                    <br></br>
                   

                    
                </DialogContent>
               
                <DialogActions>
                {relationshipField &&<FormControl fullWidth margin="dense">
                        <InputLabel>Select Relationship</InputLabel>
                        <Select
                            onChange={e => setSelectedRelationshipType(e.target.value)}
                        >
                            {relationshipTypes.length > 0 ? (
                                   relationshipTypes.map(types => (
                                    <MenuItem  key={types.codeId} value={types.description}>
                                      {types.description}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="" disabled>
                                    No branches available
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>}

                   
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    {relationshipField &&<Button onClick={handleSaveRelationship} color="primary">
                        Save
                    </Button>}
                </DialogActions>
            </Dialog>


            {relationshipExist && <div>
                <table className='table table-hover table-sm table-striped'>
                    <thead>
                        <tr>
                            <th>Parent ID</th>
                            <th> Parent Name</th>
                            <th>Dependant ID</th>
                            <th>Dependant Name</th>
                            <th>Relationship</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(relationships) && relationships.map((rel) => (
                            <tr key={rel.childClientId} onClick={e=>handleResultsClick(rel.childClientId,rel.parentClientId,rel.relationship)}
                            className={selectedDependantRow === rel.childClientId ? 'table-active-custom' : ''} style={{ cursor: 'pointer' }}
                            >
                                <td>{rel.parentClientId}</td>
                                <td>{rel.parentFirstName} {rel.parentSurname}</td>
                                <td>{rel.childClientId}</td>
                                <td>{rel.childFirstName} {rel.childSurname}</td>
                                <td>{rel.relationship}</td>

                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>}
            {showDependantEx &&<div>
                <label>The Client Selected is a dependant and Relationships cannot be managed here</label>
            </div>}

            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>Edit Relationship</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Relationship</InputLabel>
                        <Select
                            value={relationshipToEdit}
                            onChange={e => setRelationshipToEdit(e.target.value)}
                        >
                            {Array.isArray(relationshipTypes) && relationshipTypes.map(type => (
                                <MenuItem key={type.id} value={type.description}>{type.description}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </DialogContent>

                <DialogActions>

                    <Button onClick={() => setModalOpen(false)} color="primary">
                        Cancel
                    </Button>
                  
                    <Button onClick={handleUpdateSubmit} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>


        </div>
    )
}



export default Relationships
