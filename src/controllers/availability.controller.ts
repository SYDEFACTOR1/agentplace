import { Request, Response } from 'express';
import { db } from '../data/mockDatabase';
import { AvailabilityQuerySchema } from '../schemas/api.schemas';

export const getAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = AvailabilityQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: parseResult.error.format()
      });
      return;
    }

    const { serviceType, date, location } = parseResult.data;
    const availableSlots = db.getAvailability({ serviceType, date, location });

    res.status(200).json({
      success: true,
      meta: {
        location,
        queriedDate: date || 'next available',
        serviceType: serviceType || 'all services',
        totalSlotsFound: availableSlots.length
      },
      slots: availableSlots.map(s => ({
        slotId: s.id,
        date: s.date,
        timeSlot: s.timeSlot,
        location: s.location,
        leadTechnician: s.technician,
        isAvailable: s.available
      })),
      catalogServices: Object.values(db.services).map(s => ({
        id: s.id,
        name: s.name,
        basePrice: `$${s.basePrice.toFixed(2)}`,
        durationMinutes: s.durationMinutes,
        description: s.description
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve availability',
      message: (error as Error).message
    });
  }
};
