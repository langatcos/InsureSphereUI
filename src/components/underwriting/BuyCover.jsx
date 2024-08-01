import React, { useEffect, useState } from "react";
import { API_BASE_URL } from '../../configs/Config';
import { BeenhereRounded } from "@mui/icons-material";
const BuyCover = () => {
    const [products, setProducts] = useState("")
    const [productBenefits, setProductBenefits] = useState("")
    const [availablebenefits, setAvailablebenefits] = useState(false)
    const [selectedBenefits, setSelectedBenefits] = useState([]);

    useEffect(() => {
        fetch(API_BASE_URL + "/getallproducts")
            .then(response => response.json())
            .then(data => {

                if (Array.isArray(data)) {
                    setProducts(data);
                }
                // console.log(data)
            })

    }, [])
    const handleSelectBenefitDetails = (productId) => {
        fetch(API_BASE_URL + "/getdistinctproductbenefits/" + productId)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProductBenefits(data);

                    
                    setAvailablebenefits(true)
                }

            })
            .catch(error => {
                console.log("" + error)
                setAvailablebenefits(false)
            })

    }
    const handleBenefitSelection = (benefitId) => {
        console.log("Benefit Id:" + benefitId)
    }
    const handleCheckboxChange = (benefitId) => {
        const newSelectedBenefits = selectedBenefits.includes(benefitId)
          ? selectedBenefits.filter(id => id !== benefitId)
          : [...selectedBenefits, benefitId];
    
        setSelectedBenefits(newSelectedBenefits);
      };
    

    return (
        <div>
            <form>
                <div className="form-group">
                    <label >Product Name</label>
                    <select className="form-control" onChange={e => handleSelectBenefitDetails(e.target.value)} >
                        <option value="">---Select---</option>
                        {Array.isArray(products) && products.map(product => (
                            <option key={product.productId} value={product.productId}>{product.productName}</option>
                        ))}

                    </select>
                    {availablebenefits && <div className="benefits">
                        <label >Benefits</label>
                        <div className="benefits-list">
                            {Array.isArray(productBenefits) && productBenefits.map(ben => (
                                <div key={ben.benefitId} className="benefit-item">
                                    <input
                                        type="checkbox"
                                        id={`benefit-${ben.benefitId}`}
                                        checked={selectedBenefits.includes(ben.benefitId)}
                                        onChange={() => handleCheckboxChange(ben.benefitId)}
                                    />
                                    <label htmlFor={`benefit-${ben.benefitId}`}>{ben.benefitName}</label>
                                </div>
                            ))}
                        </div>

                    </div>}
                </div>

            </form>

        </div>


    )

}
export default BuyCover