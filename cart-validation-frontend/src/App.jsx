import { CartProvider } from "./CartContext";
import ProductCard from "./ProductCard";
import { products } from "./products";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <CartProvider>
      <div className="container mt-5">
        <h1 className="mb-4">🛒 Product List</h1>
        <div className="row">
          {products.map(product => (
            <div className="col-md-6" key={product.sku}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </CartProvider>
  );
}

export default App;
