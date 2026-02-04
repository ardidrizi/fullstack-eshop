import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./Cart.css";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const data = await apiRequest("/cart");
      setItems(data);
    } catch (err) {
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    try {
      const data = await apiRequest("/cart", {
        method: "PUT",
        body: JSON.stringify({ productId, quantity }),
      });
      setItems(data);
    } catch (err) {
      setError(err.message || "Failed to update cart");
    }
  };

  const removeItem = async (productId) => {
    try {
      const data = await apiRequest(`/cart/${productId}`, { method: "DELETE" });
      setItems(data);
    } catch (err) {
      setError(err.message || "Failed to remove item");
    }
  };

  const displayItems = items.filter((item) => item?.product);
  const subtotal = displayItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) {
    return <p className="page-status">Loading cart...</p>;
  }

  return (
    <section className="cart-page">
      <div className="cart-header">
        <h1>Your cart</h1>
        <Link to="/shop" className="cart-link">
          Continue shopping
        </Link>
      </div>
      {error && <p className="cart-error">{error}</p>}
      {displayItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {displayItems.map((item) => (
              <div key={item.product._id} className="cart-item">
                <img src={item.product.images?.[0]} alt={item.product.name} />
                <div className="cart-item-info">
                  <h3>{item.product.name}</h3>
                  <p>${item.product.price}</p>
                </div>
                <div className="cart-item-actions">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(item.product._id, Number(event.target.value))
                    }
                  />
                  <button onClick={() => removeItem(item.product._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <aside className="cart-summary">
            <h2>Summary</h2>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <Link className="cart-checkout" to="/checkout">
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
};

export default Cart;
