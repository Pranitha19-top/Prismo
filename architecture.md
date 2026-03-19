# System Architecture

PRISMO follows a modular architecture for scalability and clarity.

# Components

# 1. Frontend
- React-based web interface
- Worker interaction layer

# 2. Backend API
- Built using FastAPI
- Handles all logic and processing

# 3. Data Aggregation Layer
- Weather API
- AQI data
- Traffic data
- Curfew input

# 4. Risk Engine
- Calculates risk using multi-factor inputs

# 5. Prediction Engine
- Forecasts upcoming disruptions

# 6. Smart Advisor
- Suggests optimal working hours

# 7. Working Hours Policy Engine
- Validates coverage eligibility based on time and location

# 8. Working Pattern Analyzer
- Calculates overlap between working hours and disruption

# 9. Claim Engine
- Calculates payout and triggers claims automatically

# 10. Fraud Detection Module
- Validates location, time, and activity

# 11. Pricing Engine
- Calculates weekly premium based on historical risk

### 12. Heatmap Generator
- Generates real-time and historical risk zones

### 13. Database
- Stores user data, risk data, and claim history
