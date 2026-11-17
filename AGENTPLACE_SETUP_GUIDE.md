# Agentplace Setup Guide — Apex Mobility Concierge (Luna Model)

This guide takes you step-by-step through configuring and publishing your AI agent on [Agentplace.io](https://agentplace.io) using the free **Luna** model.

---

## 🎯 Step 1: Sign In & Create New Agent

1. Navigate to [https://agentplace.io](https://agentplace.io) (already open in your browser tab).
2. Log in or create your free account.
3. Click **"Create Agent"** or **"New Agent"** in your Agentplace dashboard.
4. Set the Model to **Luna** (the free model specified in the test task).

---

## 📝 Step 2: Agent Profile & Personality

Fill in the agent basic identity:

* **Agent Name:** `Apex Mobility Concierge`
* **Headline / Tagline:** `Your 24/7 E-Bike Repair, Availability & Service Specialist`
* **Role / Avatar:** High-tech bike workshop concierge

### System Prompt / Instructions:
Paste the following prompt into the agent's **Instructions / System Prompt** field:

```text
You are the official AI Service Concierge for "Apex Mobility & Cycle Works", a premier urban performance and electric bicycle workshop.

YOUR MISSION:
Deliver fast, knowledgeable, and helpful service to riders. You help customers check real-time workshop availability, track the live status of their repair orders, generate instant price quotes, and book service appointments.

CAPABILITIES & API TOOLS:
You are equipped with direct access to Apex Mobility's live workshop API:
1. "checkAvailability": Use this whenever a customer asks about open slots, appointment times, or mechanic availability. Available locations are "downtown", "westside", and "metro_hub".
2. "getOrderStatus": Use this whenever a customer asks about an existing order or repair ticket (e.g., ORD-8821, ORD-7749, ORD-9912). You will receive real-time technician notes, repair progress, and balance due.
3. "calculatePriceQuote": Use this whenever a customer asks how much a service will cost. Calculate itemized breakdowns, taking into account whether their bike is an e-bike, their urgency preference, and any discount codes (e.g., "WELCOME10" for 10% off).
4. "createBooking": Use this once a customer agrees on a service, date, and time slot to confirm their reservation.

COMMUNICATION STYLE:
- Professional, welcoming, and cycling-fluent (you understand e-bikes, drivetrains, hydraulic brakes, and battery diagnostics).
- Transparent about pricing, labor hours, and technician notes.
- When reporting order status, always mention the assigned technician and their latest note to give the customer genuine peace of mind.
- If an order is not found, politely ask them to double-check their order number (format: ORD-XXXX).
```

---

## 🔌 Step 3: Connect External API Tools

Agentplace allows you to connect external tools either via **OpenAPI / Swagger URL** or by adding **Custom Actions**.

### Option A: Import via OpenAPI URL (Recommended)
1. In the agent builder, go to **Tools** or **Integrations** -> **Add API / OpenAPI**.
2. If your API is deployed on Render/Vercel (or via ngrok/localtunnel):
   Paste your public URL:
   `https://<YOUR_DEPLOYED_URL>/openapi.json`
3. Agentplace will automatically discover and register all 4 endpoints:
   - `checkAvailability` (`GET /api/v1/availability`)
   - `getOrderStatus` (`GET /api/v1/orders/{orderId}`)
   - `calculatePriceQuote` (`POST /api/v1/quotes`)
   - `createBooking` (`POST /api/v1/bookings`)

### Option B: Add Endpoints Manually
If adding endpoints individually as custom actions:

#### Tool 1: Track Repair Order
* **Name:** `getOrderStatus`
* **Method:** `GET`
* **URL:** `https://<YOUR_DEPLOYED_URL>/api/v1/orders/{orderId}`
* **Path Parameter:**
  * `orderId` (string, required): e.g., `ORD-8821`
* **Description:** Retrieve the real-time status and technician notes of a repair order.

#### Tool 2: Check Availability
* **Name:** `checkAvailability`
* **Method:** `GET`
* **URL:** `https://<YOUR_DEPLOYED_URL>/api/v1/availability`
* **Query Parameters:**
  * `location` (string, optional: `downtown`, `westside`, `metro_hub`)
  * `date` (string, optional: `YYYY-MM-DD`)
  * `serviceType` (string, optional: `standard_tuneup`, `ebike_diagnostic`, `brake_overhaul`, `drivetrain_cleaning`, `custom_wheel_build`, `battery_health_check`)

#### Tool 3: Dynamic Price Quote
* **Name:** `calculatePriceQuote`
* **Method:** `POST`
* **URL:** `https://<YOUR_DEPLOYED_URL>/api/v1/quotes`
* **Headers:** `Content-Type: application/json`
* **JSON Body Schema:**
  ```json
  {
    "customerName": "{{customerName}}",
    "bikeModel": "{{bikeModel}}",
    "isElectric": {{isElectric}},
    "serviceTypes": ["standard_tuneup"],
    "urgency": "standard",
    "promoCode": "{{promoCode}}"
  }
  ```

---

## 🧪 Step 4: Test in the Agentplace Preview

Before publishing, test these conversations in the Agentplace preview chat:

1. **Order Status Test:**
   > *"Hi, can you tell me what's happening with my bike repair? My ticket number is ORD-8821."*
   >
   > *Expected Result:* The agent calls `getOrderStatus`, identifies Marcus Vance's Specialized Turbo Vado, states that lead technician Dmitri Rostov is bleeding the rear Shimano brake caliper, and indicates it will be ready today by 5:00 PM PST.

2. **Availability Test:**
   > *"Do you have any openings for an e-bike diagnostic at the downtown shop tomorrow?"*
   >
   > *Expected Result:* The agent calls `checkAvailability` and lists the available morning and afternoon slots with lead technicians.

3. **Dynamic Quote Test:**
   > *"How much would a brake overhaul and drivetrain cleaning cost for my Trek road bike? I have a discount code WELCOME10."*
   >
   > *Expected Result:* The agent calls `calculatePriceQuote`, itemizes the $95 brake overhaul + $65 ultrasonic cleaning, subtracts the $16 discount, adds sales tax, and offers the final quote with turnaround time.

---

## 🚀 Step 5: Publish Publicly

1. In the top-right corner of the Agentplace builder, click **"Publish"**.
2. Set visibility to **Public**.
3. Copy your live agent URL (e.g., `https://agentplace.io/a/apex-mobility` or your generated slug).
4. Save this URL — you will include it in your submission email to Nikita!
