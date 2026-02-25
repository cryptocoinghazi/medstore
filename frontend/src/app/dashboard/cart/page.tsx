
'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  quantity: number;
  medicine: {
    id: string;
    name: string;
    base_price: string;
    manufacturer: string;
  };
}

interface Cart {
  id: string;
  items: CartItem[];
  totalAmount: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/cart');
      if (data) {
        setCart(data);
      }
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await apiFetch(`/cart/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity: newQuantity })
      });
      fetchCart(); // Refresh cart to get updated totals
    } catch (error) {
      console.error('Failed to update quantity', error);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!confirm('Remove this item from cart?')) return;
    try {
      await apiFetch(`/cart/${itemId}`, { method: 'DELETE' });
      fetchCart();
    } catch (error) {
      console.error('Failed to remove item', error);
    }
  };

  const clearCart = async () => {
    if (!confirm('Are you sure you want to empty your cart?')) return;
    try {
      await apiFetch('/cart', { method: 'DELETE' });
      fetchCart();
    } catch (error) {
      console.error('Failed to clear cart', error);
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;
    
    const confirmed = confirm(`Proceed to checkout with total ₹${(cart.totalAmount * 1.18).toFixed(2)}?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      // Create order
      const order = await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          deliveryAddress: {
            street: '123 Main St',
            city: 'Bangalore',
            state: 'Karnataka',
            zip: '560001'
          }
        })
      });

      alert(`Order placed successfully! Order ID: ${order.order_number}`);
      router.push('/dashboard/patient/orders');
    } catch (error: any) {
      console.error('Checkout failed', error);
      alert(`Checkout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !cart) {
    return <div className="p-8 text-center text-gray-500">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-blue-50 p-6 rounded-full mb-6">
            <ShoppingBag className="h-12 w-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added any medicines to your cart yet.</p>
        <Link href="/dashboard/medicines">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Browse Medicines
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <Button variant="ghost" onClick={clearCart} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.id} className="overflow-hidden border-gray-200 hover:border-blue-200 transition-colors">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{item.medicine.name}</h3>
                  <p className="text-sm text-gray-500 mb-1">{item.medicine.manufacturer}</p>
                  <p className="font-medium text-blue-600">₹{item.medicine.base_price}</p>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center border rounded-md">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-none text-gray-500 hover:text-blue-600"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-none text-gray-500 hover:text-blue-600"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>

                    <div className="text-right min-w-[80px]">
                        <p className="font-bold text-gray-900">₹{(Number(item.medicine.base_price) * item.quantity).toFixed(2)}</p>
                    </div>

                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                        onClick={() => removeItem(item.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
            <Card className="sticky top-6 border-gray-200 shadow-sm bg-gray-50/50">
                <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium">₹{cart.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Shipping</span>
                        <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tax (Estimated)</span>
                        <span className="font-medium">₹{(cart.totalAmount * 0.18).toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t pt-4 flex justify-between items-end">
                        <span className="font-bold text-lg text-gray-900">Total</span>
                        <div className="text-right">
                            <span className="font-bold text-2xl text-blue-700">₹{(cart.totalAmount * 1.18).toFixed(2)}</span>
                            <p className="text-xs text-gray-500">Including Taxes</p>
                        </div>
                    </div>

                    <Button 
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 h-12 text-lg shadow-md hover:shadow-lg transition-all"
                      onClick={handleCheckout}
                    >
                        Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    
                    <p className="text-xs text-center text-gray-400 mt-4">
                        Secure Checkout powered by MedStore
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
