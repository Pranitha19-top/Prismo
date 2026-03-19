# Prismo
# Team Name: PRABHA
AI powered parametric insurance platform for gig workers

🚀 PRISMO
AI-powered income protection for gig workers

👥 Team Name: PRABHA

🚀 Automatically detects disruptions and compensates gig workers based on actual income loss
💡 Core innovation: Personalized payout + dynamic pricing

# Problem Statement
Gig economy workers (Swiggy, Zomato delivery partners) frequently lose income due to external disruptions such as heavy rainfall, extreme heat, pollution, traffic congestion, and curfews.These uncontrollable events reduce their working hours and earnings, and currently there is no automated system to protect their income, forcing workers to bear the full financial loss.

# Persona
Name: Ravi Kumar
Role: Swiggy Delivery Partner
Location: Bangalore
Daily Income: ₹700
Working Hours: 9 AM – 5 PM
Ravi depends on daily earnings. During disruptions, he loses income without any safety net. PRISMO ensures automatic protection and intelligent guidance.

# Solution Overview
PRISMO is an AI-powered parametric insurance platform that:
Detects disruptions using real-time data
Calculates risk using multi-factor inputs
Predicts upcoming disruptions
Automatically triggers payouts
Dynamically adjusts weekly premium
Suggests optimal working hours to reduce income loss

# Key Features
# 1. Multi-Factor Risk Detection
 Considers:
Weather (rain, temperature)
AQI (pollution)
Traffic congestion
Curfew / restrictions

# 2.Smart & Personalized Payout Calculation
PRISMO ensures fair compensation based on actual working-hour disruption overlap.
Example Scenario :
Worker	Working Hours	Disruption	Effective Loss
Ravi	9 AM – 5 PM	3 PM – 7 PM	2 hours loss
Sanjay	2 PM – 9 PM	3 PM – 7 PM	4 hours loss
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
Payout calculated → ₹420
Claim triggered automatically
Amount credited
Heatmap and premium updated


















