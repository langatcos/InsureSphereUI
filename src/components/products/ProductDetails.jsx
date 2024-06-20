import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../../configs/Config';
import './productdetails.scss'
import '../../css/bootstrap/dist/css/bootstrap.min.css'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import { Button } from 'bootstrap';
import { useNavigate } from 'react-router-dom';
import { type } from '@testing-library/user-event/dist/type';
const ProductDetails = () => {
    const [items, setItems] = useState([]);
    const [fields, setSelectedRoleFields] = useState([])
    const [showdiv, setShowDiv] = useState(false)
    const [selectedID, setSelectedID] = useState(null);
    const [codeid, setCodeid] = useState("")
    const [codesetid, setCodesetid] = useState("")
    const [codesets, setCodesets] = useState([])

    const [description, setDescription] = useState("")
    const [selectedType, setSelectedType] = useState("")
    const [disabled, setDisabled] = useState(true);
    const [disabledsave, setDisabledSave] = useState(true);
    const [errorOccured, SetErrorOccured] = useState(false)
    const [disabledEdit, setDisabledEdit] = useState(true);
    const [isValid, setValid] = useState(false);
    const [disabledDelete, setDisabledDelete] = useState(false)
    const [infoId, setinfoId] = useState("")
    const [type, setType] = useState("")
    //const [infodescription, setInfoDescription] = useState("")
    const [inputControl, setinputControl] = useState("")
    const [required, setRequired] = useState(false)
    const [codesetLinked, setcodesetLinked] = useState("")
    const [sequence, setSequence] = useState("")
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
        fetch(API_BASE_URL + "/getCodesByCodesetId/4")
            .then((response) => response.json())
            .then(roles => {
                setItems(roles)
            })
    }, [])

    const handleCheckboxChange = (event) => {
        setRequired(event.target.checked);
    }
    const HandleItemClick = async (type) => {
       
        SetErrorOccured(false)
        setShowDiv(true)
        setSelectedType(type)
        setDisabled(true);
        setDisabledDelete(false)
        setcodesetLinked(true)
        //console.log("This is type "+type)
 
        fetch(API_BASE_URL + "/getfieldsbyid/"+ type)
            .then((response) => response.json())
            .then(data => {
                setSelectedRoleFields(data)
               // console.log("This is Data "+data)
            })
       setType("")
        setinfoId("")
        setDescription("")
        setinputControl("")
        setSequence("")
        setcodesetLinked("")
        setRequired(false)


    };
    useEffect(() => {
        //console.log(codes);
    }, [fields])
    const handleFieldClick = (type, infoId, desc, infofield, sequence, codesetLinked, required) => {
        setType(type)
        setinfoId(infoId)
        setDescription(desc)
        setinputControl(infofield)
        setSequence(sequence)
        setcodesetLinked(codesetLinked)
        setRequired(required)
        setDisabledEdit(true);
        setDisabledSave(true)
        SetErrorOccured(false)
        setDisabledDelete(true)
        setDisabled(true)
        }
    const handleAddField = (type) => {
    
        setDisabled(false);
        setDisabledSave(false)
        setDisabledEdit(true)
        setDescription("")
        setinputControl("")
        setSequence("")
        setcodesetLinked("")
        setRequired(false)
        setType(type)
        SetErrorOccured(false)
        setDisabledDelete(false)
        fetch(API_BASE_URL + "/getfieldsbyid/" + type)
            .then((response) => response.json())
            .then(data => {
               console.log(data)
                const maxSeq = Math.max(...data.map(a => a.sequence))

                const max = Math.max(...data.map(a => a.infoId))
                if (isFinite(max)) {
                    setinfoId(max + 1)
                    setSequence(maxSeq + 1)
                }
                else {
                    setinfoId(1)
                    setSequence(1)
                }
            })
    }

    const handleFieldEditing = (codesetid, infoId) => {
        setDisabledSave(true)
        SetErrorOccured(false)
        setDisabledDelete(false)
        if (infoId) {
            setDisabled(false);
            setDisabledEdit(false)
        } else {
            setDisabled(true);
        }
    }
    const handleSubmitField = async (e) => {
        e.preventDefault()

        const newfield = { type, infoId, description, inputControl, required,codesetLinked, sequence, required }
        if (description) {
            fetch(API_BASE_URL + "/addproductbenefitfields", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newfield)
            })
                .then(response => {
                    if (response.json) {
                        //window.alert("Code Created Sucessfully")
                        HandleItemClick(type);
                    }
                    else {
                        SetErrorOccured(true)
                    }
                }).catch(error => console.error(error));
        }
        else {
            SetErrorOccured(true)
        }
    }
    const handleUpdateField = async (e) => {
        e.preventDefault()
        const updatefield = {
            type, infoId, description, inputControl, required, codesetLinked, sequence
        }
        const response = await fetch(API_BASE_URL + "/updatebenefitfield/" + type + "/" + infoId, {
            method: 'PUT',
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(updatefield)
        })
        if (response.ok) {
            //console.log("Successful" )
            HandleItemClick(type);
        }
        else {
            console.log("Error Occured")
        }
    }
    const handleCodeDelete = (type, infoId) => {
        if (infoId) {
            fetch(API_BASE_URL + "/deleteproductBenefitField/" + type + "/" + infoId, {
                method: 'DELETE'
            }).then((response) => {
                if (response.ok) {
                    console.log("Code deleted successifully");
                    HandleItemClick(type);
                }
                else {
                    console.error("Failed to delete Code");
                }
            }).catch((error) => {
                console.error("Error deleting user:", error);
            });
        }
        else {
            setDisabledDelete(true)
        }
    }
    return (
        <div className="codes">
            <div className="codescontainer">
                <table className='table table-hover table-sm table-striped'>
                    <thead>
                        <tr>
                            <th>
                                ID
                            </th>
                            <th>
                                Component Type
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}
                                onClick={() => {
                                    HandleItemClick(item.description)
                                }}>
                                <td>
                                    {item.codeid}
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
                                <th>infoId</th>
                                <th>Field Name</th>
                                <th>Input Control set</th>
                                <th>Required</th>
                                <th>Linked Ref ID</th>
                                <th>Sequence</th>
                            </tr>
                        </thead>
                        <tbody className='codesection'>
                            {fields.map((field) => (
                                <tr key={field.infoId} onClick={() => {
                                    handleFieldClick(field.type, field.infoId, field.description, field.inputControl, field.sequence ,field.codesetLinked, field.required)
                                }}>
                                    <td>{field.infoId}</td>
                                    <td>{field.infoId}</td>
                                    <td>{field.description} </td>
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
                            </div>
                            <div className="action">
                                <ControlPointIcon className='icon add' onClick={() => { handleAddField(selectedType) }} />
                                <BorderColorIcon className='icon edit' onClick={() => { handleFieldEditing(selectedType, infoId) }} />
                                {disabledDelete && <DoNotDisturbOnIcon className='icon delete' onClick={() => { handleCodeDelete(selectedType, infoId) }} />}
                            </div>
                        </div>
                        <div className='bottom'>
                            <div className='formholder'>
                                <form>
                                    <div className="setids">
                                        <label>Type</label>
                                        <div><input type="text" disabled value={type} onChange={e => setType(e.target.value)} /></div>

                                        <label>Info</label>
                                        <div><input type="text" disabled value={infoId} onChange={e => setinfoId(e.target.value)} /></div>

                                        <label>Description</label>
                                        <input type="text" disabled={disabled} value={description} required onChange={e => setDescription(e.target.value)} />

                                    </div>
                                    <div className="setids">
                                        <label>Input Control</label>
                                        <select disabled={disabled} value={inputControl} required onChange={e => setinputControl(e.target.value)} >
                                            <option value="">----select---</option>
                                            <option value="text">Text</option>
                                            <option value="select">Select(Combobox)</option>
                                            <option value="checkbox">Checkbox</option>
                                            <option value="radio">Radio</option>

                                        </select>
                                        <label>Sequence</label>
                                        <input type="text" disabled={disabled} value={sequence} required onChange={e => setSequence(e.target.value)} />


                                    </div>
                                    <div className='setids'>
                                        <label>Link Reference</label>
                                        <select disabled={disabled} value={codesetLinked || ""} required onChange={e => setcodesetLinked(e.target.value)} >
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

export default ProductDetails
