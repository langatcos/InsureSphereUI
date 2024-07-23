import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../configs/Config';
import './searchClient.scss';
import './searchClients.css';
import '../../css/bootstrap/dist/css/bootstrap.min.css';
import './addclient.scss';
import SearchIcon from '@mui/icons-material/Search';
import DatePicker from 'react-datepicker';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import { TabContext } from '@mui/lab'
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
import 'react-datepicker/dist/react-datepicker.css';
import Relationships from './Relationships';
import BankAccounts from './BankAccounts';

const SearchClients = () => {
    const [searchvalue, setSearchValue] = useState("");
    const [searchvalue2, setSearchValue2] = useState("");

    const [searchresult, setSearchResult] = useState([]);
    const [searchresult2, setSearchResult2] = useState([]);
    const [noresults, setNoResults] = useState(false);
    const [searchexist, setSearchExist] = useState(false);
    const [companyexist, setCompanyExist] = useState(false);
    const [error, setError] = useState(false);
    const [clientRole, setClientRole] = useState([]);
    const [clientInfo, setClientInfo] = useState([]);
    const [viewdetailssection, setViewDetailsSection] = useState(false);
    const [roleFieldsData, setRoleFieldsData] = useState({});
    const [codes, setCodes] = useState([]);
    const [editarea, setEditArea] = useState(false);
    const [clientId, setClientId] = useState("");
    const [roleId, setRoleId] = useState("");
    const [notEdited, setNotEdited] = useState(false)
    const [addRole, setAddRole] = useState(false)
    const [viewDetails, setViewDetailsButton] = useState(true)
    const [roles, setRoles] = useState([])
    const [availableRoles, setAvailableRoles] = useState([])
    const [selectedRoles, setSelectedRoles] = useState([])
    const [selectedRoleId, setSelectedRoleId] = useState("")
    const [addRoleClientId, setAddRoleClientId] = useState("")
    const [addRoleSection, setAddRoleSection] = useState(false)
    const [roleFields, setRoleFields] = useState([])
    const [foundRoles, setFoundRoles] = useState([])
    const [dob, setDob] = useState("")
    const [changedFirstName, setChangedFirstName] = useState("");
    const [changedTitle, setChangedTitle] = useState("");
    const [changedSurname, setChangedSurname] = useState("");
    const [changedCompanyName, setChangedCompanyName] = useState("")
    const [existingClientId, setExistingClientId] = useState("")
    const [open, setOpen] = useState(false);
    const [companyResult, setCompanyResult] = useState(false)
    const [clientResult, setClientResult] = useState(false)
    const [filter, setFilter] = useState('');
    const [namesSection, setNameSection]=useState(false)
    const [filteredResults, setFilteredResults] = useState([]);
    const [searchClientName, setSearchedClient] = useState("");



    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        fetch(API_BASE_URL + "/getAllCodes")
            .then((response) => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCodes(data);
                }
            }).catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        fetch(API_BASE_URL + "/getCodesByCodesetId/1")
            .then((response) => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAvailableRoles(data);
                    //console.log(data)
                }
            }).catch((error) => {
                console.log(error);
            });
    }, []);
    const handleSearch = (e) => {
        setNameSection(false)
        
        e.preventDefault()
        setFilter('')
        fetch(API_BASE_URL + "/getclientbySearchvalue/" + searchvalue2)
            .then((response) => response.json())
            .then(data => {              
                setSearchResult2(data);                
                setOpen(true);
            }).catch(error => {
                setNoResults(true);

            })
    }
    useEffect(() => {
        if (filter === '') {
          setFilteredResults(searchresult2);
        } else {
          setFilteredResults(
            searchresult2.filter((result) => {
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
      }, [filter, searchresult2]);
   /* const filteredResults = searchresult2.filter((result) => {
        return (
            (result.clientType && typeof result.clientType === 'string' && result.clientType.toLowerCase().includes(filter.toLowerCase())) ||
            (result.title && typeof result.title === 'string' && result.title.toLowerCase().includes(filter.toLowerCase())) ||
            (result.companyName && typeof result.companyName === 'string' && result.companyName.toLowerCase().includes(filter.toLowerCase())) ||

            (result.firstName && typeof result.firstName === 'string' && result.firstName.toLowerCase().includes(filter.toLowerCase())) ||
            (result.surname && typeof result.surname === 'string' && result.surname.toLowerCase().includes(filter.toLowerCase())) ||
            (result.id && result.id.toString().includes(filter))
        ); result.id,result.clientType,result.title,result.firstName,result.surnmae,result.companyName
    });*/

    const handleSearch2 = (clientId,clientType,title,firstName,surname,companyName) => {
        handleClose()
        setFilter('')
        setFilteredResults([])
        setSearchResult2("")
        const searchInformation =(clientId,clientType,title,firstName,surname,companyName )
        //console.log("Thi is:" + clientId)
        //setSearchResult(JSON.stringify(searchInformation))
        
        setSearchValue(clientId)
        //setViewDetailsSection(true);
        setEditArea(false);
        fetch(API_BASE_URL + "/getclientbyid/" + clientId)
            .then((response) => response.json())
            .then(data => {
                setSearchResult(data);

                const clientid = data[0]?.id;
                const clienttype = data[0]?.clientType;
                const title = data[0]?.title;
                const firstName = data[0]?.firstName;
                const surname = data[0]?.surname;
                const companyName = data[0]?.companyName;
                console.log(firstName)
                
                if (clientid) {
                    
                    setValue('1');
                    setNameSection(true)
                    setSearchedClient(title+" "+firstName+" "+surname)

                    if (clienttype === 1) {
                        setSearchedClient(companyName)
                        setClientId(clientId)
                        setSearchExist(true);
                        setCompanyExist(false);
                        handleViewDetails(clientid)
                        setAddRoleClientId(clientid)
                        setExistingClientId(clientId)
                    } else {
                        setClientId(clientId)
                        setSearchExist(false);
                        setCompanyExist(true);
                        handleViewDetails(clientid)
                        setAddRoleClientId(clientid)
                        setExistingClientId(clientId)
                    }
                    setNoResults(false);
                } else {
                    setNoResults(true);
                    setCompanyExist(false);
                    setSearchExist(false);
                }
            })
            .catch(error => {
                setNoResults(true);
                setSearchExist(false);
                setCompanyExist(false);
            });
    };
console.log(searchClientName)
    const handleViewDetails = (clientid) => {
        setEditArea(false);
        setOpen(false);
        setFilteredResults([])
        fetch(API_BASE_URL + "/getclientroles/" + clientid)
            .then((response) => response.json())
            .then(data => {
                setClientRole(data);

                setViewDetailsButton(true);
                // Extract roleIds from the data array
                const roleIds = data.map(role => role.roleId);

                // Fetch additional details for each roleId
                return Promise.all(roleIds.map(roleId =>
                    fetch(API_BASE_URL + "/getrolefieldsbyid/" + roleId)
                        .then(response => response.json())
                ));
            })
            .then(roleFieldsArray => {
                // Flatten the array of arrays and set the roleFields state
                const allRoleFields = roleFieldsArray.flat();
                setRoleFields(allRoleFields);

            })
            .catch(error => {
                console.log("There are no roles defined for the client or an error occurred:", error.message);
                setAddRole(true);
                setViewDetailsButton(false);
            });

        fetch(API_BASE_URL + "/getclientInfoByClientId/" + clientid)
            .then((response) => response.json())
            .then(data => {
                setClientInfo(data);
                setViewDetailsSection(true);

                // Initialize roleFieldsData with fetched client info
                const initialRoleFieldsData = data.reduce((acc, field) => {
                    acc[field.roleId] = {
                        ...acc[field.roleId],
                        [field.infoId]: field.value,
                    };
                    return acc;
                }, {});
                setRoleFieldsData(initialRoleFieldsData);

            }).catch(error => {

                setClientInfo([]);
                fetch(API_BASE_URL + "/getclientroles/" + clientid)
                    .then(response => response.json())
                    .then(data => {
                        setFoundRoles(data)
                        setAddRole(false)
                        setEditArea(true)

                    }).catch(error => {
                        setAddRole(true)
                    })


                setViewDetailsSection(false);
            });
    };
    const handleAddRoleButton = () => {
        //console.log("This is a test")

        setOpen(false);
        setAddRoleSection(true)
    };
    const handleRoleInfoFields = (input, clientId, roleId, fieldId, isDate = false) => {
        let name, newValue;


        if (isDate) {
            // Handle the date input case
            name = fieldId;
            newValue = input;
            setDob(input);
        } else if (typeof input === 'object' && input.target) {
            // Handle the event input case (for regular input fields)
            const { name: eventName, value: eventValue, type, checked } = input.target;
            name = eventName;
            newValue = type === 'checkbox' ? checked.toString() : eventValue;
        } else {
            // Handle direct value assignment (for special cases, if any)
            name = fieldId;
            newValue = input;
        }

        setClientId(clientId);
        setRoleId(roleId);
        setRoleFieldsData(roleFieldsData => ({
            ...roleFieldsData,
            [roleId]: {
                ...roleFieldsData[roleId],
                [name]: newValue,
            },
        }));
    };


    const transformedJson = [];

    // loop over the properties of the original JSON object
    Object.keys(roleFieldsData).forEach((roleId) => {
        const roleData = roleFieldsData[roleId];

        // loop over the properties of each role object
        Object.keys(roleData).forEach((infoId) => {
            const infoValue = roleData[infoId];

            // add a new object to the transformed array
            transformedJson.push({
                id: 0, // set the "id" field to 0 as per the desired format
                roleId: parseInt(roleId), // parse the roleId to an integer
                infoId: parseInt(infoId), // parse the infoId to an integer
                value: infoValue
            });
        });
    });
    const transformedJsonWithClientId = transformedJson.map(obj => ({ ...obj, clientId: clientId }));
    //console.log(transformedJsonWithClientId)
    const handleEdit = () => {
        //console.log("clienId:"+clientId+"Roleid:"+roleId)
        setEditArea(true);
        setViewDetailsSection(false);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        //console.log("Submitted roleFieldsData:", transformedJsonWithClientId);

        // Prepare API endpoint URL
        const apiUrl = API_BASE_URL + "/updateclientinfo/" + clientId + "/" + roleId;

        // Make PUT request to update role fields data
        fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transformedJsonWithClientId)
        })
            .then(response => {
                if (response.ok) {
                    setEditArea(false);
                    handleViewDetails(clientId)
                    //console.log('Role fields data updated successfully');
                    // Optionally, handle success scenario (e.g., show success message)
                } else {
                    throw new Error('Failed to update role fields data');
                }
            })
            .catch(error => {
                window.alert("You have not updated any Field Value, The form will exit")
                setViewDetailsSection(true)
                setEditArea(false)
                //console.error('Error updating role fields data:');
                // Optionally, handle error scenario (e.g., show error message)
            });
        // Add your submit logic here
    };
    const handleSelect = (event) => {
        const selectedIndex = event.target.selectedIndex;
        const selectedRole = availableRoles[selectedIndex];

        setAvailableRoles(availableRoles.filter((role) => role.codeId !== selectedRole.codeId));
        setSelectedRoles([...selectedRoles, selectedRole]);
        // console.log(selectedRoles)
        //console.log(selectedRoles)
        /*roleId.map(roleId =>
            fetch(API_BASE_URL + "/getrolefieldsbyid/" + selectedRole.codeId)
                .then(response => response.json())
                .then(results => {
                    setRoleFields(results)
                    // console.log(results)        
                }))*/

    };

    const handleDeselect = (event) => {
        const selectedIndex = event.target.selectedIndex;
        const deselectedRole = selectedRoles[selectedIndex];
        // console.log(selectedRoles)
        setSelectedRoles(selectedRoles.filter((role) => role.codeId !== deselectedRole.codeId));
        setAvailableRoles([...availableRoles, deselectedRole]);
        setRoleFieldsData({})
    };
    const handleAddClientRole = (e) => {
        e.preventDefault()
        //console.log(selectedRoles)
        const infos = {
            "id": 0,
            "clientId": addRoleClientId,
            "roleInfo": selectedRoleId
        }
        //console.log(infos)
        const clientRoles = infos.roleInfo.map(roleId => ({
            id: infos.id,
            clientId: infos.clientId,
            roleId: roleId
        }));
        try {

            fetch(API_BASE_URL + "/addclientroles", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(clientRoles)
            })
        } catch (error) {
            console.error("Could Not add the Roles :" + error)
        }
        setAddRoleSection(false)
        setViewDetailsButton(true)
        setAddRole(false)




    }

    useEffect(() => {
        const codeId = selectedRoles.map(obj => obj.codeId)
        setSelectedRoleId(codeId)
        //console.log( "This"+codeId)

    }, [selectedRoles], [selectedRoleId])

    const [value, setValue] = useState("1");
    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className='searchClients'>
            Search client (Use any Keywords including:Names or Client id)
            <div className="formcontainer">
                <form onSubmit={handleSearch}>
                    <div className="search">
                        <input type='text' placeholder='Search ...' onChange={(e) => {
                            setViewDetailsSection(false)
                            setSearchExist(false)
                            setCompanyExist(false)
                            setEditArea(false)
                            setAddRoleSection(false)
                            setAddRole(false)
                            setSearchValue2(e.target.value)
                            setNoResults(false)
                            setNameSection(false)
                            setFilteredResults([])
                            setClientInfo([]);
                            setRoleFieldsData([])


                        }} />
                        <SearchIcon className='icon' onClick={handleSearch} />
                    </div>

                    
                   <div>
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
                                                    onClick={() => handleSearch2(result.id,result.clientType,result.title,result.firstName,result.surnamae,result.companyName)}
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
                    {namesSection &&<div>
                        {searchClientName}
                    </div>}
                    {(searchexist || companyexist) && <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                                <Tab label="Basic Info" value="1" />
                                {searchexist && <Tab label="Relationships" value="2" />}
                                <Tab label="Addresses" value="3" />
                                <Tab label="Bank Accounts" value="4" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <div className="searchresults">
                                {searchexist && (
                                    <table className='table table-hover table-sm table-striped'>
                                        <thead>
                                            <tr>
                                                <th>Client ID</th>
                                                <th>ClientType</th>
                                                <th>Title</th>
                                                <th>First Name</th>
                                                <th>Surname</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(searchresult) &&searchresult.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.id}</td>
                                                    <td>{item.clientType}</td>
                                                    <td>{item.title}</td>
                                                    <td>{item.firstName}</td>
                                                    <td>{item.surname}</td>
                                                    <td>
                                                        {viewDetails && <button onClick={(e) => handleViewDetails(item.id)}>View Details</button>}
                                                        {addRole && <button onClick={() => handleAddRoleButton()}>Add Role</button>}

                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                                {companyexist && (
                                    <table className='table table-hover table-sm table-striped'>
                                        <thead>
                                            <tr>
                                                <th>Client ID</th>
                                                <th>Client Type</th>
                                                <th>Company Name</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {searchresult.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.id}</td>
                                                    <td>{item.clientType}</td>
                                                    <td>{item.companyName}</td>
                                                    <td>
                                                        {viewDetails && <button onClick={(e) => handleViewDetails(item.id)}>View Details</button>}
                                                        {addRole && <button onClick={(e) => handleAddRoleButton()}>Add Role</button>}

                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            <div className='results'>

                                {editarea && <div> Basic Info
                                    {searchexist && <table className='table table-hover table-sm table-striped'>
                                        <thead>
                                            <tr>
                                                <th>ClientId</th>
                                                <th>Title</th>
                                                <th>FirstName</th>
                                                <th>Surname</th>


                                            </tr>

                                        </thead>
                                        <tbody>

                                            {searchresult.map(info => (
                                                <tr key={info.id}>
                                                    <td>{info.id}</td>
                                                    <td>
                                                        <select name="title" className='form-control' value={changedTitle || info.title} onChange={e => setChangedTitle(e.target.value)}>
                                                            <option value=" ">---select---</option>

                                                            {codes.filter(code => code.codesetLinked === 5).map(code => (
                                                                <option key={code.description} value={code.description}>
                                                                    {code.description}
                                                                </option>
                                                            ))}
                                                        </select>


                                                    </td>
                                                    <td>
                                                        <input type='text' className='form-control' value={info.firstName} name='firstName' required onChange={e => setChangedFirstName(e.target.value)} />

                                                    </td>
                                                    <td>
                                                        <input type='text' className='form-control' value={info.surname} name='firstName' required onChange={e => setChangedSurname(e.target.value)} />
                                                    </td>

                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>}
                                    {companyexist && <table className='table table-hover table-sm table-striped'>
                                        <thead>
                                            <tr>
                                                <th>ClientId</th>

                                                <th>Company Name</th>

                                            </tr>

                                        </thead>
                                        <tbody>

                                            {searchresult.map(info => (
                                                <tr>
                                                    <td>{info.id}</td>
                                                    <td>
                                                        <input type='text' className='form-control'
                                                            value={changedCompanyName || info.companyName} name='companyName' required
                                                            onChange={e => handleRoleInfoFields(e, info.clientId, null, 'companyName')} />


                                                    </td>

                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>}
                                </div>}
                                {viewdetailssection && (
                                    <div>
                                        <table className='table table-hover table-sm table-striped'>
                                            <thead>
                                                <tr>
                                                    <th>Role</th>
                                                    <th>InfoId</th>
                                                    <th>Info Description</th>
                                                    <th>Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {clientInfo.map((info) => (
                                                    <tr key={info.infoId}>
                                                        <td>{info.roleName}</td>
                                                        <td>{info.infoId}</td>
                                                        <td>{info.infoDescription}</td>
                                                        <td>{info.value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <button className='btn btn-primary' onClick={handleEdit}>Edit</button>
                                    </div>
                                )

                                }


                                {editarea && (
                                    <div className='editarea'>
                                        <table className='table table-sm'>
                                            <thead>
                                                <tr>
                                                    <th className='text-start'>Info Description</th>
                                                    <th className='text-start'>Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {clientRole.map(role => (
                                                    <React.Fragment key={role.codeId}>
                                                        {roleFields.filter(field => field.roleId === role.roleId).map(field => {
                                                            // Find the matching value from clientInfo
                                                            const clientInfoItem = clientInfo.find(info => info.infoid === field.fieldId && info.clientId === role.clientId);
                                                            const fieldValue = roleFieldsData[field.roleId]?.[field.fieldId] || clientInfoItem?.value || '';

                                                            return (
                                                                <tr key={field.fieldId}>
                                                                    <td className='text-start'>
                                                                        <label htmlFor={field.fieldId}>{field.infoDescription}: </label>
                                                                    </td>
                                                                    <td className='text-start'>
                                                                        {field.inputControl === 'text' && (
                                                                            <input
                                                                                type='text'
                                                                                className='form-control'
                                                                                name={field.fieldId}
                                                                                required={field.required}
                                                                                onChange={e => handleRoleInfoFields(e, role.clientId, field.roleId)}
                                                                                value={fieldValue}
                                                                            />
                                                                        )}
                                                                        {field.inputControl === 'select' && (
                                                                            <select
                                                                                className='form-control form-control-sm'
                                                                                name={field.fieldId}
                                                                                onChange={e => handleRoleInfoFields(e, role.clientId, field.roleId)}
                                                                                value={fieldValue}
                                                                            >
                                                                                <option value=" ">---select---</option>
                                                                                {codes.filter(code => code.codesetLinked === field.codesetLinked).map(code => (
                                                                                    <option key={code.description} value={code.description}>
                                                                                        {code.description}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        )}
                                                                        {field.inputControl === 'checkbox' && (
                                                                            <input
                                                                                type='checkbox'
                                                                                className='form-check-input'
                                                                                name={field.fieldId}
                                                                                onChange={e => handleRoleInfoFields(e, role.clientId, field.roleId)}
                                                                                checked={fieldValue === "true"}
                                                                            />
                                                                        )}
                                                                        {field.inputControl === 'radio' && (
                                                                            <input
                                                                                type='radio'
                                                                                className='form-check-input'
                                                                                name={field.fieldId}
                                                                                onChange={e => handleRoleInfoFields(e, role.clientId, field.roleId)}
                                                                            />
                                                                        )}
                                                                        {field.inputControl === 'textarea' && (
                                                                            <textarea
                                                                                className="form-control large-textarea"
                                                                                placeholder="Enter your text here..."
                                                                                name={field.fieldId}
                                                                                onChange={e => handleRoleInfoFields(e, role.clientId, field.roleId)}
                                                                                value={fieldValue}
                                                                            />
                                                                        )}
                                                                        {field.inputControl === 'DatePicker' && (
                                                                            <DatePicker
                                                                                name={field.fieldId}
                                                                                onChange={(date) => handleRoleInfoFields({ target: { name: field.fieldId, value: date } }, role.clientId, field.roleId)}
                                                                                dateFormat="yyyy-MM-dd"
                                                                                className="form-control"
                                                                                selected={fieldValue ? new Date(fieldValue) : null}
                                                                                showYearDropdown
                                                                                yearDropdownItemNumber={60}
                                                                                scrollableYearDropdown
                                                                            />
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </React.Fragment>
                                                ))}
                                            </tbody>
                                        </table>
                                        {notEdited && <div className='text-danger'>You have not edited any Field Information - the Form will exit</div>}
                                        <button className='btn btn-primary' onClick={handleUpdate}>Update</button>
                                    </div>
                                )}



                                {addRoleSection && <div>
                                    <div className="selections">
                                        <div className="selectbox">
                                            <label>Available Roles</label>
                                            <select multiple={true} value={[]} onChange={handleSelect}>
                                                {availableRoles.map((role) => (
                                                    <option key={role.codeId} value={role.description}>
                                                        {role.description}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="icons">
                                        </div>
                                        <div className="selectedbox">
                                            <label>Selected Options</label>
                                            <select multiple={true} value={[]} onChange={handleDeselect}>
                                                {selectedRoles.map((role) => (
                                                    <option key={role.codeId} value={role.codeId}>
                                                        {role.description}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                    </div>
                                    <div>
                                        <button type='Submit' onClick={handleAddClientRole}>Submit</button>
                                    </div>

                                </div>}


                            </div>
                        </TabPanel>
                        <TabPanel value="2"><Relationships clientId={searchvalue} /></TabPanel>
                        <TabPanel value="3"> Test </TabPanel>
                        <TabPanel value="4"><BankAccounts clientId={searchvalue} /></TabPanel>
                    </TabContext>}



                    {noresults && <div className="noresults">No Results found for value entered</div>}
                    {error && <div className="error">Error Occurred, Contact your system administrator</div>}
                </form>
            </div>




        </div>
    );
};

export default SearchClients;
