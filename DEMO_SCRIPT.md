# Mining Operations AI Control Tower
## Keynote Demo Script (15 Minutes)
## Scenario: Jaw Crusher 101 - Liner Wear Detection

---

## 🎯 The Story Arc

**The Promise:** In 15 minutes, you'll witness AI do what humans simply can't—analyze 720 sensor readings, correlate patterns across 5 different systems, and produce a fully-costed work order with the right crew assigned. Not in days. In minutes.

**The Stakes:** A crusher operating at 82% efficiency loses 250 tonnes per hour. That's $47,500 per day walking out the door. A catastrophic bearing failure? $200,000 minimum.

**The Transformation:** From reactive firefighting to predictive precision.

---

## Quick Reference: Key Data Points

| Metric | Value | Why It Matters |
|--------|-------|----------------|
| Equipment | Jaw Crusher 101 (Metso C160) | Primary crushing circuit - the heartbeat |
| Efficiency Drop | 89% → 82% (-7%) | Detected Jan 10, 2025 |
| Health Score | 68 (was 85) | 17-point decline triggered investigation |
| Active Alarms | 5 | Pitman bearings + motor current |
| Liner Last Replaced | May 15, 2024 | **8 months ago** (6-month lifecycle = 133% exceeded) |
| Liner Thickness | Zone B at 65% remaining | Feed side critical (below 70% threshold) |
| RUL | **5-7 days** | At current wear rate of 8.75%/month |
| Production Impact | 250 t/h lost | $47,500/day bleeding out |
| Scheduled Repair | Jan 20, 2025 | 8-hour planned shutdown |
| Work Order | 4000000147 | $20,174 total job cost |
| RPN | **432** | Severity:8 × Occurrence:6 × Detection:9 |

---

## THE SCRIPT

### OPENING: Set the Stage (30 seconds)

*Screen shows login page with Accenture logo and "Mining Operations - AI Control Tower"*

> "Let me show you something.
>
> This isn't a dashboard. This isn't another analytics tool. 
>
> This is a **Super Agent**—a network of specialized AI that thinks like your best reliability engineer, your most experienced maintenance planner, and your sharpest production analyst. All at once. All the time.
>
> Let me walk you through a real scenario—a crusher efficiency drop we detected this week."

*Click Login with Microsoft*

---

### ACT 1: The Digital Twin (2 minutes)

*Mining process flow appears—full value chain visualization*

> "This is your entire operation. Pit to port. Every piece of equipment, every sensor, every data point—connected and analyzed in real time."

*Toggle to "Shift Performance" view (this is the default)*

> "Right now I'm looking at shift performance across the value chain. Green is good. Yellow needs attention. Red means the AI has already flagged something."

*Point to the red indicator on Jaw Crusher 101*

> "Here. January 10th. The Super Agent detected an anomaly on Jaw Crusher 101—your Metso C160 in the primary circuit.
>
> Efficiency dropped from 89% to 82%. Seven percentage points in just a few days. Health score fell from 85 to 68. Five active alarms lit up."

*Toggle to "LPO Hotspots" view*

> "When I switch to Loss of Production Opportunity view, you see the ripple effect downstream. This isn't just a crusher problem. It's a value chain problem."

*Toggle to "Designed" view to show the process flow diagram (optional)*

> "And this is your designed process flow—the blueprint. What you're seeing is the gap between design and reality."

*Click on the crusher alert*

---

### ACT 2: Intelligent Analysis (3 minutes)

*Analysis screen loads with conversation panel on left, output console on right*

> "Now watch what happens. The system isn't just alerting—it's offering to help. And it's telling us the stakes: 250 tonnes per hour of lost throughput. $47,500 per day."

*Select "Yes" to analyze efficiency drop*

> "With that one click, I've activated the Super Agent network."

*Agent network appears showing available specialists in a periodic-table style layout*

> "See this? Five specialized AI agents—each pulling from different data sources:
>
> - **RO** - Resource Orchestration connects to SAP PM for work history and crew
> - **TA** - Timeseries Analysis queries your PI Historian for sensor trends
> - **MI** - Maintenance Intelligence runs Weibull reliability calculations
> - **IL** - Inventory & Logistics checks warehouse availability
> - **LD** - Liner Diagnostics knows the physics of wear patterns
>
> They don't work in silos. They share context. They build on each other's findings. That's what makes this different."

*Select "Yes" to proceed with root cause investigation*

---

### ACT 3: Root Cause Discovery (3 minutes)

*Fault tree diagram expands with probability calculations*

> "Here's where it gets interesting. This is FMEA-based root cause analysis—the same methodology your reliability engineers use, but running across every data point simultaneously.
>
> Liner wear degradation: 85% probability. That's our primary suspect."

