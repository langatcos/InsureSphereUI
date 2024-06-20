import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './addproductform.scss'
import { API_BASE_URL } from '../../configs/Config';


const AddProduct = () => {
    const [products,setProducts]=useState([])
    const [productId,setNextproductId]=useState(0)
    const[codes,setCodes]=useState([])
    const[productName,setproductName]=useState("")
    const[productBaseCurrency,setBaseCurrency]=useState("")
    const [productTerritory,setTerritory]=useState("")
    const [checkBlanks, setCheckBlanks]=useState(false)
    const navigate=useNavigate()

    useEffect(()=>{
        fetch(API_BASE_URL+"/getAllCodes")
        .then(response=> response.json())
        .then(data=>{
            setCodes(data)
       
        })
    },[])
    useEffect(()=>{

    },[codes])
    
    useEffect(() => {
        fetch(API_BASE_URL + "/getallproducts")
            .then(response => response.json())
            .then(data => {
                setProducts(data)
               // console.log(data)
                
            })
    }, [])
    useEffect(() => {
        const max = Math.max(...products.map(a => a.productId))
                if (isFinite(max)) {
                    setNextproductId(max + 1)
                }
                else{
                    setNextproductId(1)
                }
                

    }, [products],productId)

   // console.log("Max:"+nextproductId)
  
    const handleSubmit = (e) => {
        e.preventDefault()
      //  console.log("This one")
     const newproduct= {productId,productName,productBaseCurrency,productTerritory }
     if(productName !=="" && productName !==null && productBaseCurrency !=="" && productTerritory !==""  ){
        fetch(API_BASE_URL+"/addproducts",{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(newproduct)
         })
         .then(response => {
            if (response.ok) {
                return response.json(); // extract JSON from the response
                //window.alert("Client Created Sucessfully")
                navigate("/products")
            }
            else {
    
                console.log("Error Occurred")
    
            }
        })
     }else{
        setCheckBlanks(true)
     }
    
     
    }
 
    
    return (
        <div className="addproductform">
            <div className="formcontainer">
                <form  onSubmit={handleSubmit}>
                    <div className="formitem">
                        <label>Product Name</label>
                        <input type="text" onChange={e=>setproductName(e.target.value)} />
                    </div>
                    <div className="formitem">
                        <label>Base Currency</label>
                        <select name="basecurrency" className='selectitems' onChange={e=>setBaseCurrency(e.target.value)}>
                            <option value="">--Select--</option>
                            {codes.filter(code => code.codesetLinked === 2)
                            .map(code=>(
                                <option key={code.codId} value={code.codeId}>{code.description}</option>
                            ))
                           
                            }
                        </select>
                    </div>
                    <div className="formitem">
                        <label>
                            Product Territory</label>
                        <select name="productTerritory" className='selectitems' onChange={e=>setTerritory(e.target.value)}>
                            <option value="">--Select--</option>
                            {codes.filter(code => code.codesetLinked === 3)
                            .map(code=>(
                                <option key={code.codeId} value={code.codeId}>{code.description}</option>
                            ))}
                        </select>
                    </div>
                 
                       {checkBlanks &&<span className="errormessage">
                            You Must Capture all the details before Saving
                        </span>} 
                  
                    <div className="submit">
                        <button type="submit">Save</button>
                    </div>

                </form>
            </div>

        </div>
    );
};

export default AddProduct;