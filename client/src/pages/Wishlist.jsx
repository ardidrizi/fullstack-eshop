import { Link } from "react-router-dom";
import "./Wishlist.css";

const Wishlist = () => {
  return (
    <section className="wishlist-page">
      <div className="wishlist-card">
        <h1>Your wishlist</h1>
        <p className="wishlist-lead">
          Save items you love and revisit them anytime. This demo build doesn’t
          persist wishlist items yet.
        </p>
        <div className="wishlist-actions">
          <Link className="wishlist-cta" to="/shop">
            Browse products
          </Link>
          <Link className="wishlist-secondary" to="/categories">
            Explore categories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Wishlist;
