export const CATEGORIES = {
  findable_essential: {
    id: "findable_essential",
    label: "Findable Essential",
    color: "#1e40af",
    colorLight: "var(--color-cat-findable-ess)",
  },
  findable_support: {
    id: "findable_support",
    label: "Findable Support",
    color: "#0284c7",
    colorLight: "var(--color-cat-findable-sup)",
  },
  accessible_essential: {
    id: "accessible_essential",
    label: "Accessible Essential",
    color: "#057a55",
    colorLight: "var(--color-cat-accessible-ess)",
  },
  accessible_support: {
    id: "accessible_support",
    label: "Accessible Support",
    color: "#15803d",
    colorLight: "var(--color-cat-accessible-sup)",
  },
  evaluation_coara: {
    id: "evaluation_coara",
    label: "Evaluation / CoARA",
    color: "#7c3aed",
    colorLight: "var(--color-cat-evaluation)",
  },
};

export const CATEGORY_ORDER = [
  "findable_essential",
  "findable_support",
  "accessible_essential",
  "accessible_support",
  "evaluation_coara",
];

export const SOURCE_COLORS = {
  crossref: "#f59e0b",
  openalex: "#10b981",
};

/**
 * How OpenAlex typically enriches each field beyond what publishers deposit.
 * Used to distinguish "publisher didn't deposit" from "OpenAlex enriched externally."
 */
// Emptied on 2026-11-25: the notes of March 2026 named a source of OpenAlex for each field, and none was checked.
export const ENRICHMENT_NOTES = {};
