
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  size?: string;
  color?: string;
}

export const useCart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
          }
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        // Clear corrupted cart data
        localStorage.removeItem('cart');
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (
    item: Omit<CartItem, 'quantity'>, 
    quantity: number = 1,
    size?: string,
    color?: string
  ) => {
    setCartItems(prev => {
      const existingItem = prev.find(
        cartItem => 
          cartItem.id === item.id && 
          cartItem.size === size && 
          cartItem.color === color
      );

      if (existingItem) {
        const updatedCart = prev.map(cartItem =>
          cartItem.id === item.id && 
          cartItem.size === size && 
          cartItem.color === color
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
        toast.success(`${item.name} mis à jour dans le panier`);
        return updatedCart;
      }

      const newCart = [...prev, { ...item, quantity, size, color }];
      toast.success(`${item.name} ajouté au panier`);
      return newCart;
    });
  };

  const removeFromCart = (id: number, size?: string, color?: string) => {
    setCartItems(prev => {
      const itemToRemove = prev.find(item => 
        item.id === id && item.size === size && item.color === color
      );
      
      if (itemToRemove) {
        toast.success(`${itemToRemove.name} retiré du panier`);
      }
      
      return prev.filter(item => 
        !(item.id === id && item.size === size && item.color === color)
      );
    });
  };

  const updateQuantity = (id: number, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    toast.success('Panier vidé');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Alias functions to match component expectations
  const getCartTotal = getTotalPrice;
  const getCartItemsCount = getTotalItems;

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getCartTotal,
    getCartItemsCount,
    loading,
  };
};
