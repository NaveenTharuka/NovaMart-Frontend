import { useEffect, useState } from 'react';
import { addProduct } from '@/api/product.api';
import './AddProduct.module.css';
import { fetchCategories } from '@/api/category.api';

function AddProduct() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {

        const data = fetchCategories();
        setCategories(data);

    }, []);

    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        category: '' // category name as string
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        addProduct(product);
        alert("Product added successfully!");

        // Reset form
        setProduct({
            name: '',
            description: '',
            price: '',
            quantity: 0,
            category: ''
        });

    }

    return (
        <>
            <div>
                <h1 className='add-product-title'>Add New Product</h1>
            </div>

            <div className='flex justify-center'>
                <div className='detail-container'>
                    <form onSubmit={handleSubmit}>
                        <h1>Product Name</h1>
                        <input
                            type='text'
                            placeholder='Enter product name'
                            name='name'
                            value={product.name}
                            onChange={handleChange}
                            required
                        /><br /><br />

                        <h1>Product Description</h1>
                        <textarea
                            placeholder='Enter product description'
                            name='description'
                            value={product.description}
                            onChange={handleChange}
                            required
                        ></textarea><br /><br />

                        <h1>Product Price</h1>
                        <input
                            type='number'
                            name='price'
                            value={product.price}
                            min='0'
                            step='0.01'
                            placeholder='Enter product price'
                            onChange={handleChange}
                            required
                        /><br /><br />

                        <h1>Product Quantity</h1>
                        <input
                            type='number'
                            min='0'
                            name='quantity'
                            value={product.quantity}
                            placeholder='Enter product quantity'
                            onChange={handleChange}
                            required
                        /><br /><br />

                        <div className="form-group">
                            <h1>Product Category</h1>
                            <div className="category-wrapper">
                                <select
                                    name='category'
                                    value={product.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(category => (
                                        <option key={category.id || category.name} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button type='submit' className='submit-btn'>Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AddProduct;