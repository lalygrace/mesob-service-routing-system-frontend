export type Authority = {
  id: string;
  name: string;
  nameAm: string;
  nameOm: string;
  abbreviation: string;
  abbreviationAm: string;
  abbreviationOm: string;
  description?: string;
  floor: string;
  room?: string;
  serviceCount: number;
  createdAt: string;
};

export const MOCK_AUTHORITIES: Authority[] = [
  {
    id: "auth-identity",
    name: "National ID Authority",
    nameAm: "ብሔራዊ መታወቂያ ባለስልጣን",
    nameOm: "Abbaa Taayitaa Eenyummaa Biyyaalessaa",
    abbreviation: "NIDA",
    abbreviationAm: "ብመባ",
    abbreviationOm: "ATEB",
    description:
      "Handles all national identity document services including issuance, replacement, and corrections.",
    floor: "Floor 1",
    room: "Counter A & B",
    serviceCount: 4,
    createdAt: "2025-01-15",
  },
  {
    id: "auth-passport",
    name: "Immigration & Passport Services",
    nameAm: "ኢሚግሬሽንና ፓስፖርት አገልግሎት",
    nameOm: "Tajaajila Imigreeshinii fi Paaspootii",
    abbreviation: "IPS",
    abbreviationAm: "ኢፓአ",
    abbreviationOm: "TIP",
    description:
      "Manages passport issuance, renewal, and immigration-related services.",
    floor: "Floor 2",
    room: "Room 12",
    serviceCount: 1,
    createdAt: "2025-01-15",
  },
  {
    id: "auth-business",
    name: "Business Registration & Licensing",
    nameAm: "የንግድ ምዝገባና ፈቃድ",
    nameOm: "Galmee fi Hayyama Daldalaa",
    abbreviation: "BRL",
    abbreviationAm: "ንምፈ",
    abbreviationOm: "GHD",
    description:
      "Oversees business registration, trade licensing, and commercial permits.",
    floor: "Floor 3",
    room: "Desk 5",
    serviceCount: 1,
    createdAt: "2025-02-01",
  },
  {
    id: "auth-transport",
    name: "Transport Authority",
    nameAm: "የትራንስፖርት ባለስልጣን",
    nameOm: "Abbaa Taayitaa Geejjibaa",
    abbreviation: "TA",
    abbreviationAm: "ትባ",
    abbreviationOm: "ATG",
    description:
      "Manages driving licenses, vehicle registration, and transport permits.",
    floor: "Floor 2",
    room: "Counter C",
    serviceCount: 1,
    createdAt: "2025-02-01",
  },
  {
    id: "auth-revenue",
    name: "Revenue & Customs Authority",
    nameAm: "ገቢዎችና ጉምሩክ ባለስልጣን",
    nameOm: "Abbaa Taayitaa Galii fi Guumrukii",
    abbreviation: "RCA",
    abbreviationAm: "ገጉባ",
    abbreviationOm: "ATGG",
    description:
      "Handles tax registration, TIN issuance, and customs declarations.",
    floor: "Floor 1",
    room: "Room 3",
    serviceCount: 1,
    createdAt: "2025-03-01",
  },
  {
    id: "auth-labor",
    name: "Ministry of Labor & Social Affairs",
    nameAm: "የሠራተኛና ማህበራዊ ጉዳይ ሚኒስቴር",
    nameOm: "Ministeera Hojii fi Dhimma Hawaasummaa",
    abbreviation: "MoLSA",
    abbreviationAm: "ሠማጉሚ",
    abbreviationOm: "MHDH",
    description:
      "Provides employment services, work permits, and social affairs assistance.",
    floor: "Floor 4",
    room: "Room 8",
    serviceCount: 0,
    createdAt: "2025-04-01",
  },
];
