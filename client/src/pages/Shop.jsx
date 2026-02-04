import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiRequest, PRODUCTS_URL } from "../services/api";
import useAuth from "../context/useAuth";
import ProductCard from "../components/ProductCard";
import "./Shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  // console.log(products);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(PRODUCTS_URL);
        if (!resp.ok) {
          throw new Error("Failed to load products");
        }
        const data = await resp.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="products-section">
      <section className="section-featured-products">
        <div className="shop-header">
          <div>
            <p className="shop-kicker">New arrivals</p>
            <h2 className="section-title">Featured Products</h2>
          </div>
          <p className="shop-subtitle">
            Shop curated essentials with fast shipping and easy returns.
          </p>
        </div>
        <div className="product-grid">
          {products.length === 0 ? (
            <p className="page-status">No products available yet.</p>
          ) : (
            products.map((product) => (
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
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
