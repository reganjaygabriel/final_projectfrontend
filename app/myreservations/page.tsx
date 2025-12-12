import Image from "next/image";
import apiService from "../services/apiService";
import Link from "next/link";
import { getAccessToken } from "@/app/lib/actions";

const MyReservationsPage = async () => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    // Do not attempt to modify cookies here; mutations must occur in Server Actions/Route Handlers
    return (
      <main className="max-w-[1500px] mx-auto px-6 pb-6">
        <h1 className="my-6 text-2xl">My reservations</h1>
        <div className="py-12 text-center">
          <p className="text-gray-700">You must be logged in to view your reservations.</p>
          <Link href="/" className="mt-4 inline-block py-3 px-5 bg-airbnb text-white rounded-xl">Go to home</Link>
        </div>
      </main>
    );
  }

  let reservations: any[] = [];
  try {
    reservations = await apiService.get('/api/auth/myreservations/');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const isUnauthorized = msg.includes('401');
    return (
      <main className="max-w-[1500px] mx-auto px-6 pb-6">
        <h1 className="my-6 text-2xl">My reservations</h1>
        <div className="py-12 text-center">
          <h2 className="text-xl font-semibold mb-2">{isUnauthorized ? 'Please log in again' : 'Unable to load reservations'}</h2>
          <p className="text-gray-700">{msg}</p>
          <Link href="/" className="mt-4 inline-block py-3 px-5 bg-airbnb text-white rounded-xl">Go to home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1500px] mx-auto px-6 pb-6">
      <h1 className="my-6 text-2xl">My reservations</h1>

      <div className="space-y-4">
        {reservations.map((reservation: any) => {
          return (
            <div
              key={reservation?.id ?? `${reservation?.property?.id}-${reservation?.start_date}-${reservation?.end_date}`}
              className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-md border border-gray-300 rounded-xl"
            >
              <div className="col-span-1">
                <div className="relative overflow-hidden aspect-square rounded-xl">
                  <Image
                    fill
                    src={reservation.property.image_url}
                    className="hover:scale-110 object-cover transition h-full w-full"
                    alt="Beach house"
                    unoptimized
                  />
                </div>
              </div>

              <div className="col-span-1 md:col-span-3">
                <h2 className="mb-4 text-xl">{reservation.property.title}</h2>

                <p className="mb-2"><strong>Check in date:</strong> {reservation.start_date}</p>
                <p className="mb-2"><strong>Check out date:</strong> {reservation.end_date}</p>

                <p className="mb-2"><strong>Number of nights:</strong> {reservation.number_of_nights}</p>
                <p className="mb-2"><strong>Total price:</strong> ${reservation.total_price}</p>

                <Link 
                  href={`/properties/${reservation.property.id}`}
                  className="mt-6 inline-block cursor-pointer py-4 px-6 bg-airbnb text-white rounded-xl"
                >
                  Go to property
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}

export default MyReservationsPage;