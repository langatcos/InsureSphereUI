import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import './bankaccount.css'

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../configs/Config';
const BankAccounts = ({ clientId }) => {
const [accountNumbers, setAccountNumbers]=useState([])
const [accountType, setAccountType]=useState("")
const [accountName, setAccountName]=useState("")
const [accountNo, setAccountNo]=useState("")
const [bankBranch,setAccountBankBranch]=useState("")
const [showAddSection,setShowAddSection]=useState(false)
useEffect(() => {
    fetch(API_BASE_URL + "/getCodesByCodesetId/18")
        .then((response) => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                setAccountNumbers(data);
                
            }
        }).catch((error) => {
            console.log(error);
        });
}, []);
const handleAddaccountSection=()=>{
    setShowAddSection(true)
}
 const handleSubmitAccount=(e)=>{
    e.preventDefault()
    const newaccount={clientId,accountNo,accountName,accountType,bankBranch}
    fetch(API_BASE_URL + "/addAccountNumber",{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(newaccount)
    }).then(response=>{
        if(response.ok){
            setShowAddSection(false)
            return response.json()
            
        }
        else{
            console.log("Error Occurred")
        }
    }).catch(error=>{
        console.log(error)
    })
    


 }

    return (
        <div className='client'>
            <div className='buttoncontainer'>
                <div className='actionholder'> <ControlPointOutlinedIcon className='addAccount' onClick={handleAddaccountSection} />
                </div>
                <div className='actionholder'><EditOutlinedIcon className='editAccount' /></div>
                <div className='actionholder'><RemoveCircleOutlineOutlinedIcon className='deleteAccount' /></div>
                
               
            </div>
            {showAddSection &&<div className='AddaccountDetailsFields'>


                <div class="form-group row">
                    <label for="staticEmail" className="col-sm-2 col-form-label">Account Type</label>
                    <div class="col-sm-10">
                        <select className="custom-select custom-select-sm" onChange={
                            e=>setAccountType(e.target.value)
                            }>
                            <option value="" selected>---select---</option>
                            {accountNumbers.map(type=>(
                            <option value={type.codeId}>{type.description}</option>
                            ))}
                        </select>
                       
                    </div>
                </div><br></br>
                <div class="form-group row">
                    <label  className="col-sm-2 col-form-label">Account Name</label>
                    <div class="col-sm-10">
                        <input type="text" onChange={
                            e=>setAccountName(e.target.value)
                            } className="form-control" />
                    </div>
                </div><br></br>
                <div class="form-group row">
                    <label for="staticEmail" className="col-sm-2 col-form-label">Account No</label>
                    <div class="col-sm-10">
                        <input type="text" onChange={
                            e=>setAccountNo(e.target.value)
                            } className="form-control" id="staticEmail" />
                    </div>
                </div><br></br>
                <div class="form-group row">
                    <label for="staticEmail" className="col-sm-2 col-form-label">Bank Branch</label>
                    <div class="col-sm-10">
                        <select className="custom-select custom-select-sm" onChange={
                            e=>setAccountBankBranch(e.target.value)
                            }>
                            <option value="" selected>---select---</option>
                           
                            <option value="1">Bank 1</option>
                            <option value="2">Bank 2</option>
                            <option value="3">Bank 3</option>
                        </select>
                       
                    </div>
                </div><br></br>
                <div class="form-group row">
                    <button className="btn btn-primary"onClick={handleSubmitAccount}>Submit</button>

                </div><br></br>
                

            </div>}


        </div>
    )
}



export default BankAccounts
