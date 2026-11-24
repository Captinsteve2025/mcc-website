// This preload is used only by the local Playwright production server.
const upstreamHost = "cya-fixture.invalid";
const yacht = {
  id: "aaaaaaaaaaaaaaaaaaaaaaaa",
  yachtName: "Fixture Catamaran",
  yachtType: "Sailing Catamaran",
  pax: 8,
  cabins: 4,
  length: 60,
  lenght: 60,
  units: "ft",
  main_image: "https://fixture-images.invalid/yacht.png",
  seasons: [{ title: "Fixture season", base_price: 12000, currency: "USD" }],
  crewGeneral: { crewDescription: "<p>Fixture captain biography.</p>" },
  menuDetails: [{ title: "Breakfast", description: "<p>Fixture sample menu.</p>" }],
};

const originalFetch = globalThis.fetch;
globalThis.fetch = (input, init) => {
  const url = new URL(input instanceof Request ? input.url : input, "http://localhost");
  if (url.hostname !== upstreamHost) return originalFetch(input, init);

  if (url.pathname === "/yachts_search") {
    return Promise.resolve(Response.json({ yachts: [yacht], totalYachts: 1 }));
  }
  if (url.pathname === `/yachts_get/${yacht.id}`) {
    return Promise.resolve(Response.json(yacht));
  }
  if (url.pathname === "/bookings" && url.searchParams.get("yacht_id") === yacht.id) {
    const today = new Date().toISOString().slice(0, 10);
    return Promise.resolve(Response.json([{
      _id: "fixture-booking",
      category: "Booked",
      event_start_date: today,
      event_end_date: today,
    }]));
  }
  return Promise.resolve(Response.json({ message: "Fixture record not found" }, { status: 404 }));
};