*Point to the root cause table*

> "Look at the evidence. The liners were last replaced May 15th—**8 months ago** on a 6-month expected lifecycle. They've exceeded their service life by **133%**.
>
> Zone B—the feed side—is down to 65% remaining thickness. That's below the 70% critical threshold. And here's the kicker: Pitman bearing temperature is running at 108°C against an 85°C threshold. Drive motor Phase A current is 120 amps when the limit is 100.
>
> This isn't one problem. It's a system under stress. Worn liners creating asymmetric load, stressing bearings, overworking the motor. And your geologists will tell you—Pit 3 Zone B has harder ore. Bond Work Index is up 15%. Everything is connected."

*Select "Liner wear degradation" as the scenario*

---

### ACT 4: The Trusted Huddle (4 minutes)

*Super Agent orchestration begins—mini agent badges appear in header*

> "Now we're calling what we call a 'Trusted Huddle'. Watch the Super Agent orchestrate each specialist."

*Watch the mini badges in the header animate as each agent activates*

**As Resource Orchestration (RO) activates:**
> "First, who can fix this? SAP queried—24 work orders over 18 months. Last liner replacement: May 2024. Available window: January 20th. Lead tech: James Morrison—47 crusher jobs completed, 95% skill match. Team A: four certified fitters. Eight-hour estimated duration."

**As Timeseries Analysis (TA) runs:**
> "Next, what does the data say? 720 sensor readings analyzed over 30 days. Efficiency dropped 7%—from 89 to 82. The wear-to-efficiency correlation coefficient is 0.92—statistically definitive. Degradation rate: 0.23% per day. Pitman vibration up 120% from baseline."

**As Maintenance Intelligence (MI) calculates:**
> "Now the reliability engineering. Weibull beta of 2.1—classic wear-out behavior. Eight months in service equals 133% of design life. The Risk Priority Number is 432—critical priority. Probability of failure in the next 7 days: 38%."

**As Inventory & Logistics (IL) checks:**
> "Parts availability: CJ-8845 fixed liner—4 units in stock. CJ-8846 movable liner—3 units in stock. Both in Warehouse 02, Bin C47. Total material cost: $16,494. Lead time: zero days. We can move today."

**As Liner Diagnostics (LD) concludes:**
> "Final verdict: Zone B on the feed side is at 65% remaining—critical condition. Asymmetric wear pattern indicates jaw misalignment. Remaining useful life: **5-7 days** at current wear rate. Action: replace liners before January 22nd."

*Root Cause Summary with Icicle visualization appears*

> "All of that—from alert detection to full diagnosis with statistical proof and supporting evidence—happened in about a minute.
>
> Your reliability engineer would spend half a day pulling this together. The Super Agent does it before your morning coffee gets cold."

---

### ACT 5: From Analysis to Action (2 minutes)

*Action Recommendations section with maintenance timeline*

> "Analysis is worthless without action. So here's what happens next."

*Point to prioritized recommendations*

> "Priority one: Replace liners during January 20th shutdown. Priority two: Inspect Pitman bearings—that 108°C temperature is a warning we shouldn't ignore. Priority three: Check jaw alignment while we're in there—that asymmetric wear is telling us something."

*Click "Create Work Order"*

> "One click. Full SAP PM work order created."

*Work Order preview appears with status showing CRTD*

> "Work Order 4000000147. Status: CRTD—Created. Total: $20,174—$16,494 in materials, $3,200 in labor. Operations documented. Parts reserved."

*Click "Release & Submit for Scheduling"*

*Status changes from CRTD to REL*

> "And now it's Released. James Morrison gets the notification. Production planning knows the shutdown window. No rekeying. No transcription errors. No emails flying around asking who's doing what. It's just done."

*Show PDF download option*

> "And if you need the paper trail, full SAP-compliant documentation, one click."

---

### ACT 6: The Conversational Interface (2 minutes)

*Focus on chatbot*

> "One more thing. The knowledge doesn't disappear when the analysis is done. The Super Agent remembers everything."

*Type: "What's causing the elevated motor current on the crusher?"*

> "I can ask follow-up questions in plain English. Watch—it's not just searching. It's reasoning."

*Show tool calling visualization in Output Console—agent selection, query execution*

> "See that? It selected the right agent, queried the right data source, and synthesized an answer with full context. It knows we're talking about Crusher 101. It knows the liners are at 65% remaining. It knows the ore is harder."

*Type: "What's the work order status?"*

> "And it remembers the work order we just created. 4000000147—released and scheduled for January 20th."

*Type: "If we delay the liner replacement by one week, what's the failure risk?"*

> "This is your maintenance expert with perfect memory. Every sensor reading. Every work order. Every inspection report. It doesn't forget. It doesn't get tired. It doesn't have a bad day."

