import { ServiceType, UrgencyTier } from '../schemas/api.schemas';

export interface ServiceDetail {
  id: ServiceType;
  name: string;
  category: 'maintenance' | 'diagnostics' | 'repair' | 'upgrade';
  basePrice: number;
  durationMinutes: number;
  description: string;
  partsIncluded: string[];
}

export interface WorkshopSlot {
  id: string;
  location: 'downtown' | 'westside' | 'metro_hub';
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:00 AM"
  technician: string;
  available: boolean;
  supportedServices: ServiceType[];
}

export interface OrderTimelineEvent {
  timestamp: string;
  status: string;
  note: string;
  updatedBy: string;
}

export interface RepairOrder {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bikeModel: string;
  isElectric: boolean;
  serviceTypes: ServiceType[];
  location: 'downtown' | 'westside' | 'metro_hub';
  status: 'checked_in' | 'in_progress' | 'waiting_for_parts' | 'quality_inspection' | 'ready_for_pickup' | 'completed';
  totalAmount: number;
  depositPaid: number;
  balanceDue: number;
  assignedTechnician: string;
  technicianNotes: string;
  estimatedCompletion: string;
  timeline: OrderTimelineEvent[];
  createdAt: string;
}

export interface CalculatedQuote {
  quoteId: string;
  customerName: string;
  bikeModel: string;
  isElectric: boolean;
  servicesBreakdown: Array<{
    service: string;
    description: string;
    basePrice: number;
  }>;
  subtotal: number;
  ebikeSurcharge: number;
  urgencyTier: UrgencyTier;
  urgencyMultiplier: number;
  urgencyFee: number;
  pickupFee: number;
  discountApplied: number;
  discountCode?: string;
  tax: number;
  finalTotal: number;
  estimatedTurnaroundHours: number;
  validUntil: string;
  nextAvailableSlot: string;
}

class MockDatabase {
  public services: Record<ServiceType, ServiceDetail> = {
    standard_tuneup: {
      id: 'standard_tuneup',
      name: 'Comprehensive Standard Tune-Up',
      category: 'maintenance',
      basePrice: 89.00,
      durationMinutes: 75,
      description: 'Precision drivetrain degreasing, gear tuning, barrel adjuster alignment, cable tensioning, and 30-point safety check.',
      partsIncluded: ['Lubricant', 'Cable end caps']
    },
    ebike_diagnostic: {
      id: 'ebike_diagnostic',
      name: 'E-Bike Full Electrical Diagnostic',
      category: 'diagnostics',
      basePrice: 119.00,
      durationMinutes: 90,
      description: 'Firmware diagnostic scan, torque & cadence sensor calibration, battery harness continuity test, and motor telemetry check.',
      partsIncluded: ['Diagnostic report certificate', 'Firmware patch']
    },
    brake_overhaul: {
      id: 'brake_overhaul',
      name: 'Hydraulic & Mechanical Brake Overhaul',
      category: 'repair',
      basePrice: 95.00,
      durationMinutes: 60,
      description: 'Dual hydraulic brake bleed with mineral oil/DOT 5.1, pad wear measurement, rotor truing, and lever modulation reset.',
      partsIncluded: ['Hydraulic fluid', 'Caliper shims']
    },
    drivetrain_cleaning: {
      id: 'drivetrain_cleaning',
      name: 'Ultrasonic Drivetrain Stripping & Waxing',
      category: 'maintenance',
      basePrice: 65.00,
      durationMinutes: 45,
      description: 'Deep ultrasonic solvent bath for chain, cassette, and chainrings, finished with race-grade hot-melt molten wax dip.',
      partsIncluded: ['Ultrasonic solvent', 'Hot-melt wax']
    },
    custom_wheel_build: {
      id: 'custom_wheel_build',
      name: 'Custom Wheel Truing & Spoke Tensioning',
      category: 'repair',
      basePrice: 125.00,
      durationMinutes: 90,
      description: 'Digital tensiometer truing, lateral/radial runout correction (<0.2mm tolerance), and hub bearing preload adjustment.',
      partsIncluded: ['Spoke nipples', 'Rim tape']
    },
    battery_health_check: {
      id: 'battery_health_check',
      name: 'Li-Ion Battery Capacity & Cell Balance Test',
      category: 'diagnostics',
      basePrice: 75.00,
      durationMinutes: 60,
      description: 'Controlled load cycle discharge test, internal cell impedance analysis, BMS status inspection, and thermal profiling.',
      partsIncluded: ['Battery state-of-health graph']
    }
  };

