import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../../configs/Config';
import './searchClient.scss'
import '../../css/bootstrap/dist/css/bootstrap.min.css'

import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import SearchIcon from '@mui/icons-material/Search';
const SearchClients = () => {
    const [searchvalue, setSearchValue] = useState("")
    const [searchresult, SetSearchResult] = useState([])
    const [noresults, setNoResults] = useState(false)
    const [searchexist, setSearchExist] = useState(false)
    const [companyexist, setCompanyExist] = useState(false)
    const [error, setError] = useState(false)
    const [clientrole, setClientRole] = useState([])

    const handleSearch = (e) => {
        e.preventDefault()

        fetch(API_BASE_URL+"/getclientbyid/" + searchvalue)

            .then((response) => response.json())
            .then(data => {
                SetSearchResult(data)

                const clientid = data[0].id
                const clienttype = data[0].clientType

                //console.log("this"+ clientid)
                //console.log(data)
                if (clientid != null) {
                    if (clienttype === 1) {
                        setSearchExist(true)
                        setCompanyExist(false)

                    } else {
                        setSearchExist(false)
                        setCompanyExist(true)
                    }
                    setNoResults(false)

                }
                else {
                    setNoResults(false)
                    setCompanyExist(false)
                    setSearchExist(false)
                }

            })
            .catch(error => {
                setNoResults(true)

                setSearchExist(false)
                setCompanyExist(false)


            })



    }
    useEffect(() => {
        //console.log(searchresult)

    }, [searchresult])
    const handleViewDetails = (clientid) => {
       
    fetch(API_BASE_URL+"/getclientroles/"+clientid)
    .then((response)=>response.json())
    .then(data=>{
        setClientRole(data)
    })


    }
    useEffect(()=>{

    },[clientrole])

    //console.log(clientrole)

    return (
        <div className='searchClients'>
            Search client by ClientNo
            <div className="formcontainer">
                <form onSubmit={handleSearch}>
                    <div className="search">
                        <input type='text' placeholder='Search ...' onChange={(e) => setSearchValue(e.target.value)} />
                        <SearchIcon className='icon' onClick={handleSearch} />
                    </div>
                    <div className="searchresults">
                        {searchexist && <table className='table table-hover table-sm table-striped'>
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
                                            <button onClick={() => {
                                                handleViewDetails(item.clientid)

                                            }}>view Details</button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>}

                        {companyexist && <table className='table table-hover table-sm table-striped'>
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
                                            <button onClick={() => {
                                                handleViewDetails(item.clientid)
                                            }}>view Details</button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>}
                    </div>
                    {noresults && <div className="noresults">No Results found for value entered</div>}

                    {error && <div className="error">Error Occurred, Contact your system administrator</div>}
                </form>
            </div>
        </div>
    )
}

export default SearchClients
