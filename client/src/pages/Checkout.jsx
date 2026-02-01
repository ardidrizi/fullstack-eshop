import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./Checkout.css";

const Checkout = () => {
  const [formState, setFormState] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormState((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiRequest("/orders/checkout", {
        method: "POST",
        body: JSON.stringify({ shippingAddress: formState }),
      });
      navigate("/orders");
    } catch (err) {
      setError(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="checkout-page">
      <div className="checkout-card">
        <h1>Checkout</h1>
        <p className="checkout-subtitle">
          Demo checkout: we will place your order without payment.
        </p>
        <form onSubmit={handleSubmit} className="checkout-form">
          <label>
            Full name
            <input
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Address line 1
            <input
              name="line1"
              value={formState.line1}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Address line 2
            <input name="line2" value={formState.line2} onChange={handleChange} />
          </label>
          <label>
            City
            <input
              name="city"
              value={formState.city}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            State
            <input
              name="state"
              value={formState.state}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Postal code
            <input
              name="postalCode"
              value={formState.postalCode}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Country
            <input
              name="country"
              value={formState.country}
              onChange={handleChange}
              required
            />
          </label>
          {error && <p className="checkout-error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Placing order..." : "Place order"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Checkout;
