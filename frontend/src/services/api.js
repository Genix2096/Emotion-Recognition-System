/**
 * api.js — thin API service layer
 * Sends a .wav file to the backend and returns the prediction result.
 */

const API_BASE = "http://localhost:8000";

/**
 * Analyze an audio file for emotion.
 * @param {File} file  - A .wav File object from the browser
 * @returns {Promise<{prediction: string, confidence: number}>}
 */
export async function analyzeAudio(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    const msg =
      data?.detail?.error ||
      data?.detail ||
      "Prediction failed. Please try again.";
    throw new Error(msg);
  }

  return {
    prediction: data.prediction,
    confidence: data.confidence,
  };
}

/**
 * Health check — useful for showing backend status.
 */
export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`);
  return response.ok;
}