  public orders: Map<string, RepairOrder> = new Map();
  public slots: WorkshopSlot[] = [];

  constructor() {
    this.seedOrders();
    this.seedSlots();
  }

  private seedOrders() {
    const ordersList: RepairOrder[] = [
      {
        orderId: 'ORD-8821',
        customerName: 'Marcus Vance',
        customerEmail: 'marcus.v@example.com',
        customerPhone: '+1 (555) 349-8812',
        bikeModel: 'Specialized Turbo Vado 5.0 (E-Bike)',
        isElectric: true,
        serviceTypes: ['ebike_diagnostic', 'brake_overhaul'],
        location: 'downtown',
        status: 'in_progress',
        totalAmount: 214.00,
        depositPaid: 50.00,
        balanceDue: 164.00,
        assignedTechnician: 'Dmitri Rostov (Lead E-Tech)',
        technicianNotes: 'Diagnostic scan showed motor firmware version 3.2.1 is up-to-date. Currently bleeding rear Shimano 4-piston hydraulic caliper. Rotor trued to 0.15mm tolerance.',
        estimatedCompletion: 'Today at 5:00 PM PST',
        createdAt: '2026-11-16T09:15:00Z',
        timeline: [
          {
            timestamp: '2026-11-16T09:15:00Z',
            status: 'checked_in',
            note: 'Bike received at Downtown workshop counter. Front brake lever spongy.',
            updatedBy: 'Front Desk'
          },
          {
            timestamp: '2026-11-16T11:30:00Z',
            status: 'in_progress',
            note: 'Diagnostic initiated by Dmitri. Sensor telemetry within spec.',
            updatedBy: 'Dmitri Rostov'
          }
        ]
      },
      {
        orderId: 'ORD-7749',
        customerName: 'Sarah Jenkins',
        customerEmail: 's.jenkins@example.com',
        customerPhone: '+1 (555) 778-9921',
        bikeModel: 'Trek Domane SL 7 (Carbon Road)',
        isElectric: false,
        serviceTypes: ['standard_tuneup', 'drivetrain_cleaning'],
        location: 'westside',
        status: 'ready_for_pickup',
        totalAmount: 154.00,
        depositPaid: 154.00,
        balanceDue: 0.00,
        assignedTechnician: 'Elena Chen (Senior Mech)',
        technicianNotes: 'Complete tune-up finished. Drivetrain stripped and hot-waxed. Electronic shifting calibrated, derailleur hanger verified straight. Test ride completed smoothly.',
        estimatedCompletion: 'Ready now for pickup',
        createdAt: '2026-11-15T14:20:00Z',
        timeline: [
          {
            timestamp: '2026-11-15T14:20:00Z',
            status: 'checked_in',
            note: 'Brought in for pre-race full service.',
            updatedBy: 'Elena Chen'
          },
          {
            timestamp: '2026-11-16T10:00:00Z',
            status: 'quality_inspection',
            note: 'All safety torque checks passed at 5Nm on cockpit & 12Nm on crankset.',
            updatedBy: 'Elena Chen'
          },
          {
            timestamp: '2026-11-16T13:45:00Z',
            status: 'ready_for_pickup',
            note: 'Stored on Rack B-12. Notification sent to customer.',
            updatedBy: 'Workshop Dispatch'
          }
        ]
      },
      {
        orderId: 'ORD-9912',
        customerName: 'David Kalu',
        customerEmail: 'dkalu@example.com',
        customerPhone: '+1 (555) 902-3341',
        bikeModel: 'Riese & Müller Superdelite DualBattery',
        isElectric: true,
        serviceTypes: ['battery_health_check'],
        location: 'metro_hub',
        status: 'waiting_for_parts',
        totalAmount: 95.00,
        depositPaid: 30.00,
        balanceDue: 65.00,
        assignedTechnician: 'Leo Alvarez',
        technicianNotes: 'Primary Bosch PowerTube 625 checked at 94% State of Health. Secondary battery harness lock cylinder requires replacement. OEM Bosch replacement lock keyed to frame has been ordered.',
        estimatedCompletion: 'Tomorrow, Nov 17 at 2:00 PM PST',
        createdAt: '2026-11-15T16:00:00Z',
        timeline: [
          {
            timestamp: '2026-11-15T16:00:00Z',
            status: 'checked_in',
            note: 'Customer reported intermittent second battery disconnect.',
            updatedBy: 'Leo Alvarez'
          },
          {
            timestamp: '2026-11-16T11:00:00Z',
            status: 'waiting_for_parts',
            note: 'Bosch lock subassembly ordered from regional distributor (Tracking: DHL-49102).',
            updatedBy: 'Leo Alvarez'
          }
        ]
      },
      {
        orderId: 'ORD-3304',
        customerName: 'Aria Montgomery',
        customerEmail: 'aria.m@example.com',
        customerPhone: '+1 (555) 441-2098',
        bikeModel: 'Cannondale Topstone Carbon Lefty',
        isElectric: false,
        serviceTypes: ['custom_wheel_build'],
        location: 'downtown',
        status: 'completed',
        totalAmount: 125.00,
        depositPaid: 125.00,
        balanceDue: 0.00,
        assignedTechnician: 'Dmitri Rostov',
        technicianNotes: 'Rear wheel rebuilt with DT Swiss Competition double-butted spokes. Spoke tension balanced evenly across drive and non-drive sides. Customer picked up.',
        estimatedCompletion: 'Completed',
        createdAt: '2026-11-14T10:00:00Z',
        timeline: [
          {
            timestamp: '2026-11-14T10:00:00Z',
            status: 'checked_in',
            note: 'Broken spoke replacement and rim true.',
            updatedBy: 'Front Desk'
          },
          {
            timestamp: '2026-11-15T16:30:00Z',
            status: 'completed',
            note: 'Customer inspected and collected the bike.',
            updatedBy: 'Front Desk'
          }
        ]
      }
    ];

    for (const order of ordersList) {
      this.orders.set(order.orderId.toUpperCase(), order);
    }
  }

