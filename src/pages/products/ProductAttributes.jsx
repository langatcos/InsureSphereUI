import React, { useEffect, useState } from 'react';
import './productattributes.scss'
import '../../css/bootstrap/dist/css/bootstrap.min.css'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ReactDOM from 'react-dom';
import AddProduct from './AddProduct';
import { API_BASE_URL } from '../../configs/Config';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { set } from 'date-fns';
const ProductAttributes = () => {

    const [showdiv, setShowDiv] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null);

    const [expandedItemId, setExpandedItemId] = useState(null);
    const [expandBenefit, setExpandBenefit] = useState(false)
    const [expandSubBenefit, setExpandSubBenefit] = useState(false)
    const [expandedparentId, setExpandedparentId] = useState(null)
    const [expandedproductId, setExpandedproductId] = useState(null)
    const [expandedbenefitId, setExpandedbenefitId] = useState(null)
    const [expandedSubparentId, setExpandedSubparentId] = useState(null)
    const [expandedSubproductId, setExpandedSubproductId] = useState(null)
    const [expandedSubbenefitId, setExpandedSubbenefitId] = useState(null)
    const [addProduct, setAddProduct] = useState(false);
    const [products, setProducts] = useState([])
    const [parentId, setparentId] = useState("")
    const [productId, setproductId] = useState("")
    const [addBenefits, setAddBenefits] = useState(false)
    const [benefits, setBenefits] = useState(false)
    const [productName, setproductName] = useState("")
    const [benefitDescription, setbenefitDescription] = useState("")
    const [benefitAttributeType, setbenefitAttributeType] = useState("")
    const [clickedType, setClickedType] = useState("")
    const [codes, setCodes] = useState([])
    const [allFields, setAllFields] = useState([])
    const [benefitAttributes, setBenefitAttribute] = useState([])
    const [benefitAttributesfields, setBenefitAttributeFields] = useState(false)
    const [productBenefitFieldsdata, setProductBenefitFieldsData] = useState([])
    const [allBenefitFieldsAttr, setAllBenFieldsAttributesAttr] = useState([])
    const [inputValue, setInputValue] = useState({})
    const [inputValue2, setInputValue2] = useState({})


    useEffect(() => {
        fetch(API_BASE_URL + "/getallfields")
            .then(response => response.json())
            .then((data) => {
                setAllFields(data)
                //console.log(data)

            })

    }, [])

    useEffect(() => {
        fetch(API_BASE_URL + "/getAllBenFieldsAttributes")
            .then(response => response.json())
            .then((data) => {
                setAllBenFieldsAttributesAttr(data)
                console.log(data)

            })
    }, [])
    useEffect(() => {
        fetch(API_BASE_URL + "/getallbenefits")
            .then(response => response.json())
            .then(data => {
                setBenefits(data)
                //console.log(data)
            })
    }, [])
    useEffect(() => {
        fetch(API_BASE_URL + "/getallbenefiattributes")
            .then(response => response.json())
            .then((data) => {
                setBenefitAttribute(data)
            })
    }, [])
    useEffect(() => {

    }, [benefits], [allFields], [benefitAttributes], [allBenefitFieldsAttr])
    //console.log(allBenefitFieldsAttr)
    useEffect(() => {
        fetch(API_BASE_URL + "/getAllCodes")
            .then(response => response.json())
            .then(data => {
                setCodes(data)
            })
    }, [])
    useEffect(() => {

    }, [codes])
    useEffect(() => {
        fetch(API_BASE_URL + "/getallproducts")
            .then(response => response.json())
            .then(data => {
                setProducts(data)
                
            })
    }, [])
    useEffect(() => {

    }, [products])

    const openAddProduct = () => {
        setAddProduct(true)
        setAddBenefits(false)
        setBenefitAttributeFields(false)

    }
    const handleItemClick = (itemId) => {
        if (itemId === expandedItemId) {
            setAddProduct(false)
            setExpandedItemId(null);
            setShowDiv(false)
            setSelectedItem(itemId);
            setAddBenefits(false)
            setparentId("")
            setbenefitAttributeType("Benefit")
            setBenefitAttributeFields(false)



        } else {
            setExpandedItemId(itemId);
            setbenefitAttributeType("Benefit")
            setShowDiv(true)
            setSelectedItem(itemId);
            setAddProduct(false)
            setAddBenefits(false)

        }
    };
    const handleAddBenefitsIcon = () => {
        setBenefitAttributeFields(false)
        setAddProduct(false)
        if (parentId) {
            
            setAddBenefits(true)

        } else {
            window.alert("Select The Product to add Benefits")
        }
    }
    const handleAddBenefit = (e) => {
        e.preventDefault()
        const newbenefit = {
            parentId, benefitDescription, benefitAttributeType, productId
        }
        fetch(API_BASE_URL + "/addbenefits", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newbenefit)
        })
            .then(response => {
                if (response.ok) {
                    setAddBenefits(false)
                    fetch(API_BASE_URL + "/getallbenefits")
                        .then(response => response.json())
                        .then(data => {
                            setBenefits(data)
                            const expandedItemId = localStorage.getItem('expandedItemId')
                            if (expandedItemId) {
                                // Find the expanded item in the newly fetched data
                                const expandedItem = data.find(item => item.benefitId === expandedItemId)
                                if (expandedItem) {

                                    // Expand the item
                                    handleBenefitClick(expandedItem.benefitId, expandedItem.parentId, expandedItem.productId)
                                }
                            }
                        })




                    // console.log(expandedbenefitId + " -" + expandedparentId + "- " + expandedproductId)
                    //  handleBenefitClick(expandedbenefitId, expandedparentId, expandedproductId)



                }
                else {
                    console.log("Error Occured")
                }
            })
    }
    const handleBenefitClick = (benefitItemId, parentId, productId) => {
        setbenefitAttributeType("Sub Benefit")
        setClickedType("Benefit")
        setBenefitAttributeFields(true)
        setAddProduct(false)
        if (parentId === expandedparentId && productId === expandedproductId && benefitItemId === expandedbenefitId) {
            setExpandBenefit(prevState => !prevState);
            // console.log("Lol")
            // console.log("This:"+benefitId+" well :"+parentId+" and productId:"+productId)
            // console.log("This:" + expandedbenefitId + " well :" + expandedparentId + " and productId:" + expandedproductId)

            setAddBenefits(false)
            setAddProduct(false)
            setparentId(benefitItemId)
            setproductId(productId)

            //setAddBenefits(false)
        }
        else {


            setExpandBenefit(true);
            setExpandedbenefitId(null)
            //setAddBenefits(false)
            setparentId(benefitItemId)
            setproductId(productId)
        }
    }

    const handleSubBenefitClick = (benefitItemId, parentId, productId) => {
        setbenefitAttributeType("Core Line")
        setClickedType("Sub Benefit")
        setBenefitAttributeFields(true)
        setAddProduct(false)
        
        if (parentId === expandedSubparentId && productId === expandedSubproductId && benefitItemId === expandedSubbenefitId) {
            setExpandSubBenefit(prevState => !prevState);
            setproductId(productId)


            // console.log("Lol")
            // console.log("This:"+benefitId+" well :"+parentId+" and productId:"+productId)
            //console.log("This:" + expandedbenefitId + " well :" + expandedparentId + " and productId:" + expandedproductId)
        }
        else {
            setbenefitAttributeType("Core Line")
            setAddBenefits(false)
            setparentId(benefitItemId)
            
            setExpandSubBenefit(true);
            setExpandedSubbenefitId(null)
        }

    }
    const handleProductBenefitFields = (e, type) => {
        const { name, value } = e.target;
        setProductBenefitFieldsData(roleFieldsData => ({
            ...roleFieldsData,
            [type]: {
                ...roleFieldsData[type],
                [name]: value,
            }

        }));
        //setProductBenefitFieldsData(updatedFormFields)
        //console.log(productBenefitFieldsdata)
    }
    const handleCoreClick = (id) => {
        ////setbenefitAttributeType("Core Line")
        //setClickedType("Sub Benefit")
        //setBenefitAttributeFields(true)
       // setparentId(id)
       // console.log("ID "+id)
       // console.log("parentId: "+parentId)
        
       // setAddProduct(false)
        //setClickedType("Core Line")
        //setBenefitAttributeFields(true)
        // console.log("parentId : " + parentId)
    }
    useEffect(() => {
       // console.log("parentId: " + parentId);
      }, [parentId]);
    



    allBenefitFieldsAttr.filter((field) => field.type === clickedType && field.benefitId === parentId)
        .forEach((field) => {
            inputValue[field.infoid] = field.value || "";
        });
    //  setInputValue(initialValues);

 
    const mergedArray = { ...inputValue, ...inputValue2, benefitId:parentId };
   
   

    const benefitFieldValues = Object.entries(mergedArray).map(([key, value]) => {
        if (key === "benefitId") {
          return null; // skip the 'benefitId' key
        }
        return {
          id: 0,
          benefitId: mergedArray.benefitId,
          infoid: parseInt(key),
          value: value
        };
      }).filter(Boolean);
      
      console.log(benefitFieldValues);
      
      const handleApplyAttributes = (e) => {
        e.preventDefault()
        fetch(API_BASE_URL+"/addBenefitFieldsInfo",{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'

            },
            body:JSON.stringify(benefitFieldValues)
           
        })

        .then(response => {
            if (response.ok) {
                setBenefitAttributeFields(false)
                setAllBenFieldsAttributesAttr([])

                fetch(API_BASE_URL + "/getAllBenFieldsAttributes")
                .then(response => response.json())
                .then((data) => {
                    setAllBenFieldsAttributesAttr(data)
                    //console.log(data)
                })

                const expandedItemId = localStorage.getItem('expandedItemId')
                        if (expandedItemId) {
                            // Find the expanded item in the newly fetched data
                            
                             // Expand the item
                            // handleBenefitClick(expandedItem.benefitId, expandedItem.parentId, expandedItem.productId)

                            
                        }
                    
                }})

    }

    return (
        <div className="attributeContainer">

            <div className="leftside">
                <div className="loc" >
                    <div onClick={openAddProduct}><AddCircleOutlineIcon className='icon' /> Add Product</div>
                    <div onClick={handleAddBenefitsIcon}><AddCircleOutlineIcon className='icon' />New</div>
                </div>
                <ul className="list-group list-group-flush">
                    {products.map((item) => (
                        <li className="list-group-item list-group-item-action" key={item.productId}>

                            <div className="item">
                                <div className='benefit'>
                                    <h3 onClick={() => {
                                        handleItemClick(item.productId)
                                        setparentId(item.productId)
                                        setproductId(item.productId)
                                        setproductName(item.productName)
                                    }}>
                                        <button onClick={() => setExpandedItemId(item.productId)}>
                                            {expandedItemId === item.productId ? '-' : '+'}
                                        </button>

                                        {item.productName}
                                    </h3>


                                    {expandedItemId === item.productId && <div className='description'>
                                        <ul className="list-group list-group-flush">
                                            <div className='header'> Benefits </div>
                                            {benefits.filter(benefit => benefit.parentId === item.productId && benefit.benefitAttributeType === "Benefit")
                                                .map(benefit => (
                                                    <li className="list-group-item list-group-item-action hover " key={benefit.benefitId}>
                                                        <div onClick={() => {
                                                            handleBenefitClick(benefit.benefitId, benefit.parentId, benefit.productId)
                                                            setExpandedbenefitId(benefit.benefitId)
                                                            setExpandedparentId(benefit.parentId)
                                                            setExpandedproductId(benefit.productId)
                                                        }}>
                                                            <button onClick={() => setExpandedbenefitId(expandedbenefitId === benefit.benefitId ? null : benefit.benefitId)}>
                                                                {expandedbenefitId === benefit.benefitId ? '-' : '+'}
                                                            </button>
                                                            {benefit.benefitDescription}
                                                        </div>
                                                        {expandBenefit && expandedbenefitId === benefit.benefitId && <div className='subbenefits'>
                                                            <ul className="list-group list-group-flush">
                                                                <div className='header'> Sub Benefits </div>
                                                                {benefits.filter(subbenefit => subbenefit.parentId === benefit.benefitId && subbenefit.productId === benefit.productId && subbenefit.benefitAttributeType === "Sub Benefit")
                                                                    .map(subbenefit => (
                                                                        <li className="list-group-item list-group-item-action hover" key={subbenefit.benefitId}>
                                                                            <div onClick={() => {
                                                                                handleSubBenefitClick(subbenefit.benefitId, subbenefit.parentId, subbenefit.productId)
                                                                                setExpandedSubbenefitId(subbenefit.benefitId)
                                                                                setExpandedSubparentId(subbenefit.parentId)
                                                                                setExpandedSubproductId(subbenefit.productId)
                                                                            }}>
                                                                                <button onClick={() => setExpandedSubbenefitId(expandedSubbenefitId === subbenefit.benefitId ? null : subbenefit.benefitId)}>
                                                                                    {expandedSubbenefitId === subbenefit.benefitId ? '-' : '+'}
                                                                                </button>

                                                                                {subbenefit.benefitDescription}
                                                                            </div>

                                                                            {expandSubBenefit && expandedSubbenefitId === subbenefit.benefitId && <div>
                                                                                <ul className="list-group list-group-flush">
                                                                                    <div className='header'> Core Lines </div>
                                                                                    {benefits.filter(core => core.parentId === subbenefit.benefitId && core.productId === subbenefit.productId && core.benefitAttributeType === "Core Line")
                                                                                        .map(core => (
                                                                                            <li key={core.benefitId} className="list-group-item list-group-item-action hover" onClick={() => {
                                                                                                handleCoreClick(core.benefitId)
                                                                                                setparentId(core.benefitId)                                                
                              
                                                                                            }}>

                                                                                                {core.benefitDescription}

                                                                                            </li>
                                                                                        ))}

                                                                                </ul>

                                                                            </div>}

                                                                        </li>

                                                                    ))}
                                                            </ul>
                                                        </div>}

                                                    </li>
                                                ))}
                                        </ul>


                                    </div>}

                                </div>


                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="rightside">
                {addProduct && <div className="add_product">
                    <div className="modal-content">
                        <AddProduct />
                    </div>
                </div>}
                {addBenefits && <div className="add_benefit">
                    <p>Adding Benefits to {productName}</p>
                    {productId}  {parentId}
                    <form>
                        <div className='formitem'>
                            <label >Name</label>
                            <input type='text' onChange={e => setbenefitDescription(e.target.value)} />
                        </div>
                        <div className='formitem'>
                            <label >Type</label>
                            <select name="type" value={benefitAttributeType} className='selectitem' onChange={e => setbenefitAttributeType(e.target.value)}>

                                <option value={benefitAttributeType}>{benefitAttributeType}</option>

                            </select>
                        </div>
                        <div className='formitem'>
                            <button type='submit' onClick={handleAddBenefit} >
                                save
                            </button>
                        </div>
                    </form>

                </div>}

                {benefitAttributesfields && <div className="itemscontainer">
                    {clickedType}


                    <form>
                        {allBenefitFieldsAttr.filter(field => field.type === clickedType )
                            .map(field => (

                                <div className="selectedrole" key={field.infoId}>
                                    <div className='formitem'>
                                        <div className='itemlabel'>
                                            <label key={field.infoId}>{field.description}: </label>
                                        </div>

                                        <div className='iteminput'>
                                            {field.inputControl === "text" && (

                                                <input
                                                    type='text'
                                                    defaultValue={field.value || "" }
                                                    readOnly={false}
                                                    onChange={(e) => {
                                                        setInputValue2( { ...inputValue2, [field.infoId]: e.target.value });
                                                    }}
                                                />


                                            )}







                                            {field.inputControl === 'select' && (
                                                <select name={field.infoId}
                                                    defaultValue={field.value || ""}
                                                    onChange={(e) => {
                                                        setInputValue2( { ...inputValue2, [field.infoId]: e.target.value });                                                    }}                                              >
                                                    <option value=" ">---select---</option>

                                                    {codes.filter(code => code.codesetLinked === field.codesetLinked)
                                                        .map(code => (
                                                            <option key={code.codeId} value={code.description}>{code.description}</option>
                                                        ))
                                                    }
                                                </select>
                                            )}
                                            {field.inputControl === 'checkbox' && (
                                                <input type="checkbox"
                                                    defaultValue={field.value || ""}
                                                    name={field.infoid} className='checkbox'
                                                    onChange={(e) => {
                                                        setInputValue2( { ...inputValue2, [field.infoId]: e.target.value });                                                    }}
                                                />
                                            )}
                                            {field.inputControl === 'radio' && (
                                                <input type="radio"
                                                    defaultValue={field.value || ""}
                                                    name={field.infoid}
                                                    onChange={(e) => {
                                                        setInputValue2({ ...inputValue, [field.infoId]: e.target.value });
                                                    }}
                                                />
                                            )}
                                        </div>

                                    </div>




                                </div>

                            ))}

                        <div className='actionContainer'>
                            <div></div>
                            <button type='submit' onClick={handleApplyAttributes}>Apply Changes</button>
                            <div></div>
                        </div>







                    </form>


                </div>}


            </div>


        </div>

    );
};

export default ProductAttributes;