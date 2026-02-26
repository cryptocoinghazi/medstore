'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, TestTube, MapPin, Clock, Calendar, CheckCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface LabTest {
  id: string;
  name: string;
  description: string;
  price: string;
  duration_hours: number;
  home_collection: boolean;
  lab: {
    lab_name: string;
    address: any;
  };
}

interface Booking {
  id: string;
  test: LabTest;
  lab: {
    lab_name: string;
  };
  booking_date: string;
  time_slot: string;
  status: string;
}

export default function LabTestsPage() {
  const [activeTab, setActiveTab] = useState<'browse' | 'bookings'>('browse');
  const [tests, setTests] = useState<LabTest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  
  // Booking Form State
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'browse') {
      fetchTests();
    } else {
      fetchBookings();
    }
  }, [activeTab, search]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const query = search ? `?search=${search}` : '';
      const data = await apiFetch(`/lab-tests${query}`);
      setTests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/lab-tests/bookings');
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTest || !bookingDate || !bookingTime) return;

    try {
      setBookingLoading(true);
      // Construct ISO date for time_slot (combining date and time)
      const slotDate = new Date(`${bookingDate}T${bookingTime}`);
      
      await apiFetch('/lab-tests/book', {
        method: 'POST',
        body: JSON.stringify({
          test_id: selectedTest.id,
          booking_date: bookingDate,
          time_slot: slotDate.toISOString(),
          home_collection: true,
          address: {} // Uses user's default or empty for now
        })
      });
      
      alert('Lab test booked successfully!');
      setSelectedTest(null);
      setBookingDate('');
      setBookingTime('');
      setActiveTab('bookings');
    } catch (err) {
      console.error(err);
      alert('Failed to book test');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-6">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-gray-900">Lab Tests</h1>
           <p className="text-gray-500 mt-1">Book diagnostic tests with home collection</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'browse' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('browse')}
            >
                Browse Tests
            </button>
            <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'bookings' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('bookings')}
            >
                My Bookings
            </button>
        </div>
      </div>

      {activeTab === 'browse' && (
        <>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search tests (e.g., CBC, Thyroid)..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
             <div className="text-center py-20 text-gray-500">Loading tests...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test) => (
                <Card key={test.id} className="hover:shadow-lg transition-shadow border-t-4 border-t-purple-500 flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">{test.name}</CardTitle>
                        <CardDescription className="mt-1 font-medium text-purple-600">{test.lab.lab_name}</CardDescription>
                      </div>
                      <div className="bg-purple-50 p-2 rounded-full">
                        <TestTube className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2 text-sm text-gray-600">
                        <p>{test.description}</p>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>Report in {test.duration_hours} hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{test.home_collection ? 'Home Collection Available' : 'Lab Visit Only'}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                        <span className="text-xl font-bold text-gray-900">₹{test.price}</span>
                        <Button 
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => setSelectedTest(test)}
                        >
                            Book Now
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'bookings' && (
          loading ? (
            <div className="text-center py-20 text-gray-500">Loading bookings...</div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
                {bookings.map((booking) => (
                    <Card key={booking.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{booking.test?.name || 'Lab Test'}</h3>
                                    <p className="text-purple-600 font-medium">{booking.lab?.lab_name}</p>
                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{new Date(booking.time_slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border 
                                        ${booking.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                          booking.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                                          'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-100 shadow-sm">
                <TestTube className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
                <p className="text-gray-500">You haven't booked any lab tests yet.</p>
            </div>
          )
      )}

      {/* Booking Modal */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <Card className="w-full max-w-md relative bg-white">
                <CardHeader>
                    <CardTitle>Book Lab Test</CardTitle>
                    <CardDescription>Schedule your sample collection</CardDescription>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                        onClick={() => setSelectedTest(null)}
                    >
                        ✕
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleBook} className="space-y-4">
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 mb-4">
                            <h4 className="font-semibold text-purple-900">{selectedTest.name}</h4>
                            <p className="text-sm text-purple-700">{selectedTest.lab.lab_name}</p>
                            <p className="text-lg font-bold text-purple-900 mt-2">₹{selectedTest.price}</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input 
                                id="date" 
                                type="date" 
                                required 
                                min={new Date().toISOString().split('T')[0]}
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input 
                                id="time" 
                                type="time" 
                                required 
                                value={bookingTime}
                                onChange={(e) => setBookingTime(e.target.value)}
                            />
                        </div>

                        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={bookingLoading}>
                            {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}