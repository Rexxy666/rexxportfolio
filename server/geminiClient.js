import { GoogleGenAI } from "@google/genai";

export const DEFAULT_MODEL = "gemini-3.5-flash";
export const FALLBACK_MODEL = "gemini-2.5-flash";

/**
 * @param {string | undefined} apiKey
 * @returns {boolean}
 */
export function isKeyFormatSupported(apiKey) {
  if (!apiKey) return false;
  return apiKey.startsWith("AIza") || apiKey.startsWith("AQ.");
}

/**
 * Standard AI Studio route — apiKey only, no project/location, no gcloud.
 *
 * @param {string | undefined} apiKey
 * @returns {GoogleGenAI | null}
 */
export function createGenAIClient(apiKey) {
  if (!isKeyFormatSupported(apiKey)) return null;
  return new GoogleGenAI({ apiKey });
}

/**
 * @returns {string}
 */
export function getModel() {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}
