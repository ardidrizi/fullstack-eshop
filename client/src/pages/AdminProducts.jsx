import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "./AdminProducts.css";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  category: "",
  image: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [formState, setFormState] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      const data = await apiRequest("/products");
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (event) => {
    setFormState((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const payload = {
        name: formState.name,
        description: formState.description,
        price: Number(formState.price),
        quantity: Number(formState.quantity),
        category: formState.category,
        images: [formState.image],
      };
      const newProduct = await apiRequest("/admin/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setProducts((prev) => [newProduct, ...prev]);
      setFormState(emptyForm);
    } catch (err) {
      setError(err.message || "Failed to create product");
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`/admin/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  return (
    <section className="admin-products">
      <h1>Admin: Products</h1>
      {error && <p className="admin-error">{error}</p>}
      <div className="admin-grid">
        <form onSubmit={handleSubmit} className="admin-form">
          <h2>Add product</h2>
          <input
            name="name"
            placeholder="Name"
            value={formState.name}
            onChange={handleChange}
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={formState.category}
            onChange={handleChange}
            required
          />
          <input
            name="price"
            type="number"
            min="0"
            placeholder="Price"
            value={formState.price}
            onChange={handleChange}
            required
          />
          <input
            name="quantity"
            type="number"
            min="0"
            placeholder="Quantity"
            value={formState.quantity}
            onChange={handleChange}
            required
          />
          <input
            name="image"
            placeholder="Image URL"
            value={formState.image}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formState.description}
            onChange={handleChange}
            required
          />
          <button type="submit">Create product</button>
        </form>
        <div className="admin-list">
          {products.map((product) => (
            <div key={product._id} className="admin-item">
              <div>
                <h3>{product.name}</h3>
                <p>${product.price}</p>
              </div>
              <button onClick={() => handleDelete(product._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminProducts;
