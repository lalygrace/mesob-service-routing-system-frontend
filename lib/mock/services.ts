export type Service = {
  id: string;
  title: string;
  authority: string;
  locationHint: string;
  feeHint: string;
  durationHint: string;
  requirements: string[];
};

export const MOCK_SERVICES: Service[] = [
  {
    id: "id-lost",
    title: "Replace a lost ID",
    authority: "Identity Services (placeholder)",
    locationHint: "Floor 1 • Counter A (placeholder)",
    feeHint: "Varies (placeholder)",
    durationHint: "Same day (placeholder)",
    requirements: [
      "Police report (if required)",
      "Passport-size photo",
      "Any supporting identification",
    ],
  },
  {
    id: "id-correction",
    title: "Correct ID information",
    authority: "Identity Services (placeholder)",
    locationHint: "Floor 1 • Counter B (placeholder)",
    feeHint: "Varies (placeholder)",
    durationHint: "1–3 days (placeholder)",
    requirements: [
      "Current ID",
      "Proof document for correction",
      "Application form",
    ],
  },
  {
    id: "passport-renew",
    title: "Renew an expired passport",
    authority: "Passport Services (placeholder)",
    locationHint: "Floor 2 • Room 12 (placeholder)",
    feeHint: "Varies (placeholder)",
    durationHint: "Several days (placeholder)",
    requirements: ["Old passport", "Photos", "Payment receipt"],
  },
  {
    id: "business-start",
    title: "Start a business (registration)",
    authority: "Business Services (placeholder)",
    locationHint: "Floor 3 • Desk 5 (placeholder)",
    feeHint: "Varies (placeholder)",
    durationHint: "1–2 days (placeholder)",
    requirements: ["Owner ID", "Business name options", "Address proof"],
  },
  {
    id: "drivers-license",
    title: "Driving license service",
    authority: "Transport Services (placeholder)",
    locationHint: "Floor 2 • Counter C (placeholder)",
    feeHint: "Varies (placeholder)",
    durationHint: "Varies (placeholder)",
    requirements: ["Owner ID", "Medical check (if required)", "Photos"],
  },
  {
    id: "tax-registration",
    title: "Tax registration",
    authority: "Revenue Services (placeholder)",
    locationHint: "Floor 1 • Room 3 (placeholder)",
    feeHint: "Often free (placeholder)",
    durationHint: "Same day (placeholder)",
    requirements: ["Owner ID", "Contact phone number", "Address"],
  },
];
