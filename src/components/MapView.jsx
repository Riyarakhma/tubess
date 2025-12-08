import React from "react";

export default function MapView({ buses, haltes, routes, selectedRoute }) {
  const filteredBuses = selectedRoute
    ? buses.filter((b) => b.routeId === selectedRoute)
    : buses;

  const filteredHaltes = selectedRoute
    ? haltes.filter((h) => h.routeId === selectedRoute)
    : haltes;

  return (
    <div className="space-y-4">

      {/* MAP WRAPPER */}
      <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg border">

        {/* GOOGLE MY MAPS (IFRAME) */}
        <iframe
          src="https://www.google.com/maps/d/embed?mid=1FPwlr96QXWlcfZemkdMfNEMwciz3I1U&hl=en_US&ehbc=2E312F"
          className="absolute inset-0 w-full h-full"
          loading="lazy"
        ></iframe>

        {/* OVERLAY MARKERS */}
        <div className="absolute inset-0">

          {/* HALTE MARKERS */}
          {filteredHaltes.map((halte) => {
            const route = routes.find((r) => r.id === halte.routeId);

            // skalakan lat/lng ke posisi relatif (dummy mapping)
            const left = (halte.lng % 1) * 100;
            const top = (halte.lat % 1) * 100;

            return (
              <div
                key={`halte-${halte.id}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 shadow"
                  style={{ backgroundColor: route?.color || "#3b82f6" }}
                ></div>

                {/* TOOLTIP */}
                <div className="absolute left-2 top-2 bg-black text-white text-xs px-2 py-1 rounded hidden group-hover:block">
                  {halte.name}
                </div>
              </div>
            );
          })}

          {/* BUS MARKERS */}
          {filteredBuses.map((bus) => {
            const route = routes.find((r) => r.id === bus.routeId);
            const crowd = bus.getCrowdLevel();

            const left = (bus.lng % 1) * 100;
            const top = (bus.lat % 1) * 100;

            return (
              <div
                key={`bus-${bus.id}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow text-xl"
                  style={{ backgroundColor: route?.color || "#3b82f6" }}
                >
                  🚌
                </div>

                {/* Tooltip */}
                <div className="absolute left-2 top-2 bg-black text-white text-xs px-2 py-1 rounded">
                  Bus {bus.id} — {bus.currentPassengers}/{bus.capacity}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LEGEND */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h3 className="font-bold text-gray-700 mb-3">Legenda:</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full" />
            <span className="text-sm text-gray-600">Halte</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs">
              🚌
            </div>
            <span className="text-sm text-gray-600">Bus Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
}
