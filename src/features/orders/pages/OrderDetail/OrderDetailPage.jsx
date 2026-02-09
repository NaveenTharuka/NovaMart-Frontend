import styles from './OrderDetailPage.module.css';
import { getAllOrders } from '@/api/order.api'
import { useState } from 'react';




function OrderDetail() {

    const [order, setOrder] = useState(null)


    return (
        <div>
            <h1>Order Details</h1>
        </div>
    )

}

export default OrderDetail;