import { useCart } from "./CartContext";

export default function ProductCard({ product }) {
  const { addToCart, validationErrors, cart } = useCart();

  const errorMessage = validationErrors[product.sku];
  const cartItem = cart.find(p => p.sku === product.sku);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">SKU: <strong>{product.sku}</strong></p>

        <div className="d-flex align-items-center mb-2">
          <button
            className="btn btn-primary me-2"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
          <span className="badge bg-secondary">
            In Cart: {quantity}
          </span>
        </div>

        {errorMessage && (
          <div className="alert alert-danger mt-2 p-2" role="alert">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
