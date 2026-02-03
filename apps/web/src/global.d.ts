export {};

declare global {
  export type Organization = {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    timezone: string;
    locale: string;
    currency: string;
    whiteLabel: boolean;
    branding: Record<string, any>;
    billingInfo: Record<string, any>;
    settings: Record<string, any>;
  };
}
