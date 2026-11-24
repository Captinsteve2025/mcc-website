// This preload is used only by the local Playwright production server.
const upstreamHost = /^cya-fixture-[a-f0-9-]+\.invalid$/;
const yacht = {
  id: "aaaaaaaaaaaaaaaaaaaaaaaa",
  yachtName: "Fixture Catamaran",
  yachtType: "catamaran",
  pax: 8,
  cabins: 4,
  length: 60,
  lenght: 60,
  units: "ft",
  main_image: "https://fixture-images.invalid/yacht.png",
  seasons: [{
    title: "Fixture season", base_price: 12000, currency: "USD",
    charter_type: "all inclusive", location_areas: ["Caribbean Virgin Islands (BVI)"],
  }],
  crewGeneral: {
    crewDescription: "<p>Fixture captain biography.</p><p>UnbrokenCrewProfileReferenceForNarrowScreenTesting</p>",
  },
  menuDetails: [{ title: "Breakfast", description: "<p>Fixture sample menu.</p>" }],
};

const catalogueYacht = {
  yachtType: "catamaran",
  pax: 8,
  cabins: 4,
  length: 60,
  units: "ft",
  min_price: 12000,
  currency: "USD",
  charter_type: "all inclusive",
  seasonAreas: ["British Virgin Islands"],
  image: "https://fixture-images.invalid/yacht.png",
};
const catalogue = [
  { ...catalogueYacht, ...yacht },
  { ...catalogueYacht, id: "c".repeat(24), yachtName: "Wrong Region", seasonAreas: ["Caribbean Virgin Islands (US)"] },
  { ...catalogueYacht, id: "d".repeat(24), yachtName: "Closest Match" },
  { ...catalogueYacht, id: "e".repeat(24), yachtName: "Second Match", length: 62, min_price: 13000 },
  { ...catalogueYacht, id: "f".repeat(24), yachtName: "Third Match", length: 63, min_price: 14000 },
  { ...catalogueYacht, id: "1".repeat(24), yachtName: "Fourth Match", length: 64, min_price: 14800 },
  { ...catalogueYacht, id: "2".repeat(24), yachtName: "Broader Match", pax: 10, length: 80, min_price: 15900 },
  { ...catalogueYacht, id: "3".repeat(24), yachtName: "Power Cat", yachtType: "powercat" },
  { ...catalogueYacht, id: "4".repeat(24), yachtName: "Different Currency", currency: "EUR" },
  { ...catalogueYacht, id: "5".repeat(24), yachtName: "Different Terms", charter_type: "plus expenses" },
];

const originalFetch = globalThis.fetch;
globalThis.fetch = (input, init) => {
  const url = new URL(input instanceof Request ? input.url : input, "http://localhost");
  if (!upstreamHost.test(url.hostname)) return originalFetch(input, init);

  if (url.pathname === "/yachts_search") {
    // Simulate an upstream cap below the requested page size.
    const { page } = JSON.parse(init?.body ?? "{}");
    const offset = (page - 1) * 2;
    return Promise.resolve(Response.json({ yachts: catalogue.slice(offset, offset + 2), totalYachts: catalogue.length }));
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
