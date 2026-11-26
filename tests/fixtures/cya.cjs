// This preload is used only by the local Playwright production server.
const upstreamHost = /^cya-fixture-[a-f0-9-]+\.invalid$/;
const futureDates = { start_date: "2099-01-01", end_date: "2099-12-31" };
const yacht = {
  id: "aaaaaaaaaaaaaaaaaaaaaaaa",
  yachtName: "Fixture Catamaran",
  yachtType: "catamaran",
  pax: 10,
  cabins: 4,
  length: 60,
  lenght: 60,
  units: "ft",
  main_image: "https://fixture-images.invalid/yacht.png",
  Images: [
    { image_src: "https://fixture-images.invalid/salon.png", description: "An unrelated salon caption." },
    {
      image_src: "https://fixture-images.invalid/yacht.png",
      description: "The yacht has a shaded flybridge, a spacious cockpit for dining outside, and panoramic views from the main salon.\r\n\r\nThe original brochure also includes notes about a previous charter crew.",
    },
    { image_src: "https://fixture-images.invalid/bow.png", title: "Bow" },
    { image_src: "https://fixture-images.invalid/deck.png", title: "Deck" },
    { image_src: "https://fixture-images.invalid/cabin.png", title: "Cabin" },
  ],
  yachtEngines: "Fixture marine engine with onboard electric generator",
  fuel_consumption: 6,
  fuel_consumption_unit: "1",
  accommodations: {
    accommodations_details: "<p>Enjoy the shaded aft deck and a private ensuite in every guest cabin.</p><p>Relax in the salon after a day on the water.</p>",
    details: "For 9 and 10 pax, guests must be under the age of 10 upon prior approval is gained.",
    stabilizers: "No",
    stabilizers_code: "none",
  },
  seasons: [{
    title: "Fixture season", base_price: 12000, currency: "USD",
    charter_type: "all inclusive", location_areas: ["Caribbean Virgin Islands (BVI)"],
    ...futureDates,
    start_date: "2000-01-01",
    prices: [{ paxes: 2, price: 12000 }, { paxes: 10, price: 15500 }],
    preferred_pickup: "Tortola - Manuel Reef",
    location_details: "BVI Ports and BVI pick up/drop off only",
    has_apa: true,
    apa: 5,
    turnaround_hours: 72,
    additional_rate_details: "<p>Minimum seven nights. Confirm holiday dates before booking.</p>",
  }],
  reviews: [{
    title: "A great week | May 1–8, 2026",
    description: "<p>Wonderful crew &amp; sailing.</p><script>unexpected content</script>",
    updateDate: "2026-09-03T19:40:23.396000",
  }],
  crewDetails: [{ crewName: "Fixture Captain", crewPosition: "Captain - Rotational" }],
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
  { ...catalogueYacht, id: "d".repeat(24), yachtName: "Closest Match", charter_type: "generic catalogue terms" },
  { ...catalogueYacht, id: "e".repeat(24), yachtName: "Second Match", length: 62, min_price: 13000 },
  { ...catalogueYacht, id: "f".repeat(24), yachtName: "Third Match", length: 63, min_price: 14000 },
  { ...catalogueYacht, id: "1".repeat(24), yachtName: "Fourth Match", length: 64, min_price: 14800 },
  { ...catalogueYacht, id: "2".repeat(24), yachtName: "Broader Match", pax: 10, length: 80, min_price: 15900 },
  { ...catalogueYacht, id: "3".repeat(24), yachtName: "Power Cat", yachtType: "powercat" },
  { ...catalogueYacht, id: "4".repeat(24), yachtName: "Different Currency", currency: "EUR" },
  { ...catalogueYacht, id: "5".repeat(24), yachtName: "Different Terms", charter_type: "plus expenses" },
  { ...catalogueYacht, id: "6".repeat(24), yachtName: "Expired Rate", min_price: 11900 },
  { ...catalogueYacht, id: "6a023831ce6b8709506dfeed", yachtName: "Misclassified Trimaran" },
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
  if (url.pathname.startsWith("/yachts_get/")) {
    const listing = catalogue.find((record) => url.pathname.endsWith(`/${record.id}`));
    if (listing) {
      const dates = listing.yachtName === "Expired Rate" ? { start_date: "2000-01-01", end_date: "2000-12-31" } : futureDates;
      return Promise.resolve(Response.json({
        ...listing,
        seasons: [{
          ...dates,
          base_price: listing.min_price,
          currency: listing.currency,
          charter_type: listing.yachtName === "Closest Match" ? "allinclusive" : listing.charter_type,
          location_areas: listing.seasonAreas,
        }],
      }));
    }
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
