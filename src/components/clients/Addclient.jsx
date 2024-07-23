import React, { useEffect, useState } from 'react'

import './addclient.scss'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns';

import '../../externalcomponents/react-day-picker/dist/style.css'
import { API_BASE_URL } from '../../configs/Config';
//import 'react-day-picker/dist/style.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Addclient = () => {
    const [codes, setCodes] = useState([])
    const [titleArray, setTitle] = useState([])
    const [roles, setRoles] = useState([])
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [companyDisabled, setCompanyDisabled] = useState(true)
    const [disabledClient, setDisabledClient] = useState(false)
    const [checked, setChecked] = useState(true)
    const [clientType, setClientType] = useState(1)
    const [title, setSelectedTitle] = useState("")
    const [firstName, setfirstName] = useState("")
    const [surname, setSurname] = useState("")
    const [dob, setDob] = useState("")
    const [companyName, setcompanyName] = useState("")
    const [active, setActive] = useState(true)
    const navigate = useNavigate()
    const [capture_details, setCaptured] = useState(false)
    const [respondeddata, setRespondedata] = useState([])
    const [addedClientId, setAddedClientId] = useState(0)
    const [httpserver, setHttpServer] = useState("")
    const [selectedRole, setSelectedRole] = useState("")
    // const [clientid,setClientId]=useState(null)
    const [roleId, setroleId] = useState([])
    const [selected, setSelected] = useState();
    const [rolefields, setRoleFields] = useState([])
    const [providertypes, SetProviderTypes] = useState([])
    const [roleFieldsData, setRoleFieldsData] = useState([]);
    let footer = <p>Please pick a day.</p>;
    if (selected) {
        footer = <p>You picked {format(selected, 'PP')}.</p>;
    }
    /* useEffect(() => {
         fetch(API_BASE_URL + "/getsystemsettingbyid/2")
             .then((response) => response.json())
             .then(data => {
                 setHttpServer(data)
             })
 
     }, [])
     useEffect(() => {
 
     }, [httpserver])*/

    useEffect(() => {
        fetch(API_BASE_URL + "/getAllCodes")
            .then((response) => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCodes(data)
                    // setTitle(data.filter(item => item.codesetid === 79));
                    // setRoles(data.filter(item => item.codesetid === 58));
                    // console.log(codes)
                }
            }).catch((error) => {
                console.log(error);
            });

    }, [])
    useEffect(() => {
        if (codes.length > 0) {
            setTitle(codes.filter(item => item.codesetLinked === 5));
            setRoles(codes.filter(item => item.codesetLinked === 1));
            SetProviderTypes(codes.filter(item => item.codesetLinked === 91));

        }


    }, [codes])

    // console.log(selectedRoles)
    useEffect(() => {

    }, [titleArray], [providertypes])
    //console.log(codes)
    // console.log(providertypes)
    //console.log(titleArray)
    //console.log(title[0])
    const handleSelect = (event) => {
        const selectedIndex = event.target.selectedIndex;
        const selectedRole = roles[selectedIndex];

        setRoles(roles.filter((role) => role.codeId !== selectedRole.codeId));
        setSelectedRoles([...selectedRoles, selectedRole]);
        //console.log(selectedRoles)
        roleId.map(roleId =>
            fetch(API_BASE_URL + "/getrolefieldsbyid/" + selectedRole.codeId)
                .then(response => response.json())
                .then(results => {
                    setRoleFields(results)
                    // console.log(results)        
                }))

    };
    useEffect(() => {
        // const codeId=
        const selectedroleIds = selectedRoles.map(role => role.codeId);
        //console.log(selectedroleIds)

        Promise.all(selectedroleIds.map(codeId =>
            fetch(API_BASE_URL + "/getrolefieldsbyid/" + codeId)
                .then(response => response.json())
        ))
            .then(results => {
                const roleFields = results.flat();
                setRoleFields(roleFields);
                //console.log(roleFields);
            })
            .catch(error => console.error(error));


    }, [selectedRoles])



    const handleDeselect = (event) => {
        const selectedIndex = event.target.selectedIndex;
        const deselectedRole = selectedRoles[selectedIndex];
        setSelectedRoles(selectedRoles.filter((role) => role.codeId !== deselectedRole.codeId));
        setRoles([...roles, deselectedRole]);
        setRoleFieldsData({})
    };
    function handeTitleselection(e) {
        const sTittle = e.target.value
        setSelectedTitle(sTittle)
    }
    useEffect(() => {
        //console.log("Selected Title:", title);
    }, [title]);
    useEffect(() => {
        const codeId = selectedRoles.map(obj => obj.codeId)
        setroleId(codeId)

    }, [selectedRoles], [roleId])
    // console.log(roleId)

    const handleRoleInfoFields = (e, roleId, isDate = false, fieldId = null) => {
        if (isDate) {
            // Handling DatePicker event
            const value = e; // e is the selected date from DatePicker
            const name = fieldId;
            setRoleFieldsData(roleFieldsData => ({
                ...roleFieldsData,
                [roleId]: {
                    ...roleFieldsData[roleId],
                    [name]: value,
                },
            }));
        } else {
            // Handling standard input events
            const { name, value } = e.target;
            setRoleFieldsData(roleFieldsData => ({
                ...roleFieldsData,
                [roleId]: {
                    ...roleFieldsData[roleId],
                    [name]: value,
                },
            }));
        }
    };
    //console.log(roleFieldsData)

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
    const handleSubmit = (e) => {
        e.preventDefault()
        const newclient = {
            clientType, title, firstName, surname, companyName, active
        }
        if (addedClientId === 0) {
            if ((clientType === 1 && (title !== "" && firstName !== "" && surname !== "")) || (clientType === 2 && (companyName !== ""))) {
                setCaptured(false)



                fetch(API_BASE_URL + "/addclients", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newclient)
                })
                    .then(response => {
                        if (response.ok) {
                            return response.json(); // extract JSON from the response
                            //window.alert("Client Created Sucessfully")
                        }
                        else {

                            console.log("Error Occurred")

                        }
                    })
                    .then(data => {
                        //console.log(data);
                        setRespondedata(data)
                        const clientId = data.id
                        setAddedClientId(clientId)

                        const infos = {
                            "id": 0,
                            "clientId": clientId,
                            "roleInfo": roleId
                        }

                        //  console.log(roleId)



                        const clientRoles = infos.roleInfo.map(roleId => ({
                            id: infos.id,
                            clientId: infos.clientId,
                            roleId: roleId
                        }));
                        const transformedJsonWithClientId = transformedJson.map(obj => ({ ...obj, clientId: infos.clientId }));


                        try {

                            fetch(API_BASE_URL + "/addclientroles", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },

                                body: JSON.stringify(clientRoles)
                            })
                        }
                        catch (error) {
                            console.error(error);
                        }
                        try {

                            fetch(API_BASE_URL + "/addrolefieldinfo", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(transformedJsonWithClientId)
                            })
                        } catch (error) {
                            console.error(error);
                        }


                        navigate("/clients/");

                    })
                /*
                                    fetch(API_BASE_URL + "/addrolefieldinfo", {
                                        method: 'PUSH',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(transformedJson)
                                    })
                                        .then(response => {
                                            if (response.ok) {
                                                return response.json(); // extract JSON from the response
                                                //window.alert("Client Created Sucessfully")
                                            }
                                            else {
                    
                                                console.log("Error Occurred")
                                            }
                                        }).catch(error => {
                                            console.log(error)
                                        }
                    
                                        )*/
                //console.log("ClientId:"+clientid)


                // const roleinfo=[clientid,roleId]
                // 



            }
            else {
                setCaptured(true)
            }
        } else {
            console.log("Cannot Add an existing Client")
        }
    }


    //console.log(clientid)
    const handleselectedRadio = (type) => {
        // console.log(type)
        if (type === "1") {
            setCompanyDisabled(true)
            setDisabledClient(false)
            setChecked(true)
            setClientType(1)
            setcompanyName("")
        }
        else {
            setCompanyDisabled(false)
            setDisabledClient(true)
            setChecked(false)
            setClientType(2)
            setSelectedTitle("")
            setfirstName("")
            setSurname("")
        }

    }



    //console.log(transformedJson);
    return (
        <div className='addclient'>
            <div className='clientaddition'>
                <div className='functions'>
                    Functions
                    {capture_details && <span>Capture all the details</span>}

                </div>
                <form>
                    <div className="formContents">
                        <div className="personaldetails">
                            <div className="formitem">
                                <div className="itemlabel"><label></label></div>
                                <div className="iteminput">
                                    <input type="radio" id='1' value="1" name='clienttype' checked={checked} onChange={(e) => {
                                        handleselectedRadio(e.target.value);

                                    }} /> Individual
                                    <input type="radio" id='2' value="2" name='clienttype' onChange={(e) => {
                                        handleselectedRadio(e.target.value)
                                    }} /> Corporate
                                </div>
                            </div>

                            <div className="formitem">
                                <div className="itemlabel"><label>Title</label></div>
                                <div className="iteminput">
                                    <select disabled={disabledClient} name="title" onChange={handeTitleselection}>
                                        <option>    </option>
                                        {Array.isArray(titleArray) && titleArray.map((tit) => (
                                            <option key={tit.id} value={tit.description} >{tit.description}</option>
                                        ))}

                                    </select></div>

                            </div>
                            <div className="formitem">
                                <div className="itemlabel"><label>First Name</label></div>
                                <div className="iteminput">
                                    <input type="text" disabled={disabledClient} onChange={(e) => { setfirstName(e.target.value) }} />
                                </div>

                            </div>
                            <div className="formitem">
                                <div className="itemlabel"><label>Surname</label></div>
                                <div className="iteminput">
                                    <input type="text" disabled={disabledClient} onChange={(e) => { setSurname(e.target.value) }} />
                                </div>

                            </div>
                            <div className="formitem">
                                <div className="itemlabel"><label>DOB</label></div>
                                <div className="iteminput">




                                    <DatePicker
                                        selected={dob}
                                        onChange={(date) => setDob(date)}
                                        dateFormat="yyyy-MM-dd"
                                        className="form-control"
                                        showYearDropdown
                                        yearDropdownItemNumber={60}
                                        scrollableYearDropdown
                                        disabled={disabledClient}
                                    />
                                </div>

                            </div>
                            <div className="formitem">
                                <div className="itemlabel"><label>Company Name</label></div>
                                <div className="iteminput">
                                    <input type="text" disabled={companyDisabled} onChange={(e) => { setcompanyName(e.target.value) }} />
                                </div>
                            </div>
                            <div className="formitem">
                                <div className="itemlabel"><label></label></div>
                                <div className="iteminput">
                                    <input type="checkbox" checked={active} onChange={(e) => { setActive(e.target.value) }} />  Active
                                </div>
                            </div>
                        </div>
                        <div className="selections">
                            <div className="selectbox">
                                <label>Available Roles</label>
                                <select multiple={true} value={[]} onChange={handleSelect}>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.description}>
                                            {role.description}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="icons">
                            </div>
                            <div className="selectedbox">
                                <label>Selected Options</label>
                                <select multiple={true} value={[]} onChange={handleDeselect} required>
                                    {selectedRoles.map((role) => (
                                        <option key={role.id} value={role.codeId}>
                                            {role.description}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </div>
                    <div className='selectedroles'>

                        {selectedRoles.map(role => (
                            <div className="roleitem" key={role.codeId}>
                                <div>{role.description}</div>
                                {rolefields.filter(field => field.roleId === role.codeId)
                                    .map(field => (
                                        <div className="selectedrole" key={field.fieldId}>
                                            <div className='formitem'>
                                                <div className='itemlabel'>
                                                    <label key={field.fieldId}>{field.infoDescription}: </label>
                                                </div>
                                                <div className='iteminput'>
                                                    {field.inputControl === 'text' && (

                                                        <input type={field.inputControl} name={field.fieldId} required={field.required ? true : false} onChange={e => handleRoleInfoFields(e, field.roleId)} />
                                                    )}
                                                    {field.inputControl === 'radio' && (

                                                        <input type={field.inputControl} name={field.fieldId} required={field.required ? true : false} onChange={e => handleRoleInfoFields(e, field.roleId)} />
                                                    )}
                                                    {field.inputControl === 'checkbox' && (

                                                        <input type={field.inputControl} name={field.fieldId} required={field.required ? true : false} onChange={e => handleRoleInfoFields(e, field.roleId)} />
                                                    )}
                                                    {field.inputControl === 'select' && (
                                                        <select name={field.fieldId} onChange={e => handleRoleInfoFields(e, field.roleId)}>
                                                            <option value=" ">---select---</option>

                                                            {codes.filter(code => code.codesetLinked === field.codesetLinked)
                                                                .map(code => (
                                                                    <option value={code.description}>{code.description}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    )}


                                                    {field.inputControl === 'textarea' && (
                                                        <textarea class="large-textarea" placeholder="Enter your text here..." name={field.fieldId} onChange={e => handleRoleInfoFields(e, field.roleId)}></textarea>

                                                    )}


                                                    {field.inputControl === 'DatePicker' && (
                                                        <DatePicker
                                                            name={field.fieldId} // Optional: If needed for your use case
                                                            onChange={date => handleRoleInfoFields(date, field.roleId, true, field.fieldId)}
                                                            dateFormat="yyyy-MM-dd"
                                                            className="form-control"
                                                            selected={roleFieldsData[field.roleId]?.[field.fieldId] || null} // Ensure fieldValue is a valid date string or Date object
                                                            showYearDropdown
                                                            yearDropdownItemNumber={60} // Show 60 years in the dropdown (optional)
                                                            scrollableYearDropdown
                                                        />
                                                    )}
                                                </div>

                                            </div>


                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                    <div className="addbutton">


                        <div className="div">Client ID:{addedClientId}</div>
                        <div className="div"><button type='submit' onClick={handleSubmit}>Add Client</button></div>


                    </div>


                </form>
            </div>

        </div>
    )
}

export default Addclient
