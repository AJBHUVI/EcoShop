import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = cart.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  return (
    <div className="flex justify-between p-8">
      <div className="w-2/3">
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item.product_id} className="flex items-center justify-between mb-6">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1 ml-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p>${item.price}</p>
                <div className="flex items-center mt-2">
                  <button onClick={() => updateQuantity(item.product_id, -1)}>-</button>
                  <span className="mx-3">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product_id, 1)}>+</button>
                </div>
              </div>
              <Button variant="destructive" onClick={() => removeFromCart(item.product_id)}>
                Remove
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="w-1/3 p-6 bg-white shadow rounded-xl">
        <h2 className="font-bold mb-4 text-lg">Order Summary</h2>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Shipping: ${shipping.toFixed(2)}</p>
        <p className="font-bold text-green-600 mt-2">Total: ${total.toFixed(2)}</p>
        <Button className="mt-4 w-full">Proceed to Checkout</Button>
      </div>
    </div>
  );
};

export default CartPage;
