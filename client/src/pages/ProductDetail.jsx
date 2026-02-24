import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.css";
import { apiRequest, PRODUCTS_URL } from "../services/api";
import useAuth from "../context/useAuth";
import RatingStars from "../components/RatingStars";

const initialReviewForm = {
  rating: "5",
  comment: "",
};

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewForm, setReviewForm] = useState(initialReviewForm);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const { id } = useParams();
  const { user } = useAuth();

  const loadProduct = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`${PRODUCTS_URL}/${id}`);
      if (!response.ok) {
        throw new Error("Failed to load product");
      }
      const data = await response.json();
      setProduct(data);
    } catch (loadError) {
      setError("Failed to fetch product details. Please try again later.");
      console.error(loadError);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    loadProduct();
  }, [loadProduct]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewError("");
    setReviewSuccess("");
    setReviewSubmitting(true);

    try {
      await apiRequest(`/products/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify({
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment.trim(),
        }),
      });
      setReviewSuccess("Review added successfully.");
      setReviewForm(initialReviewForm);
      await loadProduct();
    } catch (submitError) {
      setReviewError(submitError.message || "Could not submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="product-detail">
        <div className="product-detail-content product-detail-skeleton" aria-hidden="true">
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-meta" />
          <div className="skeleton-box skeleton-image" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-short" />
        </div>
      </div>
    );
  }

  if (error) return <p className="page-status">{error}</p>;

  const sortedReviews = [...(product?.reviews || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="product-detail">
      {product && (
        <div className="product-detail-content">
          <h2 className="product-detail-title">{product.name}</h2>
          <p className="product-detail-meta">Category: {product.category || "General"}</p>

          <div className="product-rating-overview">
            <RatingStars rating={product.ratings ?? 0} numReviews={product.numReviews ?? 0} />
            <p className="product-review-summary">
              {product.ratings?.toFixed(1) ?? "0.0"} average from {product.numReviews ?? 0} reviews
            </p>
          </div>

          <p className="product-detail-description">{product.description}</p>
          <p className="product-detail-price">Price: ${product.price}</p>

          {product.images && product.images.length > 0 ? (
            <img src={product.images[0]} alt={product.name} className="product-detail-image" />
          ) : (
            <p>No image available</p>
          )}

          {user ? (
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
          ) : (
            <p className="product-detail-hint">
              Sign in to add items to your cart and track orders.
            </p>
          )}

          <section className="reviews-section">
            <div className="reviews-header">
              <h3>Reviews</h3>
              <span>{product.numReviews ?? 0} total</span>
            </div>

            {sortedReviews.length === 0 ? (
              <p className="empty-reviews">No reviews yet</p>
            ) : (
              <ul className="reviews-list">
                {sortedReviews.map((review) => (
                  <li key={`${review.user}-${review.createdAt}`} className="review-item">
                    <div className="review-item-head">
                      <strong>{review.name}</strong>
                      <time dateTime={review.createdAt}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                    <RatingStars rating={review.rating} numReviews={0} showReviewCount={false} compact />
                    <p>{review.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {user ? (
            <section className="review-form-section">
              <h3>Write a review</h3>
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <label htmlFor="rating">Rating</label>
                <select
                  id="rating"
                  value={reviewForm.rating}
                  onChange={(event) =>
                    setReviewForm((current) => ({ ...current, rating: event.target.value }))
                  }
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>

                <label htmlFor="comment">Comment</label>
                <textarea
                  id="comment"
                  rows={4}
                  placeholder="Tell us what you think about this product"
                  value={reviewForm.comment}
                  onChange={(event) =>
                    setReviewForm((current) => ({ ...current, comment: event.target.value }))
                  }
                  required
                />

                {reviewError ? <p className="review-feedback error">{reviewError}</p> : null}
                {reviewSuccess ? <p className="review-feedback success">{reviewSuccess}</p> : null}

                <button type="submit" className="btn-submit-review" disabled={reviewSubmitting}>
                  {reviewSubmitting ? "Submitting..." : "Submit review"}
                </button>
              </form>
            </section>
          ) : (
            <p className="product-detail-hint">Sign in to leave a review.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