---

### CLOSING: The Transformation (30 seconds)

> "What you've just seen is AI doing what it should do for mining operations.
>
> Not replacing your people—**amplifying** them. Taking the cognitive load of data analysis off your reliability engineers so they can make decisions instead of hunting for information.
>
> The efficiency drop we caught? Left unchecked, that's $47,500 per day walking out the door.
>
> The bearing issue it flagged? That could have been a $200,000 catastrophic failure.
>
> The Super Agent caught it, diagnosed it, proved it, and had an action plan ready—in minutes.
>
> That's not incremental improvement. That's transformation.
>
> I'm happy to dig deeper into any part of what you just saw."

---

## 🎤 Anticipated Questions & Power Answers

### "How accurate is the failure prediction?"

> "The 38% probability comes from Weibull analysis on your actual failure history—beta of 2.1 indicates classic wear-out behavior. We're 8 months into a 6-month lifecycle—133% exceeded. The question isn't whether the liner will fail. It's whether you want to control when, or let it control you."

### "Where did the 5-7 days RUL come from?"

> "Current wear rate is 8.75% per month—accelerated by the 15% harder ore from Pit 3 Zone B. At 65% remaining and the current load conditions, the model calculates critical failure threshold in 5-7 operational days. That's not a guess—that's physics."

### "What's the RPN and why does it matter?"

> "Risk Priority Number 432. That's Severity 8 times Occurrence 6 times Detection 9. Anything over 200 requires immediate action. 432 puts this in critical territory. It's the same FMEA methodology your reliability engineers use, just calculated across all data simultaneously."

### "How does it know about the harder ore?"

> "It's triangulating from multiple sources—Bond Work Index from your lab system, motor current correlation with ore hardness, and geological survey data showing the move into Pit 3 Zone B. The AI doesn't guess. It connects dots across systems that humans can't hold in their heads simultaneously."

### "What if the parts weren't in stock?"

> "The system would flag it immediately and check backup suppliers. For Metso liners, it knows direct lead time is 5 days. It would factor that into the scheduling recommendation and potentially suggest a partial repair to buy time while parts are in transit."

### "How does it integrate with existing systems?"

> "We connect to what you have—SAP PM, PI Historian, any SCADA system, inventory management. The AI doesn't require you to change your infrastructure. It sits on top and makes the data you already have actually actionable."

### "What about data security?"

> "Everything runs within your environment. Your data never leaves your infrastructure. We can deploy on-premise or in your private Azure cloud. This is enterprise-grade, not a cloud toy."

### "How long to implement?"

> "For a focused pilot on crushing equipment—8 to 12 weeks to have something running in production. The bigger effort is usually clean data connections, not the AI itself. If your data infrastructure is mature, we can move faster."

### "What ROI should we expect?"

> "Based on similar implementations: 15-25% reduction in unplanned downtime, 30% faster mean time to repair. In this scenario alone, catching the issue early saved an estimated 5-7 days of degraded production—that's $250,000 to $330,000 in avoided losses. The system typically pays for itself in one prevented failure."

### "Why is this better than predictive maintenance we already have?"

> "Traditional predictive maintenance tells you *that* something is failing. The Super Agent tells you *why* it's failing (liner wear, not motor, not bearings), *who* can fix it (James Morrison, 95% match), *what* parts you need (both in stock, $16,494), and *when* to schedule (January 20th window). It's the difference between a smoke alarm and a fire department that shows up with the right equipment."

---

## 🎬 Demo Checklist

Before presenting:
- [ ] Clear browser cache: `rm -rf .next && npm run dev`
- [ ] Navigate to `http://localhost:8080/cerebra-demo`
- [ ] Verify login page shows Accenture logo + "Mining Operations - AI Control Tower"
- [ ] Test login flow—should go to digital twin view
- [ ] Verify "Shift Performance" is the default toggle
- [ ] Verify "Designed" view toggle works
- [ ] Toggle between "Shift Performance", "LPO Hotspots", and "Designed"
- [ ] Run through one complete workflow to warm up animations
- [ ] Test chatbot responds with relevant context
- [ ] Verify work order status changes from CRTD → REL
- [ ] Have this script ready on second screen or confidence monitor

---

## ⏱️ Timing Guide

| Section | Duration | Cumulative | Key Moment |
|---------|----------|------------|------------|
| Opening | 0:30 | 0:30 | "Super Agent" reveal |
| Digital Twin | 2:00 | 2:30 | Toggle views, show red alert |
| Analysis Setup | 3:00 | 5:30 | Agent network activation |
| Root Cause | 3:00 | 8:30 | Fault tree + "133% exceeded" |
| Trusted Huddle | 4:00 | 12:30 | Each agent's unique contribution |
| Work Order | 2:00 | 14:30 | CRTD → REL status change |
| Chatbot | 2:00 | 16:30 | Tool calling in Output Console |
| Close | 0:30 | 17:00 | Value prop summary |

