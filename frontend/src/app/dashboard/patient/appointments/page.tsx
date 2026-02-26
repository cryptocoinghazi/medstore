'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Video, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Appointment {
  id: string;
  doctor: {
    user: {
      name: string;
      mobile: string;
    };
    specialty: string;
  };
  appointment_date: string;
  time_slot: string;
  status: string;
  consultation_type: string;
  fee: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/appointments');
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
      switch (status) {
          case 'scheduled': return 'text-blue-600 bg-blue-50 border-blue-200';
          case 'completed': return 'text-green-600 bg-green-50 border-green-200';
          case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
          default: return 'text-gray-600 bg-gray-50 border-gray-200';
      }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
        await apiFetch(`/appointments/${id}/cancel`, { method: 'POST' });
        fetchAppointments();
    } catch (err) {
        console.error(err);
        alert('Failed to cancel appointment');
    }
  };

  if (loading) return (
      <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <Button onClick={() => router.push('/dashboard/patient/doctors')} className="bg-blue-600 hover:bg-blue-700 text-white">
              Book New Appointment
          </Button>
      </div>

      {appointments.length > 0 ? (
          <div className="grid gap-4">
              {appointments.map((apt) => (
                  <Card key={apt.id} className="hover:shadow-md transition-shadow border-gray-200">
                      <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                              <div className="flex items-start gap-4">
                                  <div className="bg-blue-100 text-blue-700 h-16 w-16 rounded-full flex items-center justify-center font-bold text-xl uppercase flex-shrink-0">
                                      {apt.doctor.user.name.charAt(0)}
                                  </div>
                                  <div>
                                      <h3 className="text-lg font-bold text-gray-900">{apt.doctor.user.name}</h3>
                                      <p className="text-blue-600 font-medium mb-2">{apt.doctor.specialty}</p>
                                      
                                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                          <div className="flex items-center gap-1.5">
                                              <Calendar className="h-4 w-4 text-gray-400" />
                                              <span className="font-medium">{new Date(apt.appointment_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                              <Clock className="h-4 w-4 text-gray-400" />
                                              <span className="font-medium">{new Date(apt.time_slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                              {apt.consultation_type === 'online' ? <Video className="h-4 w-4 text-gray-400" /> : <MapPin className="h-4 w-4 text-gray-400" />}
                                              <span className="capitalize font-medium">{apt.consultation_type}</span>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(apt.status)}`}>
                                      {apt.status}
                                  </span>
                                  
                                  {apt.status === 'scheduled' && (
                                      <div className="flex gap-2 w-full md:w-auto mt-2">
                                          {apt.consultation_type === 'online' && (
                                              <Button size="sm" className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                                                  Join Call
                                              </Button>
                                          )}
                                          <Button 
                                              size="sm" 
                                              variant="outline" 
                                              className="flex-1 md:flex-none text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300"
                                              onClick={() => handleCancel(apt.id)}
                                          >
                                              Cancel
                                          </Button>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </CardContent>
                  </Card>
              ))}
          </div>
      ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col items-center">
              <div className="bg-blue-50 p-4 rounded-full mb-4">
                  <Calendar className="h-10 w-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No appointments yet</h3>
              <p className="text-gray-500 mb-6 max-w-sm">You haven't booked any appointments. Find a specialist and schedule your consultation today.</p>
              <Button onClick={() => router.push('/dashboard/patient/doctors')} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                  Find a Doctor
              </Button>
          </div>
      )}
    </div>
  );
}
