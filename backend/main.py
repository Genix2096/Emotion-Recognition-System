"""
main.py
-------
FastAPI application for the Vocal Emotion Classifier backend.

Endpoints
---------
GET  /health   → server + model health check
POST /predict  → accepts .wav file, returns emotion + confidence JSON
"""

import os
import tempfile
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import predictor  # loads models at import time

# ── Logging setup ──────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format="%(levelname)s │ %(message)s")
log = logging.getLogger(__name__)

# ── App factory ────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("🚀  Vocal Emotion Classifier API starting up …")
    yield
    log.info("👋  Vocal Emotion Classifier API shutting down.")


app = FastAPI(
    title="Vocal Emotion Classifier API",
    description="Upload a .wav file and receive an emotion prediction.",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/health", tags=["Health"])
async def health():
    """Quick liveness + model-load check."""
    return {"status": "ok", "model_loaded": True}


@app.post("/predict", tags=["Prediction"])
async def predict_emotion(file: UploadFile = File(...)):
    """
    Accept a .wav file and return the predicted emotion with confidence.

    Returns
    -------
    JSON
        {
            "success": true,
            "prediction": "HAPPY",
            "confidence": 0.8452
        }
    """
    # ── Validate file type ────────────────────────────────────────────────────
    filename = file.filename or ""
    if not filename.lower().endswith(".wav"):
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": "Only .wav files are supported.",
                "received": filename,
            },
        )

    # ── Read payload ──────────────────────────────────────────────────────────
    content = await file.read()
    if not content:
        raise HTTPException(
            status_code=400,
            detail={"success": False, "error": "Uploaded file is empty."},
        )

    log.info("📂  Received '%s' (%d bytes)", filename, len(content))

    # ── Write to temp file (librosa needs a path) ─────────────────────────────
    tmp_path: str | None = None
    try:
        with tempfile.NamedTemporaryFile(
            suffix=".wav", delete=False
        ) as tmp:
            tmp.write(content)
            tmp_path = tmp.name

        # ── Run inference ─────────────────────────────────────────────────────
        emotion, confidence = predictor.predict(tmp_path)
        log.info("🎯  Prediction: %s  (%.2f%%)", emotion, confidence * 100)

        return JSONResponse(
            content={
                "success": True,
                "prediction": emotion,
                "confidence": round(confidence, 4),
            }
        )

    except Exception as exc:
        log.exception("❌  Prediction failed: %s", exc)
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": "Audio processing failed.",
                "detail": str(exc),
            },
        )
    finally:
        # Always clean up temp file
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)
