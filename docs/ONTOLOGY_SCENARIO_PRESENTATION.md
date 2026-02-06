# Ontology & Graph Features - Business Value Scenarios

> **Presentation Script (1-2 minutes per scenario)**
> Use this guide when demonstrating the Ontology and Graph capabilities in Cerebra

---

## Why This Matters: The Problem Without Ontology

Before diving into scenarios, set the context:

> "In traditional AI systems, each model or agent works in isolation with its own understanding of the data. When you ask 'Why did the AI recommend this?' or 'Where did this number come from?', you often get a black box response.
>
> The ontology gives all our AI agents a **shared vocabulary and mental model**. Think of it as the 'dictionary' that ensures when the Grade Agent says 'Stockpile SP-3', the Logistics Agent knows exactly what that means, where it is, and what's connected to it."

---

## Scenario 1: Tracing a Grade Problem Back to its Source

**Business Context:** A train is about to ship iron ore that's below specification. The penalty could be $740,000.

### Demo Script (90 seconds)

> "Let me show you how the ontology helps us understand where this problem originated.
>
> *[Click on the Risk Signal node for Train-07]*
>
> This is our problem - Train-07 has a predicted grade of 61.2% Fe, but the contract requires 62% minimum.
>
> *[Click 'Show Upstream' or use Impact Analysis]*
>
> Now watch what happens. The graph traces backwards through every entity that contributed to this prediction:
>
> - The **Grade Estimate** came from blending material from Stockpile SP-3
> - The Stockpile was fed by material from **Pit 3, Zone B**
> - The zone had a recent **Assay Sample** that showed 61.9% Fe - lower than the geological model predicted
>
> *[Point to the Assay node]*
>
> Here's the root cause: this assay sample has a 6-hour lag and only 72% confidence. The AI agents identified that the geological model was wrong for this specific pocket of ore.
>
> **The business value?** Instead of shipping a penalty-generating load, we can:
> 1. Adjust the blend recipe to mix in higher-grade material
> 2. Update the 7-day plan to avoid this zone until we get better sampling
> 3. Flag this for the geologists to update their model
>
> Without the ontology, we'd just see 'grade is low' with no explanation of why or what to do about it."

---

## Scenario 2: Understanding Agent Decision Reasoning

**Business Context:** The AI recommended Plan B instead of Plan C. Stakeholders want to know why.

### Demo Script (60 seconds)

> "One of the biggest challenges with AI in operations is trust. Executives ask: 'Why should I trust this recommendation?'
>
> *[Switch to Decision Trace tab]*
>
> The ontology captures every decision an agent makes and links it to the evidence it used.
>
> *[Click on a Plan Retrofit Agent run]*
>
> Here you can see:
> - **What tools the agent called** - it queried the reconciliation data, checked historical patterns
> - **What entities it examined** - these specific stockpiles, these train loads
> - **What it found** - Pit 3 Zone B has caused under-spec issues in 3 of the last 5 shifts
>
> *[Highlight the recommendation node]*
>
> The recommendation to deprioritize Zone B isn't a black box - it's traceable to specific data points.
>
> **For compliance and audit purposes**, we can show exactly what information led to each operational decision. This is critical in mining where safety and commercial decisions need to be defensible."

---

## Scenario 3: Impact Analysis - What Happens If...

**Business Context:** A truck breaks down. What's the downstream impact?

### Demo Script (75 seconds)

> "Let's say TRK-12 just reported a transmission fault. In a complex operation, how do we understand what this affects?
>
> *[Find the Equipment node for TRK-12]*
> *[Click 'Show Downstream']*
>
> The ontology instantly shows us the ripple effect:
>
> - TRK-12 was assigned to haul from **Pit 3 to Stockpile SP-2**
> - SP-2 feeds the **blend recipe** for Train-07
> - Train-07 has a **fixed slot at 12:40** - if it's late, we lose the berth
> - The vessel **MV-Koyo-Maru** has demurrage at **$15,000 per hour**
>
> *[Point to the connected nodes]*
>
> In under 5 seconds, we've traced from a single truck failure to a potential $45,000 demurrage cost.
>
> **The agents use this same graph** to automatically:
> 1. Reallocate TRK-08 from standby
> 2. Adjust the dig sequence to compensate
> 3. Alert the port that timing is tight
>
> Without the ontology, these would be separate systems requiring manual coordination."

---

## Scenario 4: Data Lineage - Where Did This Number Come From?

**Business Context:** The CFO questions a production forecast number in a report.

### Demo Script (60 seconds)

> "Data trust is fundamental. When a number appears in a dashboard or report, people need to know it's reliable.
>
> *[Switch to System Lineage tab]*
>
> This view shows how data flows between systems. Every number in our AI's recommendations can be traced back to its source.
>
> *[Click on the LIMS system]*
>
> For example, the grade prediction of 61.2% came from:
> - **LIMS** (laboratory system) provided the assay results
> - **Dispatch** provided the truck movements
> - **Stockpile Management** provided the blend proportions
> - **Reconciliation** provided the historical accuracy
>
> *[Highlight the data flow arrows]*
>
> If there's a data quality issue - say the LIMS had a 6-hour lag - we can see that in the confidence scores.
>
> **For the CFO:** We can say 'This forecast has 78% confidence because the assay data is 6 hours old. If you want higher confidence, we need real-time assay integration.'
>
> That's a very different conversation than 'the AI said so.'"

---

## Key Talking Points Summary

When wrapping up the ontology demo, emphasize these value propositions:

### 1. Explainability
> "Every AI recommendation is traceable to specific data points and reasoning steps."

### 2. Trust & Compliance
> "Decisions are auditable. We can show regulators and executives exactly what information led to each recommendation."

### 3. Impact Understanding
> "Upstream and downstream analysis shows the ripple effects of any change or failure in seconds."

### 4. Shared Intelligence
> "All 9 specialist agents share the same mental model. The Grade Agent and Logistics Agent are literally looking at the same graph."

### 5. Data Lineage
> "No more 'where did this number come from?' - every metric traces back to source systems with confidence scores."

---

## Handling Common Questions

### "Isn't this just a database?"
> "A database stores data. The ontology stores meaning and relationships. It knows that a Stockpile can feed a Train, which loads at a Berth, which affects a Vessel's demurrage. That semantic knowledge is what allows agents to reason across the entire value chain."

### "Why not just use RAG (Retrieval Augmented Generation)?"
> "RAG retrieves text documents. The ontology provides structured knowledge with precise relationships. When we need to answer 'What upstream factors caused this grade issue?', RAG would search for relevant documents. The ontology can traverse the exact causal chain in milliseconds."

### "How is this different from a knowledge graph?"
> "It IS a knowledge graph - specifically designed for the Pit-to-Customer domain. The ontology schema ensures consistency (all agents agree on what a 'Stockpile' is), and the instance graph contains the actual operational data. Together, they enable agents to reason about your specific operation."

### "What's the maintenance overhead?"
> "The schema is defined once and rarely changes. The instance data is populated from your existing systems - it doesn't require manual data entry. The graph updates automatically as operations happen."

---

## Visual Cues for Demo

| When Showing | Highlight |
|--------------|-----------|
| Root cause tracing | Use "Show Upstream" button |
| Impact analysis | Use "Show Downstream" button |
| Decision reasoning | Switch to "Decision Trace" tab |
| Data sources | Switch to "System Lineage" tab |
| Entity types | Switch to "Ontology" tab and show categories |
| Confidence issues | Point to nodes with yellow/red confidence rings |

---

*Document created: January 2026*
*For use with Cerebra Demo Ontology Graph Modal*
