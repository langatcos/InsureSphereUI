import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../configs/Config';
import './searchClient.scss';
import './searchClients.css';
import '../../css/bootstrap/dist/css/bootstrap.min.css';
import './addclient.scss';
import SearchIcon from '@mui/icons-material/Search';

const SearchClients = () => {
    const [searchvalue, setSearchValue] = useState("");
    const [searchresult, setSearchResult] = useState([]);
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
        e.preventDefault();



        //setViewDetailsSection(true);
        setEditArea(false);
       
        fetch(API_BASE_URL + "/getclientbyid/" + searchvalue)
            .then((response) => response.json())
            .then(data => {
                setSearchResult(data);

                const clientid = data[0]?.id;
                const clienttype = data[0]?.clientType;
                if (clientid) {
                    if (clienttype === 1) {
                        setClientId(clientId)
                        setSearchExist(true);
                        setCompanyExist(false);
                        handleViewDetails(clientid)
                        setAddRoleClientId(clientid)
                    } else {
                        setClientId(clientId)
                        setSearchExist(false);
                        setCompanyExist(true);
                        handleViewDetails(clientid)
                        setAddRoleClientId(clientid)
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

    const handleViewDetails = (clientid) => {
        setEditArea(false);
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
                .then(response=>response.json())
                .then(data=>{
                    setFoundRoles(data)
                    setAddRole(false)
                    setEditArea(true)

                }).catch(error =>{
                    setAddRole(true)
                })
                
                
                setViewDetailsSection(false);
            });
    };
    const handleAddRoleButton = () => {
        //console.log("This is a test")

        setAddRoleSection(true)
    };
    const handleRoleInfoFields = (e, clientId, roleId) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setClientId(clientId)
        setRoleId(roleId)
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

    return (
        <div className='searchClients'>
            Search client by ClientNo
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
                            setSearchValue(e.target.value)

                        }} />
                        <SearchIcon className='icon' onClick={handleSearch} />
                    </div>
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
                                    {searchresult.map((item) => (
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
                    {noresults && <div className="noresults">No Results found for value entered</div>}
                    {error && <div className="error">Error Occurred, Contact your system administrator</div>}
                </form>
            </div>
            <div className='results'>
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



        </div>
    );
};

export default SearchClients;
