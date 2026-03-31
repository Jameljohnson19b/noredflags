import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import cors from "cors";
import { analyzeSessionHandler } from "./routes/analyzeSession";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Main analysis route
app.post("/", analyzeSessionHandler);

// Define the Cloud Function with Secret Manager access
export const analyzeSession = onRequest({
  secrets: ["DEEPSEEK_API_KEY", "RESEND_API_KEY"],
  maxInstances: 10,
  timeoutSeconds: 300,
  region: "us-central1"
}, (req, res) => {
  return app(req, res);
});