*Target 15 minutes. Can extend to 17 if engagement is high.*

---

## 💬 Chatbot Questions for Live Demo

### Quick Wins (Simple, fast responses)
- "What's the status of work order 4000000147?"
- "When is the liner replacement scheduled?"
- "Who's leading this job?"
- "Are the liner parts in stock?"

### Show Intelligence (Requires reasoning)
- "What's causing the elevated motor current?"
- "Why are the liners wearing faster than expected?"
- "What's the correlation between liner wear and efficiency?"
- "Why is Zone B more worn than other zones?"

### Show Stakes (Business impact)
- "If we delay by a week, what's the failure risk?"
- "What's the probability of failure in the next 7 days?"
- "What would an unplanned failure cost us?"
- "How much production have we lost so far?"

### Show Depth (Technical credibility)
- "What's the Weibull beta for this failure mode?"
- "What's the RPN for liner wear?"
- "How many months has the liner exceeded its lifecycle?"
- "What's the current wear rate per month?"

---

## 📊 Appendix: Full Sensor Data Reference

### Pitman Assembly (Alarms Active)
| Parameter | Value | Threshold | Status |
|-----------|-------|-----------|--------|
| NDE Bearing Temp | 108°C | 85°C | 🔴 ALARM |
| DE Bearing Vib | 55 mm/s | 25 mm/s | 🔴 ALARM |
| DE Bearing Temp | 45°C | 85°C | ✅ Normal |
| NDE Bearing Vib | 1.55 mm/s | 2.0 mm/s | 🟡 Warning |

### Drive Motor (Alarms Active)
| Parameter | Value | Threshold | Status |
|-----------|-------|-----------|--------|
| Phase A Current | 120 A | 100 A | 🔴 ALARM |
| Phase B Current | 110 A | 100 A | 🔴 ALARM |
| Phase C Current | 98 A | 100 A | 🟡 Warning |
| Speed | 3000 RPM | Nominal | ✅ Normal |

### Liner Wear by Zone (Original: 100mm)
| Zone | Remaining | Thickness | Status |
|------|-----------|-----------|--------|
| A (Upper) | 60% | 60mm | 🟡 Warning |
| B (Feed Side) | 65% | 65mm | 🔴 CRITICAL |
| C (Lower) | 75% | 75mm | ✅ Acceptable |
| D (Discharge) | 95% | 95mm | ✅ Good |

*Note: Zone B is critical despite higher % than Zone A because it's below the 70% threshold for the feed side.*

### Key Reliability Metrics
| Metric | Value | Interpretation |
|--------|-------|----------------|
| Weibull β (Beta) | 2.1 | Wear-out phase |
| Weibull η (Eta) | 6 months | Expected lifecycle |
| Current Age | 8 months | 133% of lifecycle |
| P(Failure) 7-day | 38% | High risk |
| RPN (Liner Wear) | 432 | Critical priority (S:8 × O:6 × D:9) |
| Correlation (Wear→Efficiency) | r = 0.92 | Strong causation |
| Degradation Rate | 0.23%/day | Efficiency decline |
| Wear Rate | 8.75%/month | Accelerated by hard ore |
| RUL | 5-7 days | At current conditions |

---

## 🎯 One-Liners to Remember

- "This isn't a dashboard. It's a **Super Agent**."
- "Eight months on a six-month lifecycle. That's 133% exceeded."
- "Analysis is worthless without action."
- "It doesn't forget. It doesn't get tired. It doesn't have a bad day."
- "The difference between a smoke alarm and a fire department that shows up with the right equipment."
- "That's not incremental improvement. That's transformation."

---

## 🔢 Numbers That Matter

| Number | What It Means |
|--------|--------------|
| **7%** | Efficiency drop (89→82%) |
| **8** | Months since last liner replacement |
| **6** | Expected lifecycle in months |
| **133%** | How much lifecycle is exceeded |
| **65%** | Liner thickness remaining (Zone B) |
| **5-7** | Days of remaining useful life |
| **432** | Risk Priority Number |
| **38%** | Probability of failure in 7 days |
| **0.92** | Wear-efficiency correlation coefficient |
| **$47,500** | Daily production loss |
| **$20,174** | Work order total cost |
| **$200,000** | Potential catastrophic failure cost |

---

*Last updated: January 2025. Aligned with Super Agent implementation, consistent scenario data (8 months, 5-7 days RUL, RPN 432), Accenture branding, enhanced visualizations, and full chatbot integration.*
