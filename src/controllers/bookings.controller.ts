import { Request, Response } from 'express';
import { db } from '../data/mockDatabase';
import { BookingRequestSchema } from '../schemas/api.schemas';

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = BookingRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid booking reservation request',
        details: parseResult.error.format()
      });
      return;
    }

    const data = parseResult.data;
    const result = db.bookSlot({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      serviceType: data.serviceType,
      location: data.location,
      date: data.date,
      timeSlot: data.timeSlot,
      bikeModel: data.bikeModel,
      notes: data.notes
    });

    res.status(201).json({
      success: true,
      message: 'Service appointment successfully scheduled and confirmed!',
      booking: {
        orderId: result.bookingId,
        customerName: result.order.customerName,
        service: db.services[data.serviceType]?.name || data.serviceType,
        location: result.order.location,
        appointmentDate: data.date,
        timeSlot: data.timeSlot,
        assignedTechnician: result.order.assignedTechnician,
        estimatedTotal: `$${result.order.totalAmount.toFixed(2)}`,
        status: result.order.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create booking',
      message: (error as Error).message
    });
  }
};
