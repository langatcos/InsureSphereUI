import React from 'react'
import Topbar from '../../components/Topbar'
import Sidebar from '../../components/Sidebar'
import './underwriting.scss'
const Underwriting = () => {
  return (
    <div className='underwriting'>
       <Topbar />
      <div className="uwcontainer">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="uwcontents">
          Underwriting
        </div>




      </div>
    </div>
  )
}

export default Underwriting
