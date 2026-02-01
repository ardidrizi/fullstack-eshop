import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await apiRequest("/orders");
        setOrders(data);
      } catch (err) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return <p className="page-status">Loading orders...</p>;
  }

  return (
    <section className="orders-page">
      <h1>Your orders</h1>
      {error && <p className="orders-error">{error}</p>}
      {orders.length === 0 ? (
        <p className="orders-empty">No orders yet.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span>Order #{order._id.slice(-6)}</span>
                <span className="order-status">{order.status}</span>
              </div>
              <p>{order.items.length} items</p>
              <p>Total: ${order.subtotal.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Orders;
