import { Request, Response } from 'express';
import { db } from '../data/mockDatabase';
import { OrderLookupSchema } from '../schemas/api.schemas';

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = OrderLookupSchema.safeParse(req.params);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid order ID format',
        details: parseResult.error.format()
      });
      return;
    }

    const { orderId } = parseResult.data;
    const order = db.getOrder(orderId);

    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found',
        message: `No active repair order or booking found matching ID "${orderId}". Please check the order number (e.g. ORD-8821, ORD-7749, ORD-9912).`
      });
      return;
    }

    res.status(200).json({
      success: true,
      order: {
        orderId: order.orderId,
        customerName: order.customerName,
        bikeModel: order.bikeModel,
        isElectric: order.isElectric,
        status: order.status,
        statusDisplay: formatStatus(order.status),
        location: order.location,
        assignedTechnician: order.assignedTechnician,
        technicianNotes: order.technicianNotes,
        estimatedCompletion: order.estimatedCompletion,
        financials: {
          totalAmount: `$${order.totalAmount.toFixed(2)}`,
          depositPaid: `$${order.depositPaid.toFixed(2)}`,
          balanceDue: `$${order.balanceDue.toFixed(2)}`
        },
        services: order.serviceTypes.map(st => db.services[st]?.name || st),
        timeline: order.timeline
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve order status',
      message: (error as Error).message
    });
  }
};

export const listRecentOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const allOrders = Array.from(db.orders.values()).map(o => ({
      orderId: o.orderId,
      customerName: o.customerName,
      bikeModel: o.bikeModel,
      status: o.status,
      statusDisplay: formatStatus(o.status),
      estimatedCompletion: o.estimatedCompletion
    }));

    res.status(200).json({
      success: true,
      count: allOrders.length,
      orders: allOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to list orders',
      message: (error as Error).message
    });
  }
};

function formatStatus(status: string): string {
  switch (status) {
    case 'checked_in':
      return 'Bike Checked In - Initial Inspection Pending';
    case 'in_progress':
      return 'In Progress - Technician Working on Bike';
    case 'waiting_for_parts':
      return 'Awaiting OEM Replacement Parts';
    case 'quality_inspection':
      return 'Under Final Safety & Quality Inspection';
    case 'ready_for_pickup':
      return 'Ready for Customer Pickup';
    case 'completed':
      return 'Order Completed & Handed Over';
    default:
      return status;
  }
}
