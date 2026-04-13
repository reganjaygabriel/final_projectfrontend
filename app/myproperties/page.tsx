'use client';

import { useEffect, useState } from "react";
import { getUserId } from "../lib/actions";
import PropertyList from "../components/properties/PropertyList";
import apiService from "../services/apiService";

interface Reservation {
    id: string;
    start_date: string;
    end_date: string;
    number_of_nights: number;
    total_price: number;
    guests: number;
    guest_name: string;
    guest_email: string;
    property: {
        id: string;
        title: string;
        price_per_night: number;
        image_url: string;
    };
}

const MyPropertiesPage = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const id = await getUserId();
            setUserId(id);

            if (id) {
                try {
                    const data = await apiService.get('/api/properties/landlord/reservations/');
                    setReservations(data);
                } catch (error) {
                    console.error('Error fetching reservations:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <h1 className="my-6 text-2xl">My properties</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PropertyList 
                    landlord_id={userId}
                />
            </div>

            {/* Bookings Section */}
            <div className="mt-12">
                <h2 className="mb-6 text-2xl">Property Bookings</h2>
                
                {loading ? (
                    <div className="text-gray-500">Loading bookings...</div>
                ) : reservations.length === 0 ? (
                    <div className="p-6 bg-gray-100 rounded-xl text-center text-gray-500">
                        No bookings yet for your properties
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reservations.map((reservation) => (
                            <div 
                                key={reservation.id}
                                className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">{reservation.property.title}</h3>
                                        <p className="text-sm text-gray-500">${reservation.property.price_per_night} per night</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Guest</p>
                                        <p className="font-medium">{reservation.guest_name}</p>
                                        <p className="text-sm text-gray-500">{reservation.guest_email}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Dates</p>
                                        <p className="font-medium">{reservation.start_date} to {reservation.end_date}</p>
                                        <p className="text-sm text-gray-500">{reservation.number_of_nights} nights • {reservation.guests} guests</p>
                                    </div>
                                    
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 mb-1">Total</p>
                                        <p className="text-2xl font-bold text-green-600">${reservation.total_price}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default MyPropertiesPage;
