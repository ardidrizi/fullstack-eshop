import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import useAuth from "../context/useAuth";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import "./Shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  // console.log(products);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(import.meta.env.VITE_SERVER_URL, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setProducts(resp.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="products-section">
      {/* Featured Products Section */}
      <section className="section-featured-products">
        <h2 className="section-title">Featured Products</h2>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-item">
              <Link to={`/shop/${product._id}`} className="no-underline">
                <ProductCard
                  name={product.name}
                  price={product.price}
                  imgUrl={product.images[0] ?? ""}
                />
              </Link>
              {user && (
                <button
                  className="btn-add-cart"
                  onClick={async () => {
                    await apiRequest("/cart", {
                      method: "POST",
                      body: JSON.stringify({
                        productId: product._id,
                        quantity: 1,
                      }),
                    });
                  }}
                >
                  Add to cart
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Shop;
