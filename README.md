# 🏥 DermaScope AI

**Smartphone Wound Intelligence Platform for India**

> AI HealthX 2026 Hackathon (India Track) | Team CODEX

DermaScope AI brings specialist-level wound analysis to India's 30,000+ Primary Health Centres using just a smartphone camera. ASHA workers and PHC nurses can capture wound images, get instant AI-powered analysis, and receive treatment protocols in Hinglish.

## ✨ Features

- 📸 **Smart Capture** – Camera guidance with real-time quality feedback
- 🔬 **AI Analysis** – Wound segmentation, measurement, and classification
- 📊 **3D Depth Map** – Interactive wound topology visualization
- 💊 **Treatment Protocols** – NLEM 2023-compliant recommendations in Hinglish
- 🗺️ **Federated Learning** – Privacy-preserving model training across PHC network
- 📱 **PWA + Offline** – Works on ₹7,000 Android phones with spotty connectivity

## 🚀 Quick Start

### Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
# Open http://localhost:5173
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# API at http://localhost:8000
```

## 🏗️ Architecture

```
/dermascope-ai
├── /frontend          # React + TypeScript + Vite
│   ├── /src
│   │   ├── /components   # Atoms → Molecules → Organisms
│   │   ├── /pages        # Dashboard, Capture, Analysis, Research
│   │   ├── /lib          # Stores (Zustand), utilities, prompts
│   │   └── /hooks        # useCamera, useOffline
│   └── tailwind.config.ts
├── /backend           # FastAPI + Python 3.11
│   ├── /app
│   │   ├── /api/v1/routes  # upload, analyze, treatment
│   │   └── /core           # config, security
│   └── Dockerfile
└── /ml-models         # ONNX models (SAM, ZoE-Depth)
```

## 🇮🇳 Compliance

- DPDP Act 2023 – Data stays on device
- NLEM 2023 – Drug recommendations follow national guidelines
- ICMR – Research requires ethics approval
- CDSCO – Diagnostic features need approval for production

## 👥 Team CODEX

Built for AI HealthX 2026 Hackathon (India Track)
