import React, { useState } from 'react'
import './clientmanagement.scss'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import Addclient from '../../components/clients/Addclient';
import SearchIcon from '@mui/icons-material/Search';
import SearchClients from '../../components/clients/SearchClients';
const ClienManagement = () => {
  const [addclient, setAddClient] = useState(false)
  const [searchclient, setSearchClient] = useState(true)

  const handleclickSearch = () => {
    setSearchClient(true)
    setAddClient(false)
  }
  const handleclickAdd = () => {
    setAddClient(true)
    setSearchClient(false)

  }
  return (
    <div className='clientmanagement'>
      <div className="topmenu">
        <div className="menuitem">
          <SearchIcon className='icon search' onClick={handleclickSearch} />
          <label>Search Client</label>
        </div>
        <div className="menuitem" onClick={handleclickAdd}>
          <PersonAddIcon className='icon add' />
          <label>Add Client</label>
        </div>
        <div className="menuitem">
          <PersonAddDisabledIcon className='icon delete' />
          <label>Delete</label>
        </div>

      </div>
      <div className="contents">
        {addclient && <Addclient />}
        {searchclient && <SearchClients />}

      </div>
    </div>
  )
}

export default ClienManagement
