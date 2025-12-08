import Image from "next/image";
// import Link from "next/link";
import ReservationSidebar from "@/app/components/properties/ReservationSidebar";

import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/actions";

const PropertyDetailPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;
  let property: any;
  try {
    property = await apiService.get(
      `/api/properties/${encodeURIComponent(id)}/`
    );
  } catch (err) {
    console.error("Failed to load property", err);
    return (
      <main className="max-w-[1500px] mx-auto px-6 pb-6">
        <div className="py-12 text-center">
          <h1 className="text-2xl font-semibold">Unable to load property</h1>
          <p className="mt-2 text-gray-600">
            {String((err as Error).message ?? "Unknown error")}
          </p>
        </div>
      </main>
    );
  }
  const userId = await getUserId();

  console.log("userId", userId);

  return (
    <main className="max-w-[1500px] mx-auto px-6 pb-6">
      <div className="w-full h-[64vh] mb-4 overflow-hidden rounded-xl relative">
        <Image
          fill
          src="/beach_1.jpg"
          className="object-cover w-full h-full"
          alt="Beach house"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="py-6 pr-6 col-span-3">
          <h1 className="mb-4 text-4xl">{property.title}</h1>

          <span className="mb-6 block text-lg text-gray-600">
            {property.guests} guests - {property.bedrooms} bedrooms -{" "}
            {property.bathrooms} bathrooms
          </span>

          <hr />

          <div
            // href={`/landlords/${property.landlord.id}`}
            className="py-6 flex items-center space-x-4"
          >
            {property.landlord.avatar_url && (
              <Image
                src={property.landlord.avatar_url}
                width={50}
                height={50}
                className="rounded-full"
                alt="The user name"
              />
            )}

            <p>
              <strong>{property.landlord.name}</strong> is your host
            </p>
          </div>

          <hr />

          <p className="mt-6 text-lg">{property.description}</p>
        </div>

        <ReservationSidebar property={property} userId={userId} />
      </div>
    </main>
  );
};

export default PropertyDetailPage;
