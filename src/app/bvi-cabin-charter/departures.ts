import type { CabinDeparture } from "./CabinBooking";

// MCC supplied the sailing dates and cabin rate. Cabin counts and hold status
// require confirmation from the charter team.
export const publishedDepartures: CabinDeparture[] = [
  {
    id: "ipanema-58-2027-02-27",
    yachtId: "ipanema-58",
    name: "Ipanema 58 · BVI Island Hopping",
    startsOn: "2027-02-27",
    endsOn: "2027-03-06",
    nights: 7,
    status: "available",
    boarding: "Soper’s Hole Marina, West End, Tortola · 27 Feb at 5:00 pm",
    disembarkation: "Soper’s Hole Marina, West End, Tortola · 6 Mar at 9:00 am",
    cabins: [{ id: "double", name: "Double cabin", remaining: null, occupancy: 2, rate: { amount: 7400, currency: "USD", unit: "cabin" } }],
    extras: ["flights", "transfers", "premium drinks", "additional meals ashore", "gratuities"],
    route: [
      "Norman Island for snorkeling at The Caves and an anchorage at The Bight",
      "Salt Island and The Baths on Virgin Gorda",
      "Anegada for Loblolly Beach and optional lobster ashore",
      "Mountain Point and an evening at Marina Cay",
      "Monkey Point on Guana Island and White Bay, Jost Van Dyke",
      "Soper’s Hole and Peter Island",
      "Return to Soper’s Hole Marina, Tortola",
    ],
  },
];
