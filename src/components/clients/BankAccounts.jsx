import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import './bankaccount.css'

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../configs/Config';
import { json } from 'react-router-dom';
import { red } from '@mui/material/colors';
const BankAccounts = ({ clientId }) => {
    const [accountNumbers, setAccountNumbers] = useState([])
    const [accountType, setAccountType] = useState("")
    const [accountName, setAccountName] = useState("")
    const [accountNo, setAccountNo] = useState("")
    const [bankBranch, setAccountBankBranch] = useState("")
    const [showAddSection, setShowAddSection] = useState(false)
    const [savedBanks, setSavedBanks] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBranch, setSearchBranch] = useState('');
    const [selectedBank, setSelectedBank] = useState("")
    const [bankBranches, setBankBranches] = useState([]);
    const [clientBankAccounts, setClientBankAccounts] = useState([]);
    const[noBAnkAccounts,setNoBankAccounts]=useState(false)
    const[bankAccountExist,setBankAccountExist]=useState(false)
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {
        fetch(API_BASE_URL + "/getClientBankaccounts/" + clientId)
            .then((response) => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setClientBankAccounts(data);
                    setBankAccountExist(true)


                }
            }).catch((error) => {
                setNoBankAccounts(true)
            });
    }, []);
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
    useEffect(() => {
        fetch(API_BASE_URL + "/getAllbanks")
            .then((response) => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSavedBanks(data);


                }
            }).catch((error) => {
                console.log(error);
            });
    }, []);

    const filteredBanks = Array.isArray(savedBanks)
        ? savedBanks.filter(bank => bank.bankName.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    const filteredBankBranches = Array.isArray(bankBranches)
        ? bankBranches.filter(branch => branch.bankBranch.toLowerCase().includes(searchBranch.toLowerCase()))
        : [];


    const handleBankSelection = (bankCode) => {
        setSelectedBank(bankCode);

        // Fetch the subsidiaries using the selected bankCode
        fetch(API_BASE_URL + "/getAllBranchesByBankcode/" + bankCode)
            .then(response => response.json())
            .then(data => {
                setBankBranches(data);

            })
            .catch(error => {
                console.error('Error fetching subsidiaries:', error);
            });
    };

    const handleAddaccountSection = () => {
        setShowAddSection(true)
        setNoBankAccounts(false)
    }
    const handleSubmitAccount = (e) => {
        e.preventDefault()
        const bankCode = selectedBank
        const newaccount = { clientId, accountNo, accountName, accountType, bankCode, bankBranch }
        fetch(API_BASE_URL + "/addAccountNumber", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newaccount)
        }).then(response => {
            if (response.ok) {
                setShowAddSection(false)
                return response.json()

            }
            else {
                console.log("Error Occurred")
            }
        }).catch(error => {
            console.log(error)
        })



    }

    const handleRowClick = (index) => {
        setSelectedRow(index);
    };
    return (
        <div className='client'>
            <div className='buttoncontainer'>
                <div className='actionholder'> <ControlPointOutlinedIcon className='addAccount' onClick={handleAddaccountSection} />
                </div>
                <div className='actionholder'><EditOutlinedIcon className='editAccount' /></div>
                <div className='actionholder'><RemoveCircleOutlineOutlinedIcon className='deleteAccount' /></div>


            </div>
            <div className='accountDetails'>
            {noBAnkAccounts &&<label className='nobankAccount'>No Bank Account(s) defined for this client</label>}
                {bankAccountExist &&<table className='table table-hover table-sm table-striped'>
                    <thead>
                        <tr>

                            <th>Account Name</th>
                            <th>Account Type</th>
                            <th>Account Number</th>
                            <th>Bank Code</th>
                            <th>Bank Name</th>
                            <th>Branch Code</th>
                            <th> Branch Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientBankAccounts.map((accounts)=>(
                            <tr  key={accounts.id}
                            onClick={() => handleRowClick(accounts.id)}
                            className={selectedRow === accounts.id ? 'table-active' : ''}
                            style={{ cursor: 'pointer' }}>
                            <td>{accounts.accountName}</td>
                            <td>{accounts.accountType}</td>
                            <td>{accounts.accountNo}</td>
                            <td>{accounts.bankCode}</td>
                            <td>{accounts.bankName}</td>
                            <td>{accounts.branchCode}</td>
                            <td>{accounts.bankBranch}</td>

                        </tr>
                        ))}
                    </tbody>
                </table>}


            </div>
            {showAddSection && <div className='AddaccountDetailsFields'>


                <div class="form-group row">
                    <label for="staticEmail" className="col-sm-2 col-form-label">Account Type</label>
                    <div class="col-sm-10">
                        <select className="custom-select custom-select-sm" onChange={
                            e => setAccountType(e.target.value)
                        } >
                            <option value="" selected>---select---</option>
                            {accountNumbers.map(type => (
                                <option value={type.description}>{type.description}</option>
                            ))}
                        </select>

                    </div>
                </div><br></br>
                <div class="form-group row">
                    <label className="col-sm-2 col-form-label">Account Name</label>
                    <div class="col-sm-10">
                        <input type="text" onChange={
                            e => setAccountName(e.target.value)
                        } className="form-control" />
                    </div>
                </div><br></br>
                <div class="form-group row">
                    <label for="staticEmail" className="col-sm-2 col-form-label">Account No</label>
                    <div class="col-sm-10">
                        <input type="text" onChange={
                            e => setAccountNo(e.target.value)
                        } className="form-control" id="staticEmail" />
                    </div>
                </div><br></br>

                <div class="form-group row">
                    <label for="staticEmail" className="col-sm-2 col-form-label">Bank Name</label>
                    <div class="col-sm-10">
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Search bank"
                            value={searchTerm}
                            onChange={e => {
                                setBankBranches([])
                                setSearchTerm(e.target.value)

                            }}
                        />
                        <select className="custom-select custom-select-sm" onChange={
                            e => handleBankSelection(e.target.value)
                        } multiple>
                            <option value="" selected>---select---</option>

                            {filteredBanks.map((banks) => (
                                <option value={banks.bankCode}>{banks.bankName}</option>
                            ))}

                        </select>

                    </div>
                </div><br></br>

                <div class="form-group row">
                    <label for="staticEmail" className="col-sm-2 col-form-label">Bank Branch</label>
                    <div class="col-sm-10">
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Search bank"
                            value={searchBranch}
                            onChange={e => {
                                setSearchBranch(e.target.value)

                            }}
                        />
                        <select className="custom-select custom-select-sm" onChange={
                            e => setAccountBankBranch(e.target.value)
                        } multiple>
                            <option value="" selected>---select---</option>

                            {filteredBankBranches.map((branch) => (
                                <option value={branch.branchCode}>{branch.bankBranch}</option>
                            ))}

                        </select>

                    </div>
                </div><br></br>
                <br></br>
                <div class="form-group row">
                    <button className="btn btn-primary" onClick={handleSubmitAccount}>Submit</button>

                </div><br></br>


            </div>}


        </div>
    )
}



export default BankAccounts
