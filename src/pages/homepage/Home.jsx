import React from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import './home.scss'
const Home = () => {
  return (
    <div className='home'>
      <Topbar />
      <div className="homecontainer">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="homecontents">
          Home
        </div>




      </div>

    </div>
  )
}

export default Home
