import { Request, Response } from 'express';
import { db } from '../data/mockDatabase';
import { QuoteRequestSchema } from '../schemas/api.schemas';

export const calculateQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = QuoteRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid quote request payload',
        details: parseResult.error.format()
      });
      return;
    }

    const data = parseResult.data;
    const quote = db.calculateQuote({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      bikeModel: data.bikeModel,
      isElectric: data.isElectric,
      serviceTypes: data.serviceTypes,
      urgency: data.urgency,
      pickupRequired: data.pickupRequired,
      promoCode: data.promoCode
    });

    res.status(200).json({
      success: true,
      quote: {
        quoteId: quote.quoteId,
        customerName: quote.customerName,
        bikeModel: quote.bikeModel,
        isElectric: quote.isElectric,
        itemizedServices: quote.servicesBreakdown,
        pricing: {
          subtotal: `$${quote.subtotal.toFixed(2)}`,
          ebikeSafetySurcharge: `$${quote.ebikeSurcharge.toFixed(2)}`,
          urgencyTier: quote.urgencyTier,
          urgencyFee: `$${quote.urgencyFee.toFixed(2)}`,
          pickupAndDelivery: `$${quote.pickupFee.toFixed(2)}`,
          discountApplied: `-$${quote.discountApplied.toFixed(2)}`,
          discountCode: quote.discountCode || 'None',
          salesTax: `$${quote.tax.toFixed(2)}`,
          estimatedTotal: `$${quote.finalTotal.toFixed(2)}`
        },
        turnaround: {
          estimatedHours: quote.estimatedTurnaroundHours,
          summary: `${quote.estimatedTurnaroundHours} hours turnaround`
        },
        validUntil: quote.validUntil,
        recommendedNextStep: 'Confirm booking to lock in this price and reserve your workshop bay.'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate quote',
      message: (error as Error).message
    });
  }
};
