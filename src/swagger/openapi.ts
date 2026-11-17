export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Apex Mobility & Cycle Works Agent API',
    description: 'REST API microservice providing real-time workshop availability, repair order tracking, and dynamic service quotation for Agentplace AI Agents.',
    version: '1.0.0',
    contact: {
      name: 'Engineering Team',
      email: 'engineering@apexmobility.io'
    }
  },
  servers: [
    {
      url: '/',
      description: 'Current environment server'
    }
  ],
  paths: {
    '/api/v1/availability': {
      get: {
        operationId: 'checkAvailability',
        summary: 'Check workshop appointment and technician bay availability',
        description: 'Returns available service slots filtered by service type, target date, and workshop location.',
        parameters: [
          {
            name: 'serviceType',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: [
                'standard_tuneup',
                'ebike_diagnostic',
                'brake_overhaul',
                'drivetrain_cleaning',
                'custom_wheel_build',
                'battery_health_check'
              ]
            },
            description: 'The specific maintenance or repair service requested'
          },
          {
            name: 'date',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              format: 'date',
              example: '2026-11-17'
            },
            description: 'Target reservation date in YYYY-MM-DD format'
          },
          {
            name: 'location',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: ['downtown', 'westside', 'metro_hub'],
              default: 'downtown'
            },
            description: 'Workshop location hub'
          }
        ],
        responses: {
          '200': {
            description: 'Available workshop slots and catalog services',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    meta: { type: 'object' },
                    slots: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          slotId: { type: 'string', example: 'SLOT-1004' },
                          date: { type: 'string', example: '2026-11-17' },
                          timeSlot: { type: 'string', example: '09:00 AM' },
                          location: { type: 'string', example: 'downtown' },
                          leadTechnician: { type: 'string', example: 'Dmitri Rostov' },
                          isAvailable: { type: 'boolean', example: true }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/orders/{orderId}': {
      get: {
        operationId: 'getOrderStatus',
        summary: 'Track real-time status of a repair or service order',
        description: 'Retrieves current status, technician notes, parts timeline, and completion ETA for a specific order ID (e.g., ORD-8821, ORD-7749).',
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: 'ORD-8821'
            },
            description: 'The unique tracking order ID'
          }
        ],
        responses: {
          '200': {
            description: 'Order found and details returned',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    order: {
                      type: 'object',
                      properties: {
                        orderId: { type: 'string', example: 'ORD-8821' },
                        customerName: { type: 'string', example: 'Marcus Vance' },
                        bikeModel: { type: 'string', example: 'Specialized Turbo Vado 5.0' },
                        status: { type: 'string', example: 'in_progress' },
                        statusDisplay: { type: 'string', example: 'In Progress - Technician Working on Bike' },
                        assignedTechnician: { type: 'string', example: 'Dmitri Rostov (Lead E-Tech)' },
                        technicianNotes: { type: 'string' },
                        estimatedCompletion: { type: 'string', example: 'Today at 5:00 PM PST' }
                      }
                    }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Order not found'
          }
        }
      }
    },
    '/api/v1/quotes': {
      post: {
        operationId: 'calculatePriceQuote',
        summary: 'Calculate instant dynamic price quotation with itemized breakdown',
        description: 'Calculates base service charges, electric bike safety surcharges, urgency multipliers, and promotional discounts.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['customerName', 'bikeModel', 'serviceTypes'],
                properties: {
                  customerName: { type: 'string', example: 'Jordan Blake' },
                  customerEmail: { type: 'string', example: 'jordan@example.com' },
                  bikeModel: { type: 'string', example: 'Gazelle Medeo T10 HMB' },
                  isElectric: { type: 'boolean', example: true, default: false },
                  serviceTypes: {
                    type: 'array',
                    items: {
                      type: 'string',
                      enum: [
                        'standard_tuneup',
                        'ebike_diagnostic',
                        'brake_overhaul',
                        'drivetrain_cleaning',
                        'custom_wheel_build',
                        'battery_health_check'
                      ]
                    },
                    example: ['standard_tuneup', 'ebike_diagnostic']
                  },
                  urgency: {
                    type: 'string',
                    enum: ['standard', 'express', 'emergency_same_day'],
                    default: 'standard',
                    example: 'standard'
                  },
                  pickupRequired: { type: 'boolean', default: false, example: false },
                  promoCode: { type: 'string', example: 'WELCOME10' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Itemized quotation calculated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    quote: {
                      type: 'object',
                      properties: {
                        quoteId: { type: 'string', example: 'QTE-482194' },
                        pricing: {
                          type: 'object',
                          properties: {
                            subtotal: { type: 'string', example: '$208.00' },
                            ebikeSafetySurcharge: { type: 'string', example: '$25.00' },
                            urgencyFee: { type: 'string', example: '$0.00' },
                            discountApplied: { type: 'string', example: '-$20.80' },
                            estimatedTotal: { type: 'string', example: '$229.71' }
                          }
                        },
                        turnaround: {
                          type: 'object',
                          properties: {
                            estimatedHours: { type: 'number', example: 24 }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/bookings': {
      post: {
        operationId: 'createBooking',
        summary: 'Schedule a workshop appointment slot',
        description: 'Reserves an intake slot and creates a new tracked order in the system.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [
                  'customerName',
                  'customerEmail',
                  'customerPhone',
                  'serviceType',
                  'location',
                  'date',
                  'timeSlot',
                  'bikeModel'
                ],
                properties: {
                  customerName: { type: 'string', example: 'Jordan Blake' },
                  customerEmail: { type: 'string', example: 'jordan@example.com' },
                  customerPhone: { type: 'string', example: '+1 (555) 765-4321' },
                  serviceType: {
                    type: 'string',
                    enum: [
                      'standard_tuneup',
                      'ebike_diagnostic',
                      'brake_overhaul',
                      'drivetrain_cleaning',
                      'custom_wheel_build',
                      'battery_health_check'
                    ],
                    example: 'standard_tuneup'
                  },
                  location: {
                    type: 'string',
                    enum: ['downtown', 'westside', 'metro_hub'],
                    example: 'downtown'
                  },
                  date: { type: 'string', format: 'date', example: '2026-11-17' },
                  timeSlot: { type: 'string', example: '11:00 AM' },
                  bikeModel: { type: 'string', example: 'Gazelle Medeo T10' },
                  notes: { type: 'string', example: 'Chain slips in 8th gear' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Booking created successfully'
          }
        }
      }
    }
  }
};
