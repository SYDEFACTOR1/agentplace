import { z } from 'zod';

// Service types available at Apex Mobility
export const ServiceTypeEnum = z.enum([
  'standard_tuneup',
  'ebike_diagnostic',
  'brake_overhaul',
  'drivetrain_cleaning',
  'custom_wheel_build',
  'battery_health_check'
]);
export type ServiceType = z.infer<typeof ServiceTypeEnum>;

// Urgency tier
export const UrgencyEnum = z.enum(['standard', 'express', 'emergency_same_day']);
export type UrgencyTier = z.infer<typeof UrgencyEnum>;

// Query schema for checking availability
export const AvailabilityQuerySchema = z.object({
  serviceType: ServiceTypeEnum.optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
  location: z.enum(['downtown', 'westside', 'metro_hub']).default('downtown')
});

// Order lookup schema
export const OrderLookupSchema = z.object({
  orderId: z.string().min(3, 'Order ID must be at least 3 characters')
});

// Quote calculation request schema
export const QuoteRequestSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required').optional(),
  bikeModel: z.string().min(2, 'Bike model description is required'),
  isElectric: z.boolean().default(false),
  serviceTypes: z.array(ServiceTypeEnum).min(1, 'Select at least one service'),
  urgency: UrgencyEnum.default('standard'),
  pickupRequired: z.boolean().default(false),
  promoCode: z.string().optional()
});

// Booking request schema
export const BookingRequestSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(7, 'Valid phone number is required'),
  serviceType: ServiceTypeEnum,
  location: z.enum(['downtown', 'westside', 'metro_hub']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  timeSlot: z.string().min(4, 'Valid time slot is required (e.g., "10:00 AM")'),
  bikeModel: z.string().min(2, 'Bike model details are required'),
  notes: z.string().optional()
});
