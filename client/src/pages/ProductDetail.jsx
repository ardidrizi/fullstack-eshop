import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ProductDetail.css"; // New CSS file for styling

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProductWithId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/products/${id}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setProduct(response.data);
      } catch (error) {
        setError("Failed to fetch product details. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductWithId();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-detail">
      {product && (
        <div className="product-detail-content">
          <h2 className="product-detail-title">{product.name}</h2>
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
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
