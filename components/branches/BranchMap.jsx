import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Navigation2, Map as MapIcon } from 'lucide-react';

const BranchMap = ({ data, compact = false }) => {
  if (!data || !data.mapUrl) return null;

  if (compact) {
    return (
      <section className="w-full bg-gray-50 py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="text-[#ef7f1a] w-5 h-5 flex-shrink-0" />
            <p className="text-gray-800 text-sm font-medium">{data.address}{data.landmark ? ` — ${data.landmark}` : ''}</p>
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(data.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#ef7f1a] hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow transition whitespace-nowrap"
          >
            <Navigation2 className="w-4 h-4" /> Get Directions
          </a>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-10 mt-4 h-[280px] rounded-2xl overflow-hidden shadow-md border border-gray-200">
          <iframe
            src={data.mapUrl}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${data.name} Location Map`}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gray-50 py-16 mt-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Left Column: Branch Details */}
          <div className="w-full lg:w-1/3 space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                Visit Indian Hair World
              </h2>
              <h3 className="text-xl font-semibold text-[#ef7f1a]">{data.name}</h3>
            </div>

            <div className="space-y-6">

              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100 flex-shrink-0">
                  <MapPin className="text-gray-900 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Address</p>
                  <p className="text-gray-900 text-sm leading-relaxed">{data.address}</p>
                  {data.landmark && (
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                      <Navigation2 className="w-3 h-3" /> Landmark: {data.landmark}
                    </p>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(data.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 bg-[#ef7f1a] hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow transition"
                  >
                    <Navigation2 className="w-4 h-4" /> Get Directions
                  </a>
                </div>
              </div>

              {data.phones && data.phones.length > 0 && (
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100 flex-shrink-0">
                    <Phone className="text-gray-900 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Phone</p>
                    {data.phones.map((phone, i) => (
                      <a key={i} href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="block text-[#ef7f1a] hover:underline font-medium text-sm">
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {data.whatsapp && (
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100 flex-shrink-0">
                    <MessageSquare className="text-gray-900 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">WhatsApp</p>
                    <a href={`https://wa.me/${data.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline font-medium text-sm">
                      Chat with us
                    </a>
                  </div>
                </div>
              )}

              {data.opening_hours && (
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100 flex-shrink-0">
                    <Clock className="text-gray-900 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Opening Hours</p>
                    <p className="text-gray-900 text-sm">{data.opening_hours}</p>
                  </div>
                </div>
              )}

              {data.serving_areas && (
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100 flex-shrink-0">
                    <MapIcon className="text-gray-900 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Serving Areas</p>
                    <p className="text-gray-900 text-sm italic">{data.serving_areas}</p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Embedded Map */}
          <div className="w-full lg:w-2/3 h-[450px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <iframe
              src={data.mapUrl}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${data.name} Location Map`}
            />
          </div>

        </div>

      </div>
    </section>
  );
};

export default BranchMap;
