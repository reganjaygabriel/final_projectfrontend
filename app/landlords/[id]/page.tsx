import { Suspense } from "react";
import Image from "next/image";

import ContactButton from "@/app/components/ContactButton";
import PropertyList from "@/app/components/properties/PropertyList";
import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/actions";

const LandlordDetailPage = async (props: { params: Promise<{ id: string }> }) => {
    const { id } = await props.params;
    const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!UUID_RE.test(id)) {
      return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
          <div className="py-12 text-center">
            <h1 className="text-2xl font-semibold">Invalid landlord ID</h1>
            <p className="mt-2 text-gray-600">The ID "{id}" is not a valid UUID.</p>
          </div>
        </main>
      );
    }
    let landlord: any;
    try {
        landlord = await apiService.get(`/api/auth/${encodeURIComponent(id)}`)
    } catch (err) {
        console.warn('Failed to load landlord', err);
        const msg = err instanceof Error ? err.message : String(err);
        const title = msg.includes('404') ? 'Landlord not found' : 'Unable to load landlord';
        return (
          <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <div className="py-12 text-center">
              <h1 className="text-2xl font-semibold">{title}</h1>
              <p className="mt-2 text-gray-600">{msg}</p>
            </div>
          </main>
        );
    }
     const userId = await getUserId();
     return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <aside className="col-span-1 mb-4">
                    <div className="flex flex-col items-center p-6 rounded-xl border border-gray-300 shadow-xl">
                        {landlord?.avatar_url && landlord.avatar_url.trim() !== "" ? (
                          <Image
                            src={landlord.avatar_url}
                            width={200}
                            height={200}
                            alt={landlord?.name ?? 'Landlord'}
                            className="rounded-full"
                            unoptimized
                          />
                        ) : (
                          <Image
                            src="/profile_pic_1.jpg"
                            width={200}
                            height={200}
                            alt="Default avatar"
                            className="rounded-full"
                          />
                        )}
                        <h1 className="mt-6 text-2xl">{landlord.name}</h1>
                        {userId != id && (
                           <ContactButton 
                                userId={userId}
                                landlordId={id}
                            />
                        )}
                    </div>
                </aside>

                <div className="col-span-1 md:col-span-3 pl-0 md:pl-6">
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Suspense fallback={<div>Loading properties...</div>}>
                            <PropertyList 
                                landlord_id={id}
                            />
                        </Suspense>
                    </div> 
                </div>
            </div>
        </main>
    )
}

export default LandlordDetailPage;