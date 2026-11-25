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
export const ENRICHMENT_NOTES = {
  abstract: "Imported from PubMed, Semantic Scholar, publisher pages",
  author_affiliation: "Resolved from MAG and disambiguated author profiles",
  author_orcid: "Linked via ORCID public profiles",
  all_authors_orcid: "Linked via ORCID public data",
  subject_keywords: "Assigned algorithmically (topics/concepts)",
  funder_name: "Enriched from Crossref + external funder registries",
  funder_doi: "Mapped to ROR/OpenAlex IDs from funder names",
  award_number: "Extracted from multiple sources",
  references: "Inherited from Microsoft Academic Graph / Semantic Scholar",
  references_count: "Computed from OpenAlex reference graph",
  is_referenced_by: "Citation count computed from OpenAlex corpus",
  open_access_license: "Detected via Unpaywall integration",
  open_access_status: "Detected via Unpaywall",
  full_text_links: "Detected via has_fulltext flag + locations[]",
  affiliation_ids_ror: "ROR IDs resolved from institution names",
  affiliation_ror: "ROR resolved from disambiguated institutions",
  language: "Detected algorithmically",
  relations: "Computed via related_works algorithm",
  preprint_version_link: "Detected across preprint repositories",
  funding_complete: "Combined funder + grant data from multiple sources",
};
