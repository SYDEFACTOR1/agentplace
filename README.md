# Apex Mobility & Cycle Works — AI Agent External API Microservice

[![CI](https://github.com/placeholder/apex-mobility-agent-api/actions/workflows/ci.yml/badge.svg)](https://github.com/)
[![Node Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Agentplace Full-Stack Engineer Test Task Submission**  
> A high-performance, typed RESTful microservice connecting an **Agentplace AI Agent** (powered by the free **Luna** model) to real-world business operations: live workshop availability, real-time repair order tracking, and dynamic multi-variable price quotes.

---

## 🌟 Overview & Business Context

**Apex Mobility & Cycle Works** is a modern urban workshop specializing in premium performance bicycles and electric micro-mobility vehicles (e-bikes). 

To give customers immediate answers without taking mechanics off the workshop floor, the business deploys an autonomous AI agent hosted on **Agentplace**. This backend API provides the external capabilities that connect the conversational agent to live operational data.

### Supported Capabilities (All 3 Test Task Archetypes Implemented):
1. **Live Workshop Availability (`GET /api/v1/availability`)**: Real-time calendar & bay availability across multiple workshop hubs (`downtown`, `westside`, `metro_hub`) filtered by service type and date.
2. **Order & Repair Status Tracker (`GET /api/v1/orders/:orderId`)**: Instant lookup of repair tickets (e.g. `ORD-8821`, `ORD-7749`, `ORD-9912`), providing stage progression, assigned lead technician, itemized services, financial balance, and mechanic workbench notes.
3. **Dynamic Price Quotation Engine (`POST /api/v1/quotes`)**: Real-time pricing calculator computing base labor, electric bike safety surcharges, urgency multipliers (Standard / Express / Same-Day), pickup/delivery fees, sales tax, and promotional discounts (e.g. `WELCOME10`).
4. **Direct Appointment Booking (`POST /api/v1/bookings`)**: Reserves workshop slots and generates intake tickets on the fly.

---

## 🏗️ Architecture & Tech Stack

```
+-----------------------------------------------------------+
|                   Agentplace.io Platform                  |
|                                                           |
|    +-------------------+        +---------------------+   |
|    |  Customer Chat UI | <----> |  Luna LLM Engine    |   |
|    +-------------------+        +----------+----------+   |
+--------------------------------------------|--------------+
                                             | Tool / OpenAPI Call
                                             v
+-----------------------------------------------------------+
|             Apex Mobility Backend Microservice             |
|                                                           |
|   +---------------------------------------------------+   |
|   | Express.js Server + CORS + Request Logger         |   |
|   +---------------------------------------------------+   |
|   | Zod Input Validation & Schema Enforcement         |   |
|   +---------------------------------------------------+   |
|   | Routes: /availability | /orders | /quotes | /docs |   |
|   +---------------------------------------------------+   |
|   | In-Memory Seeded State Store & Business Logic     |   |
|   +---------------------------------------------------+   |
+-----------------------------------------------------------+
```

* **Runtime:** Node.js (v22.x) with TypeScript (ES2022)
* **Framework:** Express.js 4.x
* **Validation:** Zod 3.x with strict schema checking
* **Documentation:** OpenAPI 3.0.3 specification & Swagger UI at `/docs`
* **Testing:** Vitest + Supertest (100% route coverage)
* **Containerization & Deployment:** Docker multi-stage build, Render Blueprint (`render.yaml`), Vercel config (`vercel.json`)

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 20+ or 22+
- npm or pnpm

### 2. Install & Run
```bash
# Clone the repository
git clone <repo-url>
cd pokke

# Install dependencies
npm install

# Start development server with hot-reload
npm run dev
```

The server starts at `http://localhost:3000`.

### 3. Interactive Documentation
- **Swagger UI:** Open [http://localhost:3000/docs](http://localhost:3000/docs) in your browser.
- **Raw OpenAPI JSON Spec:** [http://localhost:3000/openapi.json](http://localhost:3000/openapi.json) (Use this to import directly into Agentplace).

### 4. Run Test Suite
```bash
npm test
```

---

## 📡 API Reference & Curl Examples

### 1. Check Workshop Availability
```bash
curl -X GET "http://localhost:3000/api/v1/availability?location=downtown&serviceType=standard_tuneup&date=2026-11-17"
```
**Sample Response:**
```json
{
  "success": true,
  "meta": {
    "location": "downtown",
    "queriedDate": "2026-11-17",
    "serviceType": "standard_tuneup",
    "totalSlotsFound": 3
  },
  "slots": [
    {
      "slotId": "SLOT-1011",
      "date": "2026-11-17",
      "timeSlot": "09:00 AM",
      "location": "downtown",
      "leadTechnician": "Dmitri Rostov",
      "isAvailable": true
    }
  ]
}
```

### 2. Track Repair Order Status
Try pre-seeded order IDs: `ORD-8821`, `ORD-7749`, `ORD-9912`, or `ORD-3304`.
```bash
curl -X GET "http://localhost:3000/api/v1/orders/ORD-8821"
```
**Sample Response:**
```json
{
  "success": true,
  "order": {
    "orderId": "ORD-8821",
    "customerName": "Marcus Vance",
    "bikeModel": "Specialized Turbo Vado 5.0 (E-Bike)",
    "isElectric": true,
    "status": "in_progress",
    "statusDisplay": "In Progress - Technician Working on Bike",
    "location": "downtown",
    "assignedTechnician": "Dmitri Rostov (Lead E-Tech)",
    "technicianNotes": "Diagnostic scan showed motor firmware version 3.2.1 is up-to-date. Currently bleeding rear Shimano 4-piston hydraulic caliper.",
    "estimatedCompletion": "Today at 5:00 PM PST",
    "financials": {
      "totalAmount": "$214.00",
      "depositPaid": "$50.00",
      "balanceDue": "$164.00"
    }
  }
}
```

### 3. Calculate Instant Price Quote
```bash
curl -X POST "http://localhost:3000/api/v1/quotes" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Elena Rostova",
    "bikeModel": "Gazelle Ultimate C380 HMB",
    "isElectric": true,
    "serviceTypes": ["standard_tuneup", "ebike_diagnostic"],
    "urgency": "express",
    "promoCode": "WELCOME10"
  }'
```
**Sample Response:**
```json
{
  "success": true,
  "quote": {
    "quoteId": "QTE-489102",
    "customerName": "Elena Rostova",
    "bikeModel": "Gazelle Ultimate C380 HMB",
    "itemizedServices": [
      { "service": "Comprehensive Standard Tune-Up", "basePrice": 89 },
      { "service": "E-Bike Full Electrical Diagnostic", "basePrice": 119 }
    ],
    "pricing": {
      "subtotal": "$208.00",
      "ebikeSafetySurcharge": "$25.00",
      "urgencyTier": "express",
      "urgencyFee": "$52.00",
      "pickupAndDelivery": "$0.00",
      "discountApplied": "-$20.80",
      "salesTax": "$21.79",
      "estimatedTotal": "$285.99"
    },
    "turnaround": { "estimatedHours": 8, "summary": "8 hours turnaround" }
  }
}
```

---

## 🌐 Deploying to the Public Internet (for Agentplace Connection)

Agentplace needs a publicly accessible HTTPS endpoint to invoke your API. You have two instant options:

### Option A: 10-Second Local Tunnel (Fastest for testing)
Run the server locally, then expose it using `ngrok`, `localtunnel`, or `cloudflared`:
```bash
# Terminal 1:
npm run dev

# Terminal 2:
npx localtunnel --port 3000
# OR
ngrok http 3000
```
Use the generated HTTPS URL (e.g. `https://clever-fox-82.loca.lt`) as your server base URL in Agentplace!

### Option B: 1-Click Free Cloud Deployment (Render / Vercel / Railway)
1. Push this repository to your GitHub account.
2. Link to [Render.com](https://render.com) (Web Service using the included `render.yaml` or Dockerfile) or [Vercel](https://vercel.com).
3. Your service is live at `https://your-service.onrender.com` with automatic HTTPS!

---

## 📄 Key Documents Included

- **[AGENTPLACE_SETUP_GUIDE.md](./AGENTPLACE_SETUP_GUIDE.md)**: Exact step-by-step instructions, system prompts, and tool configurations for Agentplace and the Luna model.
- **[EXPLAIN_YOUR_APPROACH.md](./EXPLAIN_YOUR_APPROACH.md)**: The required Part 03 engineering write-up analyzing architecture, production enhancements, and platform limits.
- **[SUBMISSION_EMAIL.md](./SUBMISSION_EMAIL.md)**: The ready-to-send email template to `nikita@agentplace.io`.
