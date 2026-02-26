'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, Plus, CreditCard, ArrowDownLeft, ArrowUpRight, History } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { format } from 'date-fns';

interface WalletTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  description: string;
  status: string;
  created_at: string;
}

interface WalletData {
  id: string;
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/wallet');
      setWallet(data);
    } catch (err) {
      console.error('Failed to fetch wallet:', err);
      setError('Failed to load wallet information.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    if (!amountToAdd || isNaN(Number(amountToAdd)) || Number(amountToAdd) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    try {
      setError(null);
      await apiFetch('/wallet/add', {
        method: 'POST',
        body: JSON.stringify({ amount: Number(amountToAdd) }),
      });
      setAmountToAdd('');
      setIsAddingMoney(false);
      fetchWallet(); // Refresh wallet data
    } catch (err) {
      console.error('Failed to add money:', err);
      setError('Failed to add money. Please try again.');
    }
  };

  if (loading && !wallet) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Wallet</h1>
          <p className="text-gray-500">Manage your balance and transactions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <Card className="md:col-span-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2 opacity-90">
                <Wallet className="h-5 w-5" />
                <span className="font-medium">Available Balance</span>
              </div>
              
              <div className="text-5xl font-bold tracking-tight">
                ₹{wallet?.balance ? Number(wallet.balance).toFixed(2) : '0.00'}
              </div>
              
              <div className="pt-4 flex items-center space-x-4">
                {!isAddingMoney ? (
                  <Button 
                    onClick={() => setIsAddingMoney(true)}
                    className="bg-white text-blue-700 hover:bg-blue-50 border-none font-semibold"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Money
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={amountToAdd}
                      onChange={(e) => setAmountToAdd(e.target.value)}
                      className="bg-white text-gray-900 border-none w-32 placeholder:text-gray-400"
                      autoFocus
                    />
                    <Button 
                      onClick={handleAddMoney}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white border-none"
                    >
                      Confirm
                    </Button>
                    <Button 
                      onClick={() => { setIsAddingMoney(false); setAmountToAdd(''); setError(null); }}
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              {error && <p className="text-red-200 text-sm mt-2 bg-red-900/20 p-2 rounded">{error}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats or Actions */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50">
              <CreditCard className="mr-3 h-4 w-4" /> Manage Cards
            </Button>
            <Button variant="outline" className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50">
              <History className="mr-3 h-4 w-4" /> Statements
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="border border-gray-100 shadow-sm bg-white">
        <CardHeader className="border-b border-gray-50 bg-gray-50/30">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <History className="h-5 w-5 text-gray-500" /> Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {wallet?.transactions && wallet.transactions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {wallet.transactions.map((tx) => (
                <div key={tx.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {tx.type === 'credit' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{tx.description || tx.category}</p>
                      <p className="text-sm text-gray-500">{format(new Date(tx.created_at), 'MMM d, yyyy • h:mm a')}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No transactions yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
