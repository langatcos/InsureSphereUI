import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import './bankaccount.css';
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../configs/Config';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const BankAccounts = ({ clientId }) => {
    const [accountNumbers, setAccountNumbers] = useState([]);
    const [accountType, setAccountType] = useState("");
    const [accountName, setAccountName] = useState("");
    const [accountNo, setAccountNo] = useState("");
    const [bankBranch, setAccountBankBranch] = useState("");
    const [showAddSection, setShowAddSection] = useState(false);
    const [savedBanks, setSavedBanks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBranch, setSearchBranch] = useState('');
    const [selectedBank, setSelectedBank] = useState("");
    const [bankBranches, setBankBranches] = useState([]);
    const [clientBankAccounts, setClientBankAccounts] = useState([]);
    const [noBAnkAccounts, setNoBankAccounts] = useState(false);
    const [bankAccountExist, setBankAccountExist] = useState(false);
    const [showEditButton, setShowEditButton] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [accountId, setAccountId] = useState("");
    const [accountClientId, setAccountClientId] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        fetch(API_BASE_URL + "/getClientBankaccounts/" + clientId)
            .then((response) => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setClientBankAccounts(data);
                    setBankAccountExist(true);
                }
            }).catch((error) => {
                setNoBankAccounts(true);
            });
    }, [clientId]);

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
        fetch(API_BASE_URL + "/getAllBranchesByBankcode/" + bankCode)
            .then(response => response.json())
            .then(data => {
                setBankBranches(data);
                console.log(data)
            })
            .catch(error => {
                console.error('Error fetching subsidiaries:', error);
            });
    };

    const handleAddAccountSection = () => {
        setShowAddSection(true);
        setNoBankAccounts(false);
    };

    const handleSubmitAccount = (e) => {
        e.preventDefault();
        const bankCode = selectedBank;
        const newAccount = { clientId, accountNo, accountName, accountType, bankCode, bankBranch };
        fetch(API_BASE_URL + "/addAccountNumber", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAccount)
        }).then(response => {
            if (response.ok) {
                setShowAddSection(false);
                return response.json();
            } else {
                console.log("Error occurred");
            }
        }).catch(error => {
            console.log(error);
        });
    };

    const handleRowClick = (id, accountClientId) => {
        setSelectedRow(id);
        setAccountClientId(accountClientId);
        setAccountId(id);
        setShowEditButton(true);
        setShowDeleteButton(true);
    };

    const handleEditAccount = (e) => {
        const accountToEdit = clientBankAccounts.find(account => account.id === selectedRow);
        if (accountToEdit) {
            setAccountType(accountToEdit.accountType);
            setAccountName(accountToEdit.accountName);
            setAccountNo(accountToEdit.accountNo);
            setSelectedBank(accountToEdit.bankCode);
            setAccountBankBranch(accountToEdit.bankBranch);
            setEditModalOpen(true);
        }
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const updatedAccount = { clientId, accountNo, accountName, accountType, bankCode: selectedBank, bankBranch };
        console.log(JSON.stringify(updatedAccount))
        fetch(API_BASE_URL + "/updateBankAccount/" + clientId + "/" + accountId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedAccount)
        }).then(response => {
            if (response.ok) {
                setEditModalOpen(false);
                return response.json();
            } else {
                console.log("Error occurred");
            }
        }).catch(error => {
            console.log(error);
        });
    };
    useEffect(() => {
        if (clientBankAccounts.length > 0) {
            setAccountBankBranch(clientBankAccounts[0].bankBranch); // Adjust as needed to get the correct bank branch
        }
    }, [clientBankAccounts]);
    return (
        <div className='client'>
            <div className='buttoncontainer'>
                <div className='actionholder'>
                    <ControlPointOutlinedIcon className='addAccount' onClick={handleAddAccountSection} />
                </div>
                {showEditButton && <div className='actionholder'><EditOutlinedIcon className='editAccount' onClick={handleEditAccount} /></div>}
                {showDeleteButton && <div className='actionholder'><RemoveCircleOutlineOutlinedIcon className='deleteAccount' /></div>}
            </div>
            <div className='accountDetails'>
                {noBAnkAccounts && <label className='nobankAccount'>No Bank Account(s) defined for this client</label>}
                {bankAccountExist && (
                    <table className='table table-hover table-sm table-striped'>
                        <thead>
                            <tr>
                                <th>Account Name</th>
                                <th>Account Type</th>
                                <th>Account Number</th>
                                <th>Bank Code</th>
                                <th>Bank Name</th>
                                <th>Branch Code</th>
                                <th>Branch Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientBankAccounts.map((accounts) => (
                                <tr
                                    key={accounts.id}
                                    onClick={() => handleRowClick(accounts.id, accounts.clientId)}
                                    className={selectedRow === accounts.id ? 'table-active-custom' : ''}
                                    style={{ cursor: 'pointer' }}
                                >
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
                    </table>
                )}
            </div>
            {showAddSection && (
                <div className='AddaccountDetailsFields'>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Account Type</label>
                        <div className="col-sm-10">
                            <select
                                className="custom-select custom-select-sm"
                                onChange={e => setAccountType(e.target.value)}
                            >
                                <option value="" selected>---select---</option>
                                {accountNumbers.map(type => (
                                    <option key={type.id} value={type.description}>{type.description}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <br />
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Account Name</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                onChange={e => setAccountName(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <br />
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Account No</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                onChange={e => setAccountNo(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <br />
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Bank Name</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Search bank"
                                value={searchTerm}
                                onChange={e => {
                                    setBankBranches([]);
                                    setSearchTerm(e.target.value);
                                }}
                            />
                            <select
                                className="custom-select custom-select-sm"
                                onChange={e => handleBankSelection(e.target.value)}
                                multiple
                            >
                                <option value="" selected>---select---</option>
                                {filteredBanks.map((banks) => (
                                    <option key={banks.bankCode} value={banks.bankCode}>{banks.bankName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <br />
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Bank Branch</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Search branch"
                                value={searchBranch}
                                onChange={e => {
                                    setSearchBranch(e.target.value);
                                }}
                            />
                            <select
                                className="custom-select custom-select-sm"
                                onChange={e => setAccountBankBranch(e.target.value)}
                                multiple
                            >
                                <option value="" selected>---select---</option>
                                {filteredBankBranches.map((branch) => (
                                    <option key={branch.branchCode} value={branch.branchCode}>{branch.bankBranch}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className="form-group row">
                        <button className="btn btn-primary" onClick={handleSubmitAccount}>Submit</button>
                    </div>
                    <br />
                </div>
            )}

            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <DialogTitle>Edit Bank Account</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Account Type</InputLabel>
                        <Select
                            value={accountType}
                            onChange={e => setAccountType(e.target.value)}
                        >
                            {accountNumbers.map(type => (
                                <MenuItem key={type.id} value={type.description}>{type.description}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Account Name"
                        type="text"
                        fullWidth
                        value={accountName}
                        onChange={e => setAccountName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Account Number"
                        type="text"
                        fullWidth
                        value={accountNo}
                        onChange={e => setAccountNo(e.target.value)}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Bank Code</InputLabel>
                        <Select
                            value={selectedBank || ''}
                            onChange={e => handleBankSelection(e.target.value)}
                        >
                            {savedBanks.length > 0 ? (
                                savedBanks.map(bank => (
                                    <MenuItem key={bank.bankCode} value={bank.bankCode}>
                                        {bank.bankName}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="" disabled>
                                    No banks available
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Bank Branch</InputLabel>
                        <Select
                            value={bankBranch || ''}
                            onChange={e => setAccountBankBranch(e.target.value)}
                        >
                            {bankBranches.length > 0 ? (
                                bankBranches.map(branch => (
                                    <MenuItem key={branch.branchCode} value={branch.branchCode}>
                                        {branch.bankBranch}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="" disabled>
                                    No branches available
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditModalOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BankAccounts;