  private seedSlots() {
    const dates = ['2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19'];
    const times = ['09:00 AM', '11:00 AM', '01:30 PM', '03:30 PM', '05:00 PM'];
    const locations: Array<'downtown' | 'westside' | 'metro_hub'> = ['downtown', 'westside', 'metro_hub'];
    const technicians = ['Dmitri Rostov', 'Elena Chen', 'Leo Alvarez', 'Maya Lin'];

    let count = 1;
    for (const date of dates) {
      for (const loc of locations) {
        for (let i = 0; i < times.length; i++) {
          const time = times[i];
          // Seed some slots as booked to simulate real-time dynamic availability
          const isAvailable = !((count % 3 === 0) || (date === '2026-11-16' && i < 2));
          this.slots.push({
            id: `SLOT-${1000 + count}`,
            location: loc,
            date,
            timeSlot: time,
            technician: technicians[(count + i) % technicians.length],
            available: isAvailable,
            supportedServices: Object.keys(this.services) as ServiceType[]
          });
          count++;
        }
      }
    }
  }

  public getOrder(orderId: string): RepairOrder | undefined {
    return this.orders.get(orderId.trim().toUpperCase());
  }

  public getAvailability(params: {
    serviceType?: ServiceType;
    date?: string;
    location?: 'downtown' | 'westside' | 'metro_hub';
  }): WorkshopSlot[] {
    const loc = params.location || 'downtown';
    const targetDate = params.date || '2026-11-17'; // default to tomorrow if unspecified

    return this.slots.filter(slot => {
      const matchLoc = slot.location === loc;
      const matchDate = slot.date === targetDate;
      const matchService = params.serviceType ? slot.supportedServices.includes(params.serviceType) : true;
      return matchLoc && matchDate && matchService && slot.available;
    });
  }

