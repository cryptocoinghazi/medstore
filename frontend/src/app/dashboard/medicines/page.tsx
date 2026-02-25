'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  composition: string;
  manufacturer: string;
  category: string;
  base_price: string;
  requires_prescription: boolean;
  dosage_info: any;
}

export default function MedicinesPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedicines = async (searchQuery: string) => {
    setLoading(true);
    try {
      const endpoint = searchQuery 
        ? `/medicines/search?q=${encodeURIComponent(searchQuery)}`
        : '/medicines';
      const data = await apiFetch(endpoint);
      if (data) {
        setMedicines(data);
      }
    } catch (error) {
      console.error('Failed to fetch medicines', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Update query state if URL param changes (e.g. back button)
    setQuery(initialQuery);
    fetchMedicines(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedicines(query);
    // Optionally update URL without reload
    window.history.pushState(null, '', `?q=${encodeURIComponent(query)}`);
  };

  const addToCart = async (medicineId: string) => {
    try {
      await apiFetch('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ medicineId, quantity: 1 })
      });
      // In a real app, we would use a toast notification here
      // For now, we'll just log it or maybe change button state temporarily
      // But let's use a simple alert as fallback if no toast
      alert('Medicine added to cart!');
    } catch (error: any) {
      console.error('Failed to add to cart', error);
      alert(`Failed to add to cart: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-6">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-gray-900">Medicines Store</h1>
           <p className="text-gray-500 mt-1">Browse and order medicines</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search by name, composition..."
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading medicines...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((med) => (
            <Card key={med.id} className="hover:shadow-lg transition-shadow border-t-4 border-t-blue-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">{med.name}</CardTitle>
                    <p className="text-sm text-blue-600 font-medium">{med.composition}</p>
                  </div>
                  {med.requires_prescription && (
                    <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Rx Required</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm mt-2">
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Manufacturer</span>
                    <span className="font-medium text-gray-900">{med.manufacturer || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Category</span>
                    <span className="font-medium text-gray-900">{med.category || 'General'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div>
                        <span className="text-xs text-gray-400 block">Price</span>
                        <span className="text-xl font-bold text-gray-900">₹{med.base_price}</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                      onClick={() => addToCart(med.id)}
                    >
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {medicines.length === 0 && (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">No medicines found matching "{query}"</p>
              <Button variant="link" onClick={() => { setQuery(''); fetchMedicines(''); }} className="mt-2 text-blue-600">
                Clear search and view all
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
