import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
import './List.css'
import { MdOutlineCancel } from "react-icons/md";

const List = () => {
    
    const url = 'https://flashfeast-backend.vercel.app';

    const [list, setlist] = useState([])

    const fetchList = async () => {
        const response = await axios.get(`${url}/api/product/list`);
        
        if (response.data.success) {
            setlist(response.data.data)
            toast.success(response.data.message)
        } else {
            toast.error(response.data.message)
        }
    }

    const removeProduct = async (productId) => {
        const response = await axios.post(`${url}/api/product/remove, { id: productId }`);  
        await fetchList(); 
        if (response.data.success) {
            toast.success(response.data.message)
        } else {
            toast.error(response.data.message)
        }
    }

    useEffect(() => {
        fetchList();
    }, [])

    return (
        <div className='list'>
            <h2 className='list-heading'>All Products List</h2>
            <div className='list-table'>
                <div className="list-table-format title">
                    <b>S No.</b>
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Quantity</b>
                    <b>Price</b>
                    <b>Remove</b>
                </div>
                {list.map((item, index) => (
                    <div key={index} className='list-table-format'>
                        <p>{index + 1}</p>
                        <img src={item.image} alt='' />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>{item.quantity}</p>
                        <p>{item.price}</p>
                        <p onClick={() => removeProduct(item._id)}><MdOutlineCancel className='remove' /></p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default List;