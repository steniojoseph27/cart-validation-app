import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "./ProductCard";
import { CartContext } from "./CartContext";

const mockProduct = { name: "Widget A", sku: "WGT-A" };

function renderWithCart(cart = [], errors = {}, onAdd = jest.fn()) {
  render(
    <CartContext.Provider
      value={{
        cart,
        validationErrors: errors,
        addToCart: onAdd,
      }}
    >
      <ProductCard product={mockProduct} />
    </CartContext.Provider>
  );
}

test("renders product name and SKU", () => {
  renderWithCart();
  expect(screen.getByText("Widget A")).toBeInTheDocument();
  expect(screen.getByText(/SKU:/i)).toBeInTheDocument();
});

test("calls addToCart when button is clicked", () => {
  const addToCartMock = jest.fn();
  renderWithCart([], {}, addToCartMock);

  fireEvent.click(screen.getByText("Add to Cart"));
  expect(addToCartMock).toHaveBeenCalledWith(mockProduct);
});

test("displays error message if present", () => {
  renderWithCart([], { "WGT-A": "Exceeded max quantity" });

  expect(screen.getByText(/Exceeded max quantity/i)).toBeInTheDocument();
});

test("shows correct quantity in cart", () => {
  const cart = [{ sku: "WGT-A", quantity: 3 }];
  renderWithCart(cart);

  expect(screen.getByText(/In Cart: 3/i)).toBeInTheDocument();
});
