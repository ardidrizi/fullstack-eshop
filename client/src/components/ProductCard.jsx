import "./ProductCard.css";

const ProductCard = ({ name, price, description, imgUrl }) => {
  return (
    <div className="product-card">
      <img src={imgUrl} alt={name} className="product-image" />
      <h3>{name}</h3>
      <p>${price}</p>
      <p>{description}</p>
    </div>
  );
};

export default ProductCard;
