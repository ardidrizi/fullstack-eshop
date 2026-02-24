import { useEffect, useState } from "react";
import "./ProductCard.css";

const ProductCard = ({ name, price, description, imgUrl }) => {
  const [imageError, setImageError] = useState(!imgUrl);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageError(!imgUrl);
    setImageLoaded(false);
  }, [imgUrl]);

  return (
    <div className="product-card">
      <div className={`product-image-frame ${!imageLoaded && !imageError ? "loading" : ""}`}>
        {!imageError ? (
          <img
            src={imgUrl}
            alt={name}
            className="product-image"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="product-image-fallback" role="img" aria-label={`No image available for ${name}`}>
            <span className="fallback-icon" aria-hidden="true">🖼️</span>
            <span>No image</span>
          </div>
        )}
      </div>
      <h3>{name}</h3>
      <p>${price}</p>
      {description ? <p>{description}</p> : null}
    </div>
  );
};

export default ProductCard;
