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

            }).catch(error => {
                setRelationshipExist(false)
            })

    }, [])

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

    return (
        <div className='client'>

            <div className='buttoncontainer'>
                <div className='actionholder'>
                    <Tooltip title="Add Relation">
                        <ControlPointOutlinedIcon className='addAccount' onClick={handleAddRelation} />
                    </Tooltip>
                </div>
                <div className='actionholder'>
                    <Tooltip title="Edit Relationships">
                        <EditOutlinedIcon className='editAccount' onClick="" />
                    </Tooltip></div>
                <div className='actionholder'>
                    <Tooltip title="Remove Relationship">
                        <RemoveCircleOutlineOutlinedIcon className='deleteAccount' onClick="" />
                    </Tooltip>
                </div>
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
                                        onClick={() => selectedClient(result.id, result.clientType, result.title, result.firstName, result.surnamae, result.companyName)}
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
                            <tr key={rel.childClientId}>
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


        </div>
    )
}



export default Relationships
