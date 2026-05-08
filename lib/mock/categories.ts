export type Category = {
  id: string;
  slug: string;
  name: string;
  iconName?: string;
  sortOrder: number;
  isActive: boolean;
  serviceCount: number;
  createdAt: string;
};

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    slug: "identity-services",
    name: "Identity Services",
    iconName: "🆔",
    sortOrder: 1,
    isActive: true,
    serviceCount: 4,
    createdAt: "2024-01-15",
  },
  {
    id: "cat-2",
    slug: "passport-services",
    name: "Passport Services",
    iconName: "🛂",
    sortOrder: 2,
    isActive: true,
    serviceCount: 2,
    createdAt: "2024-01-15",
  },
  {
    id: "cat-3",
    slug: "business-services",
    name: "Business Services",
    iconName: "💼",
    sortOrder: 3,
    isActive: true,
    serviceCount: 3,
    createdAt: "2024-01-15",
  },
  {
    id: "cat-4",
    slug: "transport-services",
    name: "Transport Services",
    iconName: "🚗",
    sortOrder: 4,
    isActive: true,
    serviceCount: 2,
    createdAt: "2024-01-15",
  },
  {
    id: "cat-5",
    slug: "revenue-services",
    name: "Revenue Services",
    iconName: "💰",
    sortOrder: 5,
    isActive: true,
    serviceCount: 2,
    createdAt: "2024-01-15",
  },
];
