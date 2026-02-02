import { z } from "zod";
import { createOrganizationSchema } from "../organization/organization.dto";

export const onboardingSchema = createOrganizationSchema;

export type OnboardingInput = z.infer<typeof onboardingSchema>;
