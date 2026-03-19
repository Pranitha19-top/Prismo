# Prismo
# Team Name: PRABHA
AI powered parametric insurance platform for gig workers
Automatically detects disruptions and compensates gig workers based on actual income loss
Core innovation: Personalized payout with the dynamic pricing

# Problem Statement
Gig economy workers (Swiggy, Zomato delivery partners) frequently lose income due to external disruptions such as heavy rainfall, extreme heat, pollution, traffic congestion and curfews.
These uncontrollable events reduce their working hours and earnings and currently there is no automated system to protect their income, forcing workers to bear the full financial loss.

#  Persona
Name: Ravi Kumar

Role: Swiggy Delivery Partner

Location: Bangalore

Daily Income: ₹700

Working Hours: 9 AM – 5 PM

Ravi depends on daily earnings. During disruptions, he loses income without any safety net. PRISMO ensures automatic protection and intelligent guidance.

# Solution Overview
PRISMO is an AI powered Parametric insurance platform that :
Detects disruptions using real-time data
Calculates risk using multi factor inputs
Predicts upcoming disruptions
Automatically triggers payouts
Dynamically adjusts weekly premium
Suggests Optimal working hours to reduce income loss

# Key Features
# 1. Multi Factor Risk Detection
 Considers:
Weather (rain, temperature)
AQI (pollution)
Traffic congestion
Curfew or restrictions

# 2.Smart & Personalized Payout Calculation
PRISMO ensures fair compensation based on actual working hour disruption overlap.
Example Scenario :
Worker	Working Hours	Disruption	Effective Loss

Ravi	working from (9 AM – 5 PM)	and rain from (3 PM – 7 PM) -	2 hours loss

Sanjay	working from (2 PM – 9 PM) and rain from (3 PM – 7 PM)- 	4 hours loss

Same disruption, different loss → different payouts
# Payout Logic
hours_lost = overlap(working_hours, disruption_window)

payout = income × disruption_factor × (hours_lost / total_working_hours)

# 3.Dynamic Weekly Premium Pricing
Uses last 2–3 weeks historical data
Calculates average risk for each location
Automatically assigns pricing tier:

Low Risk → ₹10/week  

Medium Risk → ₹25/week 

High Risk → ₹40/week   

# 4. Parametric Triggers
Automatic claim triggers:
Rain exceeds threshold

AQI exceeds threshold

Traffic congestion high

Curfew active

# 5. Smart Work Advisor
Provides suggestions to reduce income loss:
High risk from 3PM–8PM  
Work between 9AM–2PM

# 6. Fraud Detection
Location validation

Time validation

Duplicate claim prevention

Activity consistency checks

# 7. Risk Heatmap 
Real-time: shows current risk zones

Historical: used for premium calculation

# 8. Working Hour-Based Coverage Policy
Coverage is defined based on location-specific working hours.

# Non-Metropolitan Cities
Coverage: 6:00 AM – 9:00 PM
Claims outside this window are not eligible

# Metropolitan Cities
Coverage: 6:00 AM – 3:00 AM
Extended coverage due to higher demand

# AI/ML Integration
Risk prediction using multi-factor inputs

Dynamic premium pricing using historical data

Fraud detection using anomaly detection

# Tech Stack
Frontend: React

Backend: FastAPI (Python)

Database: SQLite / PostgreSQL

APIs: Weather, AQI, Traffic 

ML Models (optional): Random Forest

# DEMO SCENARIO

Ravi logs into the platform

System detects heavy rain + traffic

Risk becomes HIGH

Advisor suggests safer working hours

System checks working-hour eligibility

Overlap calculated → 2 hours loss

Payout calculated 

Claim triggered automatically

Amount credited

Heatmap and premium updated

## Workflow
User registers  
→ System collects data (weather, AQI, traffic, curfew)  
→ Risk calculated  
→ Prediction generated  
→ Advisor suggests  
→ Working hour check  
→ Overlap calculated  
→ Payout triggered  
→ User notified  

# Adversarial Defense & Anti-Spoofing Strategy
# 1. Differentiation: Genuine vs Spoofed Claims

PRISMO does not rely solely on GPS location.Instead, it uses multi-factor behavioral validation to distinguish between genuine workers and spoofed claims.

A genuine delivery partner shows consistent activity patterns such as:

Continuous movement across locations

Active working hours aligned with delivery patterns

Gradual location transitions

In contrast, spoofed users often show:

Sudden unrealistic location jumps

Static location during claim period

No supporting activity patterns

The system uses these behavioral signals to classify claims as valid or suspicious.

# 2. Data Signals Beyond GPS

PRISMO uses multiple data points to detect fraud:

GPS trajectory (not just current location)

Movement pattern (speed, direction changes)

Activity logs (active vs idle time)

Delivery activity (order pickup/drop frequency)

Network signals (sudden disconnections or anomalies)

Time consistency (working hours vs claim time)

By combining these signals, PRISMO builds a trust score for each claim.

# 3. AI Based Fraud Detection

The system applies anomaly detection techniques to identify unusual patterns:

Detects abnormal movement behavior

Flags inconsistent activity patterns

Identifies coordinated fraud patterns across multiple users

This allows PRISMO to detect fraud rings, not just individual frauds.

# 4. UX Balance:Fair Handling of Flagged Claims

PRISMO ensures that genuine users are not unfairly penalized.

When a claim is flagged:

It is temporarily marked as “Under Review” instead of being rejected

The system checks additional signals before final decision

Workers are notified transparently

If validated → payout is processed
If fraudulent → claim is rejected

# 5. Key Insight

PRISMO shifts from:

“Where is the worker?”
to
“Is the worker genuinely working?”
making our platform more reliable.
 


