  public calculateQuote(params: {
    customerName: string;
    customerEmail?: string;
    bikeModel: string;
    isElectric: boolean;
    serviceTypes: ServiceType[];
    urgency: UrgencyTier;
    pickupRequired: boolean;
    promoCode?: string;
  }): CalculatedQuote {
    let subtotal = 0;
    const servicesBreakdown = params.serviceTypes.map(st => {
      const detail = this.services[st];
      subtotal += detail ? detail.basePrice : 50;
      return {
        service: detail ? detail.name : st,
        description: detail ? detail.description : 'Custom service',
        basePrice: detail ? detail.basePrice : 50
      };
    });

    // E-bike surcharge for battery/wiring precautions
    const ebikeSurcharge = params.isElectric ? 25.00 : 0.00;

    // Urgency multipliers
    let urgencyMultiplier = 1.0;
    let urgencyFee = 0.00;
    let turnaroundHours = 24;

    if (params.urgency === 'express') {
      urgencyMultiplier = 1.25;
      urgencyFee = Math.round((subtotal * 0.25) * 100) / 100;
      turnaroundHours = 8;
    } else if (params.urgency === 'emergency_same_day') {
      urgencyMultiplier = 1.50;
      urgencyFee = Math.round((subtotal * 0.50) * 100) / 100;
      turnaroundHours = 3;
    }

    const pickupFee = params.pickupRequired ? 35.00 : 0.00;

    // Promo codes
    let discountApplied = 0.00;
    const promo = (params.promoCode || '').trim().toUpperCase();
    if (promo === 'WELCOME10') {
      discountApplied = Math.round((subtotal * 0.10) * 100) / 100;
    } else if (promo === 'APEX20') {
      discountApplied = Math.round((subtotal * 0.20) * 100) / 100;
    }

    const taxableAmount = Math.max(0, subtotal + ebikeSurcharge + urgencyFee + pickupFee - discountApplied);
    const tax = Math.round((taxableAmount * 0.0825) * 100) / 100; // 8.25% sales tax
    const finalTotal = Math.round((taxableAmount + tax) * 100) / 100;

    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + 7);

    return {
      quoteId: `QTE-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: params.customerName,
      bikeModel: params.bikeModel,
      isElectric: params.isElectric,
      servicesBreakdown,
      subtotal: Math.round(subtotal * 100) / 100,
      ebikeSurcharge,
      urgencyTier: params.urgency,
      urgencyMultiplier,
      urgencyFee,
      pickupFee,
      discountApplied,
      discountCode: discountApplied > 0 ? promo : undefined,
      tax,
      finalTotal,
      estimatedTurnaroundHours: turnaroundHours,
      validUntil: validUntilDate.toISOString().split('T')[0],
      nextAvailableSlot: 'Tomorrow at 09:00 AM (Downtown Hub)'
    };
  }

  public bookSlot(params: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceType: ServiceType;
    location: 'downtown' | 'westside' | 'metro_hub';
    date: string;
    timeSlot: string;
    bikeModel: string;
    notes?: string;
  }): { success: boolean; bookingId: string; order: RepairOrder } {
    // Mark slot as booked if exists
    const slot = this.slots.find(
      s => s.location === params.location && s.date === params.date && s.timeSlot === params.timeSlot
    );
    if (slot) {
      slot.available = false;
    }

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const serviceDetail = this.services[params.serviceType];
    const totalAmount = serviceDetail ? serviceDetail.basePrice : 89.00;

    const newOrder: RepairOrder = {
      orderId,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      bikeModel: params.bikeModel,
      isElectric: params.bikeModel.toLowerCase().includes('ebike') || params.bikeModel.toLowerCase().includes('e-bike'),
      serviceTypes: [params.serviceType],
      location: params.location,
      status: 'checked_in',
      totalAmount,
      depositPaid: 0.00,
      balanceDue: totalAmount,
      assignedTechnician: slot ? slot.technician : 'Dmitri Rostov',
      technicianNotes: params.notes || 'Awaiting bike intake inspection at workshop.',
      estimatedCompletion: `${params.date} at ${params.timeSlot}`,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          timestamp: new Date().toISOString(),
          status: 'booked',
          note: `Appointment confirmed for ${params.date} ${params.timeSlot} at ${params.location} location.`,
          updatedBy: 'Agentplace Assistant'
        }
      ]
    };

    this.orders.set(orderId, newOrder);

    return {
      success: true,
      bookingId: orderId,
      order: newOrder
    };
  }
}

export const db = new MockDatabase();
