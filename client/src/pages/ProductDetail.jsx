import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.css"; // New CSS file for styling
import { apiRequest, PRODUCTS_URL } from "../services/api";
import useAuth from "../context/useAuth";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProductWithId = async () => {
      try {
        const response = await fetch(`${PRODUCTS_URL}/${id}`);
        if (!response.ok) {
          throw new Error("Failed to load product");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError("Failed to fetch product details. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductWithId();
  }, [id]);

  if (loading) return <p className="page-status">Loading...</p>;
  if (error) return <p className="page-status">{error}</p>;

  return (
    <div className="product-detail">
      {product && (
        <div className="product-detail-content">
          <h2 className="product-detail-title">{product.name}</h2>
          <p className="product-detail-meta">
            Category: {product.category || "General"}
          </p>
          <p className="product-detail-description">{product.description}</p>
          <p className="product-detail-price">Price: ${product.price}</p>
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="product-detail-image"
            />
          ) : (
            <p>No image available</p>
          )}
          {user && (
            <button
              className="btn-detail-cart"
              onClick={async () => {
                await apiRequest("/cart", {
                  method: "POST",
                  body: JSON.stringify({ productId: product._id, quantity: 1 }),
                });
              }}
            >
              Add to cart
            </button>
          )}
          {!user && (
            <p className="product-detail-hint">
              Sign in to add items to your cart and track orders.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
