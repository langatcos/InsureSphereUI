import React, { useEffect, useState } from 'react'
import './codes.scss'
import '../../css/bootstrap/dist/css/bootstrap.min.css'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import { Button } from 'bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../configs/Config';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; const Codes = () => {
    const [items, setItems] = useState([]);
    const [codes, setSelectedCodes] = useState([])
    const [showdiv, setShowDiv] = useState(false)
    const [selectedID, setSelectedID] = useState(null);
    const [codeId, setcodeId] = useState("")
    const [codesetId, setcodesetId] = useState("")
    const [codesetLinked, setcodesetLinked] = useState("")
    const [description, setDescription] = useState("")
    const [selectedcodesetId, setSelectedcodesetId] = useState("")
    const [disabled, setDisabled] = useState(true);
    const [disabledsave, setDisabledSave] = useState(true);
    const [errorOccured, SetErrorOccured] = useState(false)
    const [disabledEdit, setDisabledEdit] = useState(true);
    const [isValid, setValid] = useState(false);
    const [disabledDelete, setDisabledDelete] = useState(false)
    const [addform, setAddForm]=useState(false)

    const [maxcodeset,setMaxCodeset]=useState("")
    const [addcodesetId,setAddcodesetId]=useState("")
    const [addcodesetdescription,setAddCodesetDescription]=useState("")
    const navigate = useNavigate()

    const validate = () => {
        return description.length
    }
    useEffect(() => {
        const isValid = validate();
        setValid(isValid);
    }, [description]);

    useEffect(() => {
        fetch(API_BASE_URL + "/getAllCodesets")
            .then((response) => response.json())
            .then(codesets => {
                setItems(codesets)
                const max = Math.max(...codesets.map(a => a.codesetId))
                if (isFinite(max)) {
                    setMaxCodeset(max + 1)
                }
                else{
                    setMaxCodeset(1)
                }
                
            })
    }, [])

    const HandleItemClick = async (itemId) => {
        SetErrorOccured(false)
        setAddForm(false)

        setShowDiv(true)
        setSelectedcodesetId(itemId)
        setDisabled(true);
        setDisabledDelete(false)

        fetch(API_BASE_URL + "/getCodesByCodesetId/" + itemId)
            .then((response) => response.json())
            .then(data => {
                setSelectedCodes(data)

            }).catch(error => {

                    //SetErrorOccured(true);
                    setSelectedCodes([]);
        });
        setcodeId("")
        setcodesetLinked("")

        setcodesetId("")
        setDescription("")
    };
    useEffect(() => {
        //console.log(codes);
    }, [codes])
    const handleCodeClick = (code_id, codeset_id, desc) => {
        setcodeId(code_id)
        setcodesetId(codeset_id)
        setDescription(desc)
        setDisabledEdit(true);
        setDisabledSave(true)
        SetErrorOccured(false)
        setDisabledDelete(true)
        setDisabled(true)
        setAddForm(false)
        setcodesetLinked(codeset_id)
    }
    const handleAddcodes = (cs_id) => {
        setAddForm(false)

        setDisabled(false);
        setDisabledSave(false)
        setDisabledEdit(true)
        setDescription("")
        setcodesetId(cs_id)
        setcodesetLinked(cs_id)
        SetErrorOccured(false)
        setDisabledDelete(false)
        fetch(API_BASE_URL + "/getCodesByCodesetId/" + cs_id)
            .then((response) => response.json())
            .then(data => {
              
                const max = Math.max(...data.map(a => a.codeId))
                if (isFinite(max)) {
                    setcodeId(max + 1)
                }
                else {
                    setcodeId(1)
                }
            }).catch(error=>{
                setcodeId(1)
            })
    }
    const handleCodeEditing = (codesetId, codeId) => {
        setDisabledSave(true)
        SetErrorOccured(false)
        setDisabledDelete(false)
        setAddForm(false)
        if (codeId) {
            setDisabled(false);
            setDisabledEdit(false)
        } else {
            setDisabled(true);
        }
    }
    const handleSubmitCode = async (e) => {
        e.preventDefault()

        const newCode = { codeId, codesetLinked, description }
       
        if (description) {
            fetch(API_BASE_URL + "/addcodes", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCode)
            })
                .then(response => {
                    if (response.json) {
                        //window.alert("Code Created Sucessfully")
                        HandleItemClick(codesetId);
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
    const handleUpdateCodes = async (e) => {
        e.preventDefault()
        const updateCode = {
            codeId, codesetId, description
        }
        const response = await fetch(API_BASE_URL + "/editcodes/" + codesetId + "/" + codeId, {
            method: 'PUT',
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(updateCode)
        })
        if (response.ok) {
            //console.log("Successful" )
            HandleItemClick(codesetId);
        }
        else {
            console.log("Error Occured")
        }
    }
    const handleCodeDelete = (codesetId, codeId) => {
        if (codeId) {
            fetch(API_BASE_URL + "/deletecodes/" + codesetId + "/" + codeId, {
                method: 'DELETE'
            }).then((response) => {
                if (response.ok) {
                    console.log("Code deleted successifully");
                    HandleItemClick(codesetId);
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
    const handleaddCodeset = () => {
        setAddForm(true)
    }
   // console.log(maxcodeset)
   // console.log(addcodesetdescription)
    
   // console.log(" thos "+JSON.stringify(newCodeset))
    const handleAddCodeset= async(e)=>{
        const codesetId=maxcodeset
        const codesetName=addcodesetdescription
        const newCodeset={ codesetId,codesetName}
        console.log(JSON.stringify(newCodeset))
        e.preventDefault()
        
        fetch(API_BASE_URL+"/addcodeset",{
            method:'POST',
            headers:{
                "content-Type": "application/json"
            },
           
            body:   JSON.stringify(newCodeset)

        })
        .then(response => {
            if (response.json) {
                //window.alert("Code Created Sucessfully")
                window.location.reload()
                navigate("/system")
                HandleItemClick(codesetId);
            }
            else {
                SetErrorOccured(true)
            }
        }).catch(error => {
            console.error(error)

        });

    }
    return (
        <div className="codes">
            <div className="codescontainer">
                <div className='top'>
                    <div></div>
                    <div className='codesetcontrols'>
                        <AddCircleOutlineIcon className='addIcon' onClick={handleaddCodeset} />
                    </div>

                </div>
                {addform &&<div className='codesetformContainer'>
                    <form >
                        <div className='formitem'>
                            <label>ReferenceID</label>
                            <input type='text' value={maxcodeset} disabled onChange={e => setAddcodesetId(e.target.value)} />
                        </div>
                        <div className='formitem'>
                            <label>Description</label>
                            <input type='text' onChange={e=>setAddCodesetDescription(e.target.value)}  />
                        </div>
                        <div className='formitem'>
                            <label></label>
                           <button type='submit' onClick={handleAddCodeset}>Save</button>
                        </div>

                    </form>
                </div>}
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
                        {items.map((item) => (
                            <tr key={item.codesetId}
                                onClick={() => {
                                    HandleItemClick(item.codesetId)
                                }}>
                                <td>
                                    {item.codesetId}
                                </td>
                                <td>
                                    {item.codesetName}
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
                                <th>codeId</th>
                                <th>Reference set</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody className='codesection'>
                            {codes.map((code) => (
                                <tr key={code.codeId} onClick={() => {
                                    handleCodeClick(code.codeId, code.codesetLinked, code.description)
                                }}>
                                    <td>{code.codeId}</td>
                                    <td>{code.codesetLinked}</td>
                                    <td>{code.description} </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="addedit">
                        <div className='top'>
                            <div className="header">
                            </div>
                            <div className="action">
                                <ControlPointIcon className='icon add' onClick={() => { handleAddcodes(selectedcodesetId) }} />
                                <BorderColorIcon className='icon edit' onClick={() => { handleCodeEditing(codesetId, codeId) }} />
                                {disabledDelete && <DoNotDisturbOnIcon className='icon delete' onClick={() => { handleCodeDelete(codesetId, codeId) }} />}
                            </div>
                        </div>
                        <div className='bottom'>
                            <div className='formholder'>
                                <form>
                                    <div className="setids">
                                        <label>codeId</label>
                                        <div><input type="text" disabled value={codeId} onChange={e => setcodeId(e.target.value)} /></div>

                                        <label>Setid</label>
                                        <div><input type="text" disabled value={codesetLinked} onChange={e => setcodesetLinked(e.target.value)} /></div>

                                        <label>Description</label>
                                        <input type="text" disabled={disabled} value={description} required onChange={e => setDescription(e.target.value)} />
                                    </div>
                                    <div className='buttons'>
                                        <div>

                                        </div>
                                        <div className='edit'>
                                            <button disabled={disabledsave} type="submit" required onClick={handleSubmitCode}>Save</button>
                                            <button disabled={disabledEdit} type="submit" required onClick={handleUpdateCodes}>Apply Changes</button>
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

export default Codes
