import "./RatingStars.css";

const STAR_TOTAL = 5;

const getStarType = (rating, index) => {
  const starValue = index + 1;

  if (rating >= starValue) return "full";
  if (rating >= starValue - 0.5) return "half";
  return "empty";
};

const RatingStars = ({ rating = 0, numReviews = 0, compact = false, showReviewCount = true }) => (
  <div className={`rating-row ${compact ? "compact" : ""}`} aria-label={`Rated ${rating} out of 5`}>
    <div className="star-group" aria-hidden="true">
      {Array.from({ length: STAR_TOTAL }).map((_, index) => {
        const type = getStarType(rating, index);

        return (
          <span key={index} className={`star star-${type}`}>
            ★
          </span>
        );
      })}
    </div>
    <span className="rating-value">{rating.toFixed(1)}</span>
    {showReviewCount ? <span className="review-count">({numReviews})</span> : null}
  </div>
);

export default RatingStars;
