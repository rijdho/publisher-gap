import { CATEGORY_ORDER, CATEGORIES } from "../lib/categories";

const CATEGORY_FIELDS = {
  findable_essential: [
    "Title", "Abstract", "Author", "Author Affiliation", "DOI",
    "Publication Date", "Publisher", "Resource Type", "Subject / Keywords",
    "Funder Name", "Container Title", "Language",
  ],
  findable_support: [
    "Author ORCID", "All Authors ORCID", "Funder DOI", "Award Number",
    "ISSN", "Volume", "Issue", "Page",
    "Published Print Date *", "Published Online Date *", "Article Number *",
  ],
  accessible_essential: [
    "License", "License URL", "Open Access License", "Full-text Links",
    "Resource URL", "References", "References Count", "Is Referenced By",
    "Update Policy *",
  ],
  accessible_support: [
    "JATS Abstract *", "Author Sequence", "Affiliation IDs (ROR)",
    "Relations", "Assertions *", "Archive *",
  ],
  evaluation_coara: [
    "CRediT Author Roles *", "Complete Author Names", "Affiliation with ROR",
    "Complete Funding Info", "Data Availability Statement *",
    "Preprint / Version Link", "Peer Review Metadata *",
    "Clinical Trial Number *", "Structured Abstract *", "Open Access Status",
  ],
};

