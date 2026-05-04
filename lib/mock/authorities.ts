export type Authority = {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  floor: string;
  room: string;
  contactPhone: string;
  serviceCount: number;
  status: "active" | "inactive";
  createdAt: string;
};

export const MOCK_AUTHORITIES: Authority[] = [
  {
    id: "auth-identity",
    name: "National ID Authority",
    abbreviation: "NIDA",
    description:
      "Handles all national identity document services including issuance, replacement, and corrections.",
    floor: "Floor 1",
    room: "Counter A & B",
    contactPhone: "+251-111-234567",
    serviceCount: 4,
    status: "active",
    createdAt: "2025-01-15",
  },
  {
    id: "auth-passport",
    name: "Immigration & Passport Services",
    abbreviation: "IPS",
    description:
      "Manages passport issuance, renewal, and immigration-related services.",
    floor: "Floor 2",
    room: "Room 12",
    contactPhone: "+251-111-345678",
    serviceCount: 1,
    status: "active",
    createdAt: "2025-01-15",
  },
  {
    id: "auth-business",
    name: "Business Registration & Licensing",
    abbreviation: "BRL",
    description:
      "Oversees business registration, trade licensing, and commercial permits.",
    floor: "Floor 3",
    room: "Desk 5",
    contactPhone: "+251-111-456789",
    serviceCount: 1,
    status: "active",
    createdAt: "2025-02-01",
  },
  {
    id: "auth-transport",
    name: "Transport Authority",
    abbreviation: "TA",
    description:
      "Manages driving licenses, vehicle registration, and transport permits.",
    floor: "Floor 2",
    room: "Counter C",
    contactPhone: "+251-111-567890",
    serviceCount: 1,
    status: "active",
    createdAt: "2025-02-01",
  },
  {
    id: "auth-revenue",
    name: "Revenue & Customs Authority",
    abbreviation: "RCA",
    description:
      "Handles tax registration, TIN issuance, and customs declarations.",
    floor: "Floor 1",
    room: "Room 3",
    contactPhone: "+251-111-678901",
    serviceCount: 1,
    status: "active",
    createdAt: "2025-03-01",
  },
  {
    id: "auth-labor",
    name: "Ministry of Labor & Social Affairs",
    abbreviation: "MoLSA",
    description:
      "Provides employment services, work permits, and social affairs assistance.",
    floor: "Floor 4",
    room: "Room 8",
    contactPhone: "+251-111-789012",
    serviceCount: 0,
    status: "inactive",
    createdAt: "2025-04-01",
  },
];
