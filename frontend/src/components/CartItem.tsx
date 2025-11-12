// // src/components/CartItem.tsx
// import { X, Plus, Minus } from "lucide-react";
// import { useCart } from "./CartContext";

// interface CartItemProps {
//   id: number;
//   name: string;
//   image: string;
//   price: number;
//   quantity: number;
// }

// export const CartItem = ({ id, name, image, price, quantity }: CartItemProps) => {
//   const { removeFromCart, updateQuantity } = useCart();

//   return (
//     <div className="flex items-center justify-between border-b py-4">
//       <div className="flex items-center gap-4">
//         <img
//           src={image}
//           alt={name}
//           className="w-16 h-16 object-cover rounded-md"
//         />
//         <div>
//           <h4 className="font-semibold">{name}</h4>
//           <p className="text-sm text-gray-500">${price}</p>
//           <div className="flex items-center mt-2">
//             <button
//               onClick={() => updateQuantity(id, -1)}
//               className="p-1 border rounded-md"
//             >
//               <Minus size={14} />
//             </button>
//             <span className="px-3">{quantity}</span>
//             <button
//               onClick={() => updateQuantity(id, 1)}
//               className="p-1 border rounded-md"
//             >
//               <Plus size={14} />
//             </button>
//           </div>
//         </div>
//       </div>
//       <button
//         onClick={() => removeFromCart(id)}
//         className="text-red-500 hover:text-red-700"
//       >
//         <X size={18} />
//       </button>
//     </div>
//   );
// };
