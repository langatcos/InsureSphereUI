

import React, { useEffect, useState } from 'react'
import './banksetups.scss'
import '../../css/bootstrap/dist/css/bootstrap.min.css'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import { Button } from 'bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../configs/Config';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; 
const BankSetups = () => {
    const [items, setItems] = useState([]);
    const [branches, setSelectedBranch] = useState([])
    const [showdiv, setShowDiv] = useState(false)
    const [selectedID, setSelectedID] = useState(null);
    const [branchCode, setBranchCode] = useState("")
    const [bankCode, setBankCode] = useState("")
    const [bankCodeLinked, setbankCodeLinked] = useState("")
    const [bankBranch, setBankBranch] = useState("")
    const [selectedBankCode, setSelectedBankCode] = useState("")
    const [disabled, setDisabled] = useState(true);
    const [disabledsave, setDisabledSave] = useState(true);
    const [errorOccured, SetErrorOccured] = useState(false)
    const [disabledEdit, setDisabledEdit] = useState(true);
    const [isValid, setValid] = useState(false);
    const [disabledDelete, setDisabledDelete] = useState(false)
    const [addform, setAddForm]=useState(false)

    const [maxBank,setMaxBank]=useState("")
    const [addBankCode,setAddBankCode]=useState("")
    const [addBank,setAddBank]=useState("")
    const [toEditBranchCode,setToEditBranchCode]=useState("")
    const navigate = useNavigate()

    const validate = () => {
        return bankBranch.length
    }
    useEffect(() => {
        const isValid = validate();
        setValid(isValid);
    }, [bankBranch]);

    useEffect(() => {
        fetch(API_BASE_URL + "/getAllbanks")
            .then((response) => response.json())
            .then(banks => {
                setItems(banks)
                const max = Math.max(...banks.map(a => a.id))
                if (isFinite(max)) {
                    setMaxBank(max + 1)
                }
                else{
                    setMaxBank(1)
                }
                
            })
    }, [])

    const HandleItemClick = async (itemId) => {
        SetErrorOccured(false)
        setAddForm(false)

        setShowDiv(true)
        setSelectedBankCode(itemId)
        setDisabled(true);
        setDisabledDelete(false)

        fetch(API_BASE_URL + "/getAllBranchesByBankcode/" + itemId)
            .then((response) => response.json())
            .then(data => {
                setSelectedBranch(data)

            }).catch(error => {

                    //SetErrorOccured(true);
                    setSelectedBranch([]);
        });
        setBranchCode("")
        setbankCodeLinked("")

        setBankCode("")
        setBankBranch("")
    };
    useEffect(() => {
        //console.log(codes);
    }, [branches])
    const handleBranchClick = (branchCode, bankCode, bankBranch) => {
        setBranchCode(branchCode)
        setBankCode(bankCode)
        setBankBranch(bankBranch)
        setDisabledEdit(true);
        setDisabledSave(true)
        SetErrorOccured(false)
        setDisabledDelete(true)
        setDisabled(true)
        setAddForm(false)
        setbankCodeLinked(bankCode)
    }
    const handleAddBankButton = (cs_id) => {
        setAddForm(false)

        setDisabled(false);
        setDisabledSave(false)
        setDisabledEdit(true)
        setBankBranch("")
        setBankCode(cs_id)
        setbankCodeLinked(cs_id)
        SetErrorOccured(false)
        setBranchCode("")
        setDisabledDelete(false)
        fetch(API_BASE_URL + "/getAllBranchesByBankcode/" + cs_id)
            .then((response) => response.json())
            .then(data => {
              
                
            }).catch(error=>{
                console.log("No records found")
            })
    }
    const handleCodeEditing = (bankCode, branchCode) => {
        setDisabledSave(true)
        SetErrorOccured(false)
        setDisabledDelete(false)
        console.log("This"+branchCode)
        setToEditBranchCode(branchCode)
        setAddForm(false)
        if (branchCode) {
            setDisabled(false);
            setDisabledEdit(false)
        } else {
            setDisabled(true);
        }
    }
    const handleSubmitCode = async (e) => {
        e.preventDefault()
        const bankCode=bankCodeLinked
        const newBranch = { branchCode, bankCode, bankBranch }
        if (bankBranch) {
            fetch(API_BASE_URL + "/addBankBranch", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBranch)
            })
                .then(response => {
                    if (response.json) {
                        //window.alert("Code Created Sucessfully")
                        HandleItemClick(bankCode);
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
    const handleUpdateCodes = async (e) => {
        e.preventDefault()
        const updateBranch = {
            branchCode, bankCode, bankBranch
        }
        console.log(JSON.stringify(updateBranch))
        const response = await fetch(API_BASE_URL + "/editbankbranch/" + bankCode + "/" + toEditBranchCode, {
            method: 'PUT',
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(updateBranch)
        })
        if (response.ok) {
            //console.log("Successful" )
            HandleItemClick(bankCode);
        }
        else {
            console.log("Error Occured")
        }
        setDisabledEdit(true)
    }
    const handleCodeDelete = (bankCode, branchCode) => {
        if (branchCode) {
            fetch(API_BASE_URL + "/deletebranches/" + bankCode + "/" + branchCode, {
                method: 'DELETE'
            }).then((response) => {
                if (response.ok) {
                    console.log("Code deleted successifully");
                    HandleItemClick(bankCode);
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
    const handleAddBank= async(e)=>{
        const bankCode=addBankCode
        const bankName=addBank
        const newBank={ bankCode,bankName}
           console.log(JSON.stringify(newBank))
        e.preventDefault()
        
        fetch(API_BASE_URL+"/addBank",{
            method:'POST',
            headers:{
                "content-Type": "application/json"
            },
           
            body:   JSON.stringify(newBank)

        })
        .then(response => {
            if (response.json) {
                //window.alert("Code Created Sucessfully")
                window.location.reload()
                navigate("/banks")
                HandleItemClick(bankCode);
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
                            <label>Bank Code</label>
                            <input type='text'onChange={e => setAddBankCode(e.target.value)} />
                        </div>
                        <div className='formitem'>
                            <label>Bank Name</label>
                            <input type='text' onChange={e=>setAddBank(e.target.value)}  />
                        </div>
                        <div className='formitem'>
                            <label></label>
                           <button type='submit' onClick={handleAddBank}>Save</button>
                        </div>

                    </form>
                </div>}
                <table className='table table-hover table-sm table-striped'>
                    <thead>
                        <tr>
                            <th>
                                Bank Code
                            </th>
                            <th>
                                Bank Name
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.bankCode}
                                onClick={() => {
                                    HandleItemClick(item.bankCode)
                                }}>
                                <td>
                                    {item.bankCode}
                                </td>
                                <td>
                                    {item.bankName}
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
                                <th>Branch Code</th>
                                <th>Bank Code</th>
                                <th>Branch Name</th>
                            </tr>
                        </thead>
                        <tbody className='codesection'>
                            {branches.map((branch) => (
                                <tr key={branch.branchCode} onClick={() => {
                                    handleBranchClick(branch.branchCode, branch.bankCode, branch.bankBranch)
                                }}>
                                    <td>{branch.branchCode}</td>
                                    <td>{branch.bankCode}</td>
                                    <td>{branch.bankBranch} </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="addedit">
                        <div className='top'>
                            <div className="header">
                            </div>
                            <div className="action">
                                <ControlPointIcon className='icon add' onClick={() => { handleAddBankButton(selectedBankCode) }} />
                                <BorderColorIcon className='icon edit' onClick={() => { handleCodeEditing(bankCode, branchCode) }} />
                                {disabledDelete && <DoNotDisturbOnIcon className='icon delete' onClick={() => { handleCodeDelete(bankCode, branchCode) }} />}
                            </div>
                        </div>
                        <div className='bottom'>
                            <div className='formholder'>
                                <form>
                                    <div className="setids">
 
                                        <label>Bank Code</label>
                                        <div><input type="text" disabled value={bankCodeLinked} onChange={e => setbankCodeLinked(e.target.value)} /></div>
                                        <label>Branch Code</label>
                                        <div><input type="text" disabled={disabled}  value={branchCode} onChange={e => setBranchCode(e.target.value)} /></div>

                                        <label>Branch name</label>
                                        <input type="text" disabled={disabled} value={bankBranch} required onChange={e => setBankBranch(e.target.value)} />
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

export default BankSetups