const PUBLISHER_LIST = [
  { name: "Elsevier", category: "Commercial Hybrid/Subscription", works: "44,219 (excl. SSRN)" },
  { name: "Springer Nature", category: "Commercial Hybrid/Subscription", works: "55,000" },
  { name: "Wiley", category: "Commercial Hybrid/Subscription", works: "55,000" },
  { name: "Taylor & Francis", category: "Commercial Hybrid/Subscription", works: "55,000" },
  { name: "SAGE", category: "Commercial Hybrid/Subscription", works: "55,000" },
  { name: "MDPI", category: "Commercial OA", works: "55,000" },
  { name: "Frontiers", category: "Commercial OA", works: "55,000" },
  { name: "PLOS", category: "Commercial OA", works: "55,000" },
  { name: "Hindawi", category: "Commercial OA", works: "15,325" },
  { name: "SciELO / FapUNIFESP", category: "Regional / Latin America", works: "55,000" },
  { name: "Redalyc / UAEM", category: "Regional / Latin America", works: "540 (all)" },
  { name: "UNAM", category: "Regional / Latin America", works: "268 (all)" },
  { name: "Universidad de Chile", category: "Regional / Latin America", works: "250 (all)" },
  { name: "Pontificia U. Católica de Chile", category: "Regional / Latin America", works: "368 (all)" },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl space-y-8 fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">About Publisher Gap</h2>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Publisher Gap measures what scholarly publishers actually deposit in
          Crossref (the primary metadata source) and compares it with what
          OpenAlex (an open aggregator) manages to enrich from other sources.
          The goal is to provide evidence-based answers to a simple question:
          <strong style={{ color: "var(--color-text)" }}>
            {" "}do publishers genuinely care about metadata quality?
          </strong>
        </p>
      </div>

      {/* Key findings */}
      <div
        className="rounded-lg p-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h3 className="text-lg font-semibold mb-2">Key Findings</h3>
        <div className="space-y-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
          <p>
            Across <strong style={{ color: "var(--color-text)" }}>835,000+
            journal articles</strong> from 14 active publishers (2015-2025),
            filtered to <code>type:journal-article</code> to ensure fair
            comparison, publishers deposit on average less than half of
            comparable metadata fields in Crossref. OpenAlex consistently
            enriches this by double-digit percentage points.
          </p>
          <p>
            The largest gaps are in Author ORCID, Author Affiliation, Abstract,
            and Preprint/Version Links &mdash; fields where OpenAlex
            reconstructs from ORCID.org, ROR, PubMed, and repository metadata
            what publishers chose not to deposit.
          </p>
          <p>
            Evaluation-relevant fields (CRediT roles, data availability
            statements, structured abstracts) remain near zero in both sources,
            because no mandate has ever required them.
          </p>
        </div>
      </div>

      {/* Thesis */}
      <div
        className="rounded-lg p-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h3 className="text-lg font-semibold mb-2">The Thesis</h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          There is a widespread narrative that publishers are improving their
          metadata deposits. Our analysis over a decade (2015-2025) suggests
          that improvements are almost entirely driven by
          <strong style={{ color: "var(--color-text)" }}> mandates</strong>
          {" "}(ORCID requirements, Plan S, Crossref Participation Reports),
          not by genuine commitment to metadata quality. Fields that have never
          been mandated &mdash; particularly those relevant to research evaluation
          (CRediT roles, data availability, complete funding info) &mdash; remain
          near zero.
        </p>
        <p
          className="text-sm leading-relaxed mt-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          This matters for initiatives like
          <strong style={{ color: "var(--color-text)" }}> CoARA</strong>
          {" "}(Coalition for Advancing Research Assessment): if we want to
          evaluate research contributions beyond publications, we need metadata
          that describes those contributions. Publishers hold the keys, but
          they are not opening the door.
        </p>
      </div>

      {/* Methodology */}
      <div
        className="rounded-lg p-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h3 className="text-lg font-semibold mb-2">Methodology</h3>
        <div
          className="space-y-3 text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          <p>
            <strong style={{ color: "var(--color-text)" }}>
              Data collection:
            </strong>
            {" "}For each publisher and year (2015-2025), we fetch up to
            <strong style={{ color: "var(--color-accent)" }}>
              {" "}5,000 journal articles per publisher per year
            </strong>
            {" "}from Crossref using cursor-based pagination, filtered to
            <code>type:journal-article</code> to exclude preprints, book
            chapters, and other content types that have structurally different
            metadata. For publishers with fewer than 5,000 articles in a given
            year, all works are collected (100% coverage).
          </p>
          <p>
            <strong style={{ color: "var(--color-text)" }}>Why only journal articles?</strong>
            {" "}Publishers like Elsevier register DOIs for SSRN preprints (60%
            of their Crossref records), and Springer Nature / Taylor &amp;
            Francis have large volumes of book chapters (58-76% of records).
            These content types have structurally sparser metadata and would
            unfairly skew comparisons. Filtering to{" "}
            <code>type:journal-article</code> ensures we compare like with
            like.
          </p>
          <p>
            <strong style={{ color: "var(--color-text)" }}>Matching:</strong>
            {" "}The same DOIs are then queried in OpenAlex using batch DOI
            filters (50 DOIs per request), enabling a direct field-by-field
            comparison of the same works across both sources. Match rates
            consistently exceed 99%.
          </p>
          <p>
            <strong style={{ color: "var(--color-text)" }}>Evaluation:</strong>
            {" "}Each work is evaluated against
            <strong style={{ color: "var(--color-text)" }}> 38 comparable metadata fields</strong>
            {" "}organized in 5 categories (from an initial set of 48, excluding
            10 that only one source supports). Each field has source-specific check
            functions that account for the different data models of Crossref and
            OpenAlex. For example, Crossref stores authors in{" "}
            <code>author[]</code> while OpenAlex uses{" "}
            <code>authorships[]</code>; Crossref stores abstracts as XML strings
            while OpenAlex uses an inverted index; OpenAlex distributes licenses
            across multiple <code>locations[]</code> rather than a single field.
          </p>
          <p>
            <strong style={{ color: "var(--color-text)" }}>
              Comparable vs non-comparable fields:
            </strong>
            {" "}Of the 48 fields evaluated, <strong style={{ color: "var(--color-accent)" }}>38 are comparable</strong>
            {" "}&mdash; both Crossref and OpenAlex can provide them. The remaining
            10 are structural (e.g., JATS Abstract and Assertions only exist in
            Crossref; CRediT roles and data availability don't exist in either).
            The dashboard uses only the 38 comparable fields. Fields marked
            with * below are non-comparable and excluded from all charts.
          </p>
          <p>
            <strong style={{ color: "var(--color-text)" }}>
              TDM license filtering:
            </strong>
            {" "}Some publishers (notably Elsevier and Springer) deposit
            text-mining (TDM) licenses in Crossref that are not real open
            access licenses. We exclude TDM license URLs from the license
            check to avoid inflating Crossref scores artificially.
          </p>
          <p>
            <strong style={{ color: "var(--color-text)" }}>
              Voluntary vs automatic fields:
            </strong>
            {" "}Each field is classified as either{" "}
            <strong style={{ color: "var(--color-voluntary)" }}>voluntary</strong> (requires
            deliberate publisher effort to collect and deposit, e.g., abstract,
            affiliations, ORCID, funding, references) or{" "}
            <strong style={{ color: "var(--color-enrichment)" }}>automatic</strong> (generated
            by the publishing system without effort, e.g., title, DOI,
            publisher, ISSN, volume, page). The dashboard defaults to showing
            voluntary fields only, revealing the true level of publisher
            effort. Toggle "Voluntary only" to see all comparable fields.
          </p>
          <p>
            <strong style={{ color: "var(--color-text)" }}>
              Temporal analysis:
            </strong>
            {" "}All metrics are computed per year, enabling trend analysis
            across the full decade. This reveals whether improvements in
            metadata quality are organic or driven by specific mandates and
            policy interventions.
          </p>
        </div>
      </div>

      {/* Publishers analyzed */}
      <div
        className="rounded-lg p-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h3 className="text-lg font-semibold mb-3">Publishers Analyzed</h3>
        <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
          For large publishers, up to 5,000 works per year are sampled. For
          small publishers (marked "all"), every work is included.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                <th className="text-left py-1.5 px-2" style={{ color: "var(--color-text-muted)" }}>Publisher</th>
                <th className="text-left py-1.5 px-2" style={{ color: "var(--color-text-muted)" }}>Category</th>
                <th className="text-right py-1.5 px-2" style={{ color: "var(--color-text-muted)" }}>Works</th>
              </tr>
            </thead>
            <tbody>
              {PUBLISHER_LIST.map((p) => (
                <tr key={p.name} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td className="py-1.5 px-2">{p.name}</td>
                  <td className="py-1.5 px-2" style={{ color: "var(--color-text-muted)" }}>{p.category}</td>
                  <td className="py-1.5 px-2 text-right font-mono" style={{ color: "var(--color-text-muted)" }}>{p.works}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Categories & Fields */}
      <div
        className="rounded-lg p-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h3 className="text-lg font-semibold mb-3">
          38 Comparable Fields in 5 Categories
        </h3>
        <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
          Only fields present in both Crossref and OpenAlex are used.
          Fields marked with * are non-comparable and excluded from all charts.
        </p>
        <div className="space-y-4">
          {CATEGORY_ORDER.map((catId) => {
            const cat = CATEGORIES[catId];
            const fields = CATEGORY_FIELDS[catId] || [];
            return (
              <div key={catId}>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: cat.colorLight }}
                  />
                  <div
                    className="text-sm font-semibold"
                    style={{ color: cat.colorLight }}
                  >
                    {cat.label}{" "}
                    <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>
                      ({fields.length} fields)
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 ml-5">
                  {fields.map((f) => {
                    const isNonComp = f.endsWith("*");
                    return (
                      <span
                        key={f}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: isNonComp
                            ? "color-mix(in srgb, var(--color-gap-negative) 10%, transparent)"
                            : "var(--color-surface-alt)",
                          color: isNonComp
                            ? "var(--color-gap-negative)"
                            : "var(--color-text-muted)",
                          opacity: isNonComp ? 0.7 : 1,
                        }}
                      >
                        {f}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandate Timeline */}
      <div
        className="rounded-lg p-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h3 className="text-lg font-semibold mb-3">Mandate Timeline</h3>
        <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
          Key policy interventions that drove metadata improvements. Vertical
          lines in the timeline charts mark these events.
        </p>
        <div className="space-y-3">
          {[
            {
              year: 2016,
              text: "ORCID mandate begins at major publishers",
              detail: "Elsevier, Springer Nature, Wiley require ORCID for corresponding authors",
            },
            {
              year: 2017,
              text: "Crossref Funder Registry integration push",
              detail: "Encourages use of Open Funder Registry IDs alongside funder names",
            },
            {
              year: 2018,
              text: "Plan S announced by cOAlition S",
              detail: "Requires immediate open access with CC licenses",
            },
            {
              year: 2019,
              text: "Initiative for Open Citations (I4OC) gains momentum",
              detail: "Major publishers commit to open reference deposits",
            },
            {
              year: 2020,
              text: "ROR launches, pushing machine-readable affiliations",
              detail: "Research Organization Registry provides persistent IDs for institutions",
            },
            {
              year: 2021,
              text: "Plan S enforcement begins",
              detail: "Journals must provide CC-BY licenses and full-text access",
            },
            {
              year: 2022,
              text: "CoARA agreement signed by 600+ organizations",
              detail: "Calls for richer contributor metadata and responsible assessment",
            },
            {
              year: 2023,
              text: "Crossref launches Participation Reports",
              detail: "Pushes members to improve abstract, reference, and funder deposits",
            },
            {
              year: 2024,
              text: "CRediT in JATS 1.4, CoARA reform accelerates",
              detail: "CRediT taxonomy formally part of JATS standard, but adoption remains minimal",
            },
          ].map((m) => (
            <div key={m.year} className="flex gap-3 items-start">
              <span
                className="text-sm font-mono font-bold flex-shrink-0 mt-0.5"
                style={{ color: "var(--color-accent)" }}
              >
                {m.year}
              </span>
              <div>
                <div className="text-sm font-medium">{m.text}</div>
                <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {m.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data sources */}
      <div
        className="rounded-lg p-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h3 className="text-lg font-semibold mb-2">Data Sources</h3>
        <div
          className="space-y-2 text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          <p>
            <strong style={{ color: "var(--color-crossref)" }}>Crossref</strong>
            {" "}&mdash; The primary scholarly metadata registry. Publishers
            deposit metadata when registering DOIs. What appears in Crossref is
            exactly what the publisher chose to provide. Crossref does not
            enrich or add metadata &mdash; it is a deposit-only system. When a
            field is empty, the publisher simply did not include it.
          </p>
          <p>
            <strong style={{ color: "var(--color-openalex)" }}>OpenAlex</strong>
            {" "}&mdash; An open catalog of 250M+ scholarly works that enriches
            metadata by harvesting from multiple sources: ORCID (author
            identifiers and ORCIDs), ROR (institutional affiliations with
            persistent IDs), Unpaywall (open access locations and licenses
            across multiple repositories), PubMed (abstracts as inverted
            indices, MeSH terms), and automated topic/concept classification.
            OpenAlex stores licenses, PDFs, and version information across
            multiple <code>locations[]</code> (journals, repositories,
            preprint servers), not just the primary location. The gap between
            Crossref and OpenAlex reveals what third parties must reconstruct
            because publishers did not deposit it in the first place.
          </p>
        </div>
      </div>

      {/* How we read each source */}
      <div
        className="rounded-lg p-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h3 className="text-lg font-semibold mb-2">
          How We Read Each Source
        </h3>
        <div
          className="space-y-3 text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          <p>
            <strong style={{ color: "var(--color-crossref)" }}>
              Crossref:
            </strong>
            {" "}Full records without <code>select</code> parameter, so all
            fields are returned including <code>language</code>,{" "}
            <code>clinical-trial-number</code>, and nested sub-fields like
            author affiliation ROR IDs. When a field is absent from the JSON,
            it means the publisher did not deposit it &mdash; Crossref does not
            return <code>null</code> or empty strings for missing fields, it
            simply omits them.
          </p>
          <p>
            <strong style={{ color: "var(--color-openalex)" }}>
              OpenAlex:
            </strong>
            {" "}Records include <code>abstract_inverted_index</code> (checked
            for &gt;10 words to exclude fragments),{" "}
            <code>authorships[].institutions[].ror</code> for affiliations,{" "}
            <code>keywords[]</code> and <code>mesh[]</code> for subject
            classification, <code>funders[]</code> and <code>awards[]</code>{" "}
            for funding, and all <code>locations[]</code> for licenses and
            PDFs (not just <code>primary_location</code>). This is critical
            because OpenAlex distributes open access information across
            multiple repository locations.
          </p>
        </div>
      </div>

      {/* Data */}
      <div
        className="rounded-lg p-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h3 className="text-lg font-semibold mb-2">Data</h3>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          All data is fetched from public APIs
          (Crossref, OpenAlex) with no proprietary sources. Data was last collected
          in March 2026.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="https://zenodo.org/records/19363137"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: "var(--color-surface-alt)",
              color: "var(--color-accent)",
              border: "1px solid var(--color-border)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
            }}
          >
            <span style={{ fontFamily: "monospace", fontSize: 14 }}>&#8599;</span>
            Dataset on Zenodo
          </a>
        </div>
        <p className="text-sm mt-4" style={{ color: "var(--color-text-muted)" }}>
          Made by{" "}
          <a href="https://rijdho.github.io" style={{ color: "var(--color-accent)" }}>Ricardo Hartley Belmar</a>{" "}
          (ORCID{" "}
          <a href="https://orcid.org/0000-0001-5058-9309" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)" }}>0000-0001-5058-9309</a>).
          The code of this page is under the MIT licence; its data and texts are under{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)" }}>CC BY 4.0</a>.
        </p>
      </div>

    </div>
  );
}
