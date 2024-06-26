import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../../configs/Config';
import './clientsettings.scss'
import '../../css/bootstrap/dist/css/bootstrap.min.css'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import { Button } from 'bootstrap';
import { useNavigate } from 'react-router-dom';
const ClientSettings = () => {
    const [items, setItems] = useState([]);
    const [fields, setSelectedRoleFields] = useState([])
    const [showdiv, setShowDiv] = useState(false)
    const [selectedID, setSelectedID] = useState(null);
    const [codeId, setCodeid] = useState("")
    const [codesetId, setCodesetid] = useState("")
    const [codesets, setCodesets] = useState([])

    const [description, setDescription] = useState("")
    const [selectedcodesetid, setSelectedCodesetID] = useState("")
    const [disabled, setDisabled] = useState(true);
    const [disabledsave, setDisabledSave] = useState(true);
    const [errorOccured, SetErrorOccured] = useState(false)
    const [disabledEdit, setDisabledEdit] = useState(true);
    const [isValid, setValid] = useState(false);
    const [disabledDelete, setDisabledDelete] = useState(false)
    const [roleId, setRoleid] = useState("")
    const [fieldId, setfieldId] = useState("")
    const [infoDescription, setInfoDescription] = useState("")
    const [inputControl, setInputControl] = useState("")
    const [required, setRequired] = useState(false)
    const [codesetLinked, setCodesetLinked] = useState("")
    const [sequence, setSequence] = useState("")
    const [infoFound, setInfoFound] = useState("")
    const [infoValueExist,setInfoValueExist]=useState(false)
    const [inputControlType,setInputControlType]=useState("false")
    //const[isChecked, setisChecked]=useState(false)
    const navigate = useNavigate()
    const validate = () => {
        return description.length
    }
    useEffect(() => {
        fetch(API_BASE_URL + "/getAllCodesets")
            .then((response) => response.json())
            .then(data => {
                setCodesets(data)
                //console.log(data)
                
              
            })
    }, [])
    useEffect(() => {
 
    }, [codesets])


    useEffect(() => {
        const isValid = validate();
        setValid(isValid);
    }, [description]);

    useEffect(() => {
        fetch(API_BASE_URL + "/getCodesByCodesetId/1")
            .then((response) => response.json())
            .then(roles => {
                setItems(roles)
            }).catch(error => console.error(error));
    }, [])

    useEffect(() => {
        fetch(API_BASE_URL + "/getCodesByCodesetId/16")
            .then((response) => response.json())
            .then(type => {
                setInputControlType(type)
               // console.log(type)
            }).catch(error => console.error(error));
    }, [])

    const handleCheckboxChange = (event) => {
        setRequired(event.target.checked);
    }

    const HandleItemClick = async (itemId) => {
        SetErrorOccured(false)
        setShowDiv(true)
        setSelectedCodesetID(itemId)
        setDisabled(true);
        setDisabledDelete(false)
        setCodesetLinked(true)

        fetch(API_BASE_URL + "/getrolefieldsbyid/" + itemId)
        .then((response) => {
            if (!response.ok) {
                setSelectedRoleFields([]);
            }
            return response.json();
        })
        .then(data => {
            setSelectedRoleFields(data);
            //console.log("This is Data", data);

            if (data.length === 0) {
                console.log("No data found for this item.");
            }

            // Perform additional actions if needed
        })
        .catch(error => {
                    //SetErrorOccured(true);
            setSelectedRoleFields([]);
        });
        setRoleid("")
        setfieldId("")
        setInfoDescription("")
        setInputControl("")
        setSequence("")
        setCodesetLinked("")
        setRequired(false)


    };
    useEffect(() => {
    
    }, [fields])
    
    const handleFieldClick = (roleId, fieldId, desc, infoField, sequence, codesetLinked, required) => {
        setRoleid(roleId)
        setfieldId(fieldId)
        setInfoDescription(desc)
        setInputControl(infoField)
        setSequence(sequence)
        setCodesetLinked(codesetLinked)
        setRequired(required)
        setDisabledEdit(true);
        setDisabledSave(true)
        SetErrorOccured(false)
        setDisabledDelete(true)
        setDisabled(true)
        setInfoValueExist(false)
    }
    const handleAddField = (cs_id) => {
        setDisabled(false);
        setDisabledSave(false)
        setDisabledEdit(true)
        setInfoDescription("")
        setInputControl("")
        setSequence("")
        setCodesetLinked("")
        setRequired(false)
        setRoleid(cs_id)
        SetErrorOccured(false)
        setDisabledDelete(false)
        setInfoValueExist(false)
        fetch(API_BASE_URL + "/getrolefieldsbyid/" + cs_id)
        .then((response) => response.json())
        .then(data => {
            //console.log("Data Length "+data.length)
            if (data.length > 0) {
                const maxSeq = Math.max(...data.map(a => a.sequence));
                const max = Math.max(...data.map(a => a.fieldId));

                setfieldId(isFinite(max) ? max + 1 : 1);
                setSequence(isFinite(maxSeq) ? maxSeq + 1 : 1);
            } else {
                setfieldId(1);
                setSequence(1);
            }
        }).catch(error => {
            setfieldId(1);
            setSequence(1);
                //SetErrorOccured(true);
        setSelectedRoleFields([]);
    });
    }

    const handleFieldEditing = (codesetId, fieldId) => {
        setDisabledSave(true)
        SetErrorOccured(false)
        setDisabledDelete(false)
        if (fieldId) {
            setDisabled(false);
            setDisabledEdit(false)
        } else {
            setDisabled(true);
        }
    }
    const handleSubmitField = async (e) => {
        e.preventDefault()
        

        const newfield = { roleId, fieldId, infoDescription, inputControl, required, codesetLinked, sequence, required }
        if (infoDescription) {
            fetch(API_BASE_URL + "/addrolefields", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newfield)
            })
                .then(response => {
                    if (response.json) {
                        //window.alert("Code Created Sucessfully")
                        HandleItemClick(roleId);
                    }
                    else {
                        SetErrorOccured(true)
                    }
                }).catch(error => console.error(error));
        }
        else {
            SetErrorOccured(true)
        }
        setDisabledSave(true)
       
    }
    const handleUpdateField = async (e) => {
        e.preventDefault()
        
        const updaterolefield = {
            roleId, fieldId, infoDescription, inputControl, required, codesetLinked, sequence
        }
        const response = await fetch(API_BASE_URL + "/updaterolefield/" + roleId + "/" + fieldId, {
            method: 'PUT',
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(updaterolefield)
        })
        if (response.ok) {
            //console.log("Successful" )
            HandleItemClick(roleId);
        }
        else {
            console.log("Error Occured")
        }
        setDisabledEdit(true)
    }
    const handleCodeDelete = async (roleId, fieldId) => {
        try {
            const response = await fetch(API_BASE_URL + "/getAllClientRolesInfobyinfoId/" + fieldId);
    
            if (response.ok) {
                const text = await response.text();
                const data = text ? JSON.parse(text) : null;
    
                if (data && data.length > 0) {  // Assuming data is an array
                    //console.log("Info linked to this field. Cannot delete.");
                    //window.alert("Info linked to this field. Cannot delete.");
                    setInfoValueExist(true)
                    // Optionally, you can set some state to display a message to the user
                    // setInfoFound(data); or set some other state to show the message
                    return;
                }
            } else {
                console.log("No Data found or Error fetching data");
            }
    
            // If no info linked, proceed to delete
            if (fieldId) {
                const deleteResponse = await fetch(API_BASE_URL + "/deleteroleField/" + roleId + "/" + fieldId, {
                    method: 'DELETE'
                });
    
                if (deleteResponse.ok) {
                    console.log("Code deleted successfully");
                    HandleItemClick(roleId);
                } else {
                    console.error("Failed to delete Code");
                }
            } else {
                setDisabledDelete(true);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    
    
    return (
        <div className="codes">
            <div className="codescontainer">
                <table className='table table-hover table-sm table-striped'>
                    <thead>
                        <tr>
                            <th>
                                Reference ID
                            </th>
                            <th>
                                Reference Set
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                       
                        {
                       
                        items.map((item) => (
                            <tr key={item.codeId}
                                onClick={() => {
                                    HandleItemClick(item.codeId)
                                }}>
                                <td>
                                    {item.codeId}
                                </td>
                                <td>
                                    {item.description}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="rightside">
                {showdiv && <div >
                    <table className='table table-hover table-sm table-striped'>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>field Id</th>
                                <th>Field Name</th>
                                <th>Input Control set</th>
                                <th>Required</th>
                                <th>Linked Ref ID</th>
                                <th>Sequence</th>

                            </tr>
                        </thead>
                        <tbody className='codesection'>
                            {fields.map((field) => (
                                <tr key={field.fieldId} onClick={() => {
                                    handleFieldClick(field.roleId, field.fieldId, field.infoDescription, field.inputControl, field.sequence, field.codesetLinked, field.required)
                                }}>
                                    <td>{field.fieldId}</td>
                                    <td>{field.fieldId}</td>
                                    <td>{field.infoDescription} </td>
                                    <td>{field.inputControl} </td>
                                    <td>{field.required ? 'True' : 'False'}</td>
                                    <td>{field.codesetLinked}</td>
                                    <td>{field.sequence}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="addedit">
                        <div className='top'>
                            <div className="header">
                                {infoValueExist &&<div><p class="text-danger">Client Info linked to this field. Cannot delete.</p></div>}
                            </div>
                            <div className="action">
                                <ControlPointIcon className='icon add' onClick={() => { handleAddField(selectedcodesetid) }} />
                                <BorderColorIcon className='icon edit' onClick={() => { handleFieldEditing(selectedcodesetid, fieldId) }} />
                                {disabledDelete && <DoNotDisturbOnIcon className='icon delete' onClick={() => { handleCodeDelete(selectedcodesetid, fieldId) }} />}
                            </div>
                        </div>
                        <div className='bottom'>
                            <div className='formholder'>
                                <form>
                                    <div className="setids">
                                        <label>RoleId</label>
                                        <div><input type="text" disabled value={roleId} onChange={e => setRoleid(e.target.value)} /></div>

                                        <label>Info</label>
                                        <div><input type="text" disabled value={fieldId} onChange={e => setfieldId(e.target.value)} /></div>

                                        <label>Description</label>
                                        <input type="text" disabled={disabled} value={infoDescription} required onChange={e => setInfoDescription(e.target.value)} />

                                    </div>
                                    <div className="setids">
                                        <label>Input Control</label>
                                        <select disabled={disabled} value={inputControl} required onChange={e => setInputControl(e.target.value)} >
                                           <option value="">---select----</option>
                                          
                                           {inputControlType.map(type=>(
                                                <option value={type.description}>{type.description}</option>

                                          ) )}

                                        
                                        

                                        </select>
                                        <label>Sequence</label>
                                        <input type="text" disabled={disabled} value={sequence} required onChange={e => setSequence(e.target.value)} />


                                    </div>
                                    <div className='setids'>
                                        <label>Link Reference</label>
                                        <select disabled={disabled} value={codesetLinked || ""} required onChange={e => setCodesetLinked(e.target.value)} >
                                            <option value="">----select---</option>
                                           


                                            {codesets.map(codeset => (
                                                <option value={codeset.codesetId}>{codeset.codesetName}</option>
                                            ))}

                                        </select>
                                        <label>Required</label>
                                        <input type="checkbox"
                                            checked={required}
                                            onChange={handleCheckboxChange} />
                                    </div>

                                    <div className='buttons'>
                                        <div>

                                        </div>
                                        <div className='edit'>
                                            <button disabled={disabledsave} type="submit" required onClick={handleSubmitField}>Save</button>
                                            <button disabled={disabledEdit} type="submit" required onClick={handleUpdateField}>Apply Changes</button>
                                        </div>
                                    </div>
                                    {errorOccured && <div className='error'>Error Occurred, Make sure you have captured the description</div>}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default ClientSettings
