
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../configs/Config';
const Relationships =({clientId})=>{
    const [relationships, setRelationships]=useState("")
    useEffect(()=>{
        fetch(API_BASE_URL + "/getRelationships/" + clientId)
        .then(response=>response.json())
        .then((data)=>{
            setRelationships(data)
            

        }).catch(error=>{
            console.log("No Bank Accounts found ",error)
        })

    },[])


    console.log("This is "+clientId)
    return (
        <div className='client'>
            <table className='table table-hover table-sm table-striped'>
                        <thead>
                            <tr>
                                <th>Parent ID</th>
                                <th> Parent Name</th>
                                <th>Dependant ID</th>
                                <th>Dependant Name</th>
                                <th>Relationship</th>
                               
                            </tr>
                        </thead>
                        <tbody>                        
                            {Array.isArray(relationships) && relationships.map((rel)=>(
                            <tr key={rel.childClientId}>
                                <td>{rel.parentClientId}</td>
                                <td>{rel.parentFirstName} {rel.parentSurname}</td>
                                <td>{rel.childClientId}</td>
                                <td>{rel.childFirstName} {rel.childSurname}</td>
                                <td>{rel.relationship}</td>

                            </tr>
                            ))}

                        </tbody>
                        </table>
                      
          
        </div>
      )
}



export default Relationships
