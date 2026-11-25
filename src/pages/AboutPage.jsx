import { CATEGORY_ORDER, CATEGORIES } from "../lib/categories";
import useGapData from "../hooks/useGapData";

const CATEGORY_FIELDS = {
  findable_essential: [
    "Title", "Abstract", "Author", "Author Affiliation", "DOI",
    "Publication Date", "Publisher", "Resource Type", "Subject / Keywords †",
    "Funder Name", "Container Title", "Language",
  ],
  findable_support: [
    "Author ORCID", "All Authors ORCID", "Funder DOI †", "Award Number",
    "ISSN", "Volume", "Issue", "Page",
    "Published Print Date †", "Published Online Date †", "Article Number *",
  ],
  accessible_essential: [
    "License", "License URL †", "Open Access License", "Full-text Links †",
    "Resource URL", "References", "References Count †", "Is Referenced By †",
    "Update Policy *",
  ],
  accessible_support: [
    "JATS Abstract *", "Author Sequence †", "Affiliation IDs (ROR)",
    "Relations †", "Assertions *", "Archive *",
  ],
  evaluation_coara: [
    "CRediT Author Roles *", "Complete Author Names", "Affiliation with ROR †",
    "Complete Funding Info", "Data Availability Statement *",
    "Preprint / Version Link †", "Peer Review Metadata *",
    "Clinical Trial Number *", "Structured Abstract *", "Open Access Status",
  ],
};

export default function AboutPage() {
  const { data } = useGapData();
  const publishers = data ? data.publishers : [];
  const mandates = data ? data.mandates : [];
  return (
    <div className="max-w-3xl space-y-8 fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">About Publisher Gap</h2>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Publisher Gap counts which metadata fields the Crossref records of
          journal articles hold, publisher by publisher and year by year, and
          sets them beside the OpenAlex records of the same articles. The
          question behind it:
          <strong style={{ color: "var(--color-text)" }}>
            {" "}how much of the metadata of an article is in its Crossref record?
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
            journal articles</strong> from 14 publishers (2015-2025), the mean
            score of the publishers over the 26 compared fields is 59.6% for
            Crossref and 77.7% for OpenAlex. By publisher, the difference runs
            from 8.1 to 30.6 percentage points. Over the 10 fields this page
            classifies as voluntary, the mean score is 30.7% for Crossref and
            56.5% for OpenAlex. A score weights the fields by group (see
            Methodology). With every field counting the same, the figures are
            65.4% and 79.0% over the 26 fields, and 30.0% and 57.9% over the 10.
          </p>
          <p>
            The largest differences are in Affiliation IDs (ROR), Author
            Affiliation, Author ORCID and Language: for these the OpenAlex
            record has a value far more often than the Crossref record. OpenAlex
            detects the language of a work itself and maps every institution to
            a ROR record, so for Language and Affiliation IDs (ROR) the
            difference also measures what OpenAlex adds.
          </p>
          <p>
            CRediT roles and data availability statements were found in none of
            the 8,026 Crossref records of a sample read in March 2026. They are
            not among the compared fields.
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
        <h3 className="text-lg font-semibold mb-2">The Author's Reading</h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          The reading behind this page is that changes in these fields follow
          <strong style={{ color: "var(--color-text)" }}> outside events and joint commitments</strong>
          {" "}(open access policies of funders such as Plan S, the
          Participation Reports of Crossref, the ORCID open letter that
          publishers signed) more than the initiative of a single publisher.
          This is the author's reading: the page shows the share of records
          with each field by year, and the timeline below gives the dates of
          those events, but the page does not test what caused a change.
        </p>
        <p
          className="text-sm leading-relaxed mt-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          This matters for initiatives like
          <strong style={{ color: "var(--color-text)" }}> CoARA</strong>
          {" "}(Coalition for Advancing Research Assessment): research
          assessment that looks at who contributed what needs that information
          in the record of the article.
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
            {" "}For each publisher and year (2015-2025), the page reads up to
            <strong style={{ color: "var(--color-accent)" }}>
              {" "}8,000 journal articles per publisher and year
            </strong>
            {" "}from Crossref, filtered to{" "}
            <code>type:journal-article</code>. Within a year the articles were
            asked by quarter and taken in the order Crossref returned them: they
            are not a random sample of the publisher's articles. Seven
            publishers have 8,000 articles in every year. The other seven have
            fewer in some or all years; the table below gives the articles read
            for each publisher. For Elsevier (every year), SciELO (2021-2025)
            and Hindawi (2015-2016) fewer articles were read than the limit
            although Crossref holds more; the reason was not examined.
          </p>
          <p>
            <strong style={{ color: "var(--color-text)" }}>
              Control with Crossref's own counts:
            </strong>
            {" "}On 25 November 2026 Crossref was asked, for each publisher and
            year, how many of its journal articles pass eight of its own filters
            (has-abstract, has-affiliation, has-orcid, has-funder, has-award,
            has-references, has-license, has-ror-id). Of 1,216 cases (publisher,
            year, field), the share on this page lies within 5 percentage points
            of Crossref's count in 1,102, below it in 108 and above it in 6. The
            cases below are mostly of Elsevier and Springer Nature. As means of
            the eleven years: Elsevier references 54.9% on this page and 78.4%
            by Crossref's count, funder name 25.1% and 43.2%, ORCID iDs 17.9%
            and 28.0%; Springer Nature licence 46.9% and 95.0%. The two are not
            the same measurement: Crossref counts every journal article of the
            publisher on the day asked, with its own definition of each filter.
            For these two publishers the Crossref figures of this page are
            lower than Crossref's own.
          </p>
          <p>
            <strong style={{ color: "var(--color-text)" }}>Why only journal articles?</strong>
            {" "}Publishers also register records of other types. On 25
            November 2026, 5% of the Crossref records of Elsevier, which
            registers the DOIs of SSRN, were posted content, and 37% of those
            of Springer Nature and 32% of those of Taylor &amp; Francis were
            book chapters. These types are described with other fields, so the
            page reads only records of{" "}
            <code>type:journal-article</code>.
          </p>
          <p>
            <strong style={{ color: "var(--color-text)" }}>Matching:</strong>
            {" "}The same DOIs are then queried in OpenAlex using batch DOI
            filters (50 DOIs per request), so each field is compared on the same
            articles in both sources. OpenAlex returned a
            record for 833,448 of the 835,664 articles, and for more than 99% of
            the articles of each publisher.
          </p>
          <p>
            <strong style={{ color: "var(--color-text)" }}>Evaluation:</strong>
            {" "}Each article is checked for 48 metadata fields in 5 groups;
            <strong style={{ color: "var(--color-text)" }}> 26 of them</strong>
            {" "}are compared (see the revision of 25 November 2026 below).
            Each field has one check for each source, because the two sources
            do not hold the data in the same form.
                        For example, Crossref stores authors in{" "}
            <code>author[]</code> while OpenAlex uses{" "}
            <code>authorships[]</code>; Crossref stores abstracts as XML strings
            while OpenAlex uses an inverted index; OpenAlex distributes licenses
            across multiple <code>locations[]</code> rather than a single field.
          </p>
          <p>
            <strong style={{ color: "var(--color-text)" }}>
              Comparable vs non-comparable fields:
            </strong>
            {" "}Of the 48 fields, <strong style={{ color: "var(--color-accent)" }}>38 are comparable</strong>
            {" "}(the page has a check for both Crossref and OpenAlex). The
            remaining 10 have a check for one source only or for none (for
            example JATS Abstract and Assertions, which only Crossref has).
            Fields marked with * below are non-comparable and excluded from all charts.
          </p>
          <p>
            <strong style={{ color: "var(--color-text)" }}>The score:</strong>
            {" "}The score of a set of records is computed in two steps: the
            mean, in each group, of the percentage of records with each compared
            field of the group, and then the weighted mean of the groups
            (Findable Essential 30%, Findable Support 15%, Accessible Essential
            25%, Accessible Support 10%, Evaluation / CoARA 20%). The groups,
            their names and the weights are the author's and follow no standard;
            "Essential" does not mean required by Crossref. Accessible Support
            holds one compared field, Affiliation IDs (ROR), which so carries
            10% of the score over the 26 fields.
          </p>
          <p>
            <strong style={{ color: "var(--color-text)" }}>
              Revision of 25 November 2026:
            </strong>
            {" "}Of the 38 comparable fields, the dashboard now uses 26. Eight were
            left out because their two checks do not ask Crossref and OpenAlex the
            same thing: Subject / Keywords, Published Print Date, Published Online
            Date, Relations, Preprint / Version Link, Funder DOI, Is Referenced By
            and Full-text Links. Four were left out because they have exactly as
            many records as another field in both sources:
            License URL, References Count, Affiliation with ROR and Author
            Sequence. These twelve are marked with † below. Three pairs of the
            26 fields are still equal, or nearly, in one source: Open Access
            License and Open Access Status in Crossref, Award Number and
            Complete Funding Info in OpenAlex, and Author Affiliation and
            Affiliation IDs (ROR) in OpenAlex. A field that holds only a
            placeholder (such as "0", "None" or "N/A") is no longer counted as
            present: 3,894 cases in the Crossref records and 41 in the OpenAlex
            records. In 3,661 of the Crossref cases the placeholder is an issue
            or a volume given as "0". With all 38 fields and every value counted, as shown here
            until that day, the mean score was 56.7% for Crossref and 78.3% for
            OpenAlex; it is now 59.6% and 77.7%.
          </p>
          <p>
            <strong style={{ color: "var(--color-text)" }}>
              TDM license filtering:
            </strong>
            {" "}Licence URLs under elsevier.com/tdm and springer.com/tdm, which are
            licences for text and data mining (TDM), are not counted in Open Access License. The field License
            counts any licence URL.
          </p>
          <p>
            <strong style={{ color: "var(--color-text)" }}>
              Voluntary vs automatic fields:
            </strong>
            {" "}The page classifies 10 of the compared fields as{" "}
            <strong style={{ color: "var(--color-voluntary)" }}>voluntary</strong> (Abstract,
            Author Affiliation, Affiliation IDs (ROR), Author ORCID, All Authors
            ORCID, Funder Name, Award Number, Complete Funding Info, References,
            Open Access License) and the other 16 as{" "}
            <strong style={{ color: "var(--color-enrichment)" }}>automatic</strong> (for
            example title, DOI, publisher, ISSN, volume, page). The
            classification is the author's and follows no standard; it is not
            Crossref's division between required and optional elements. A field
            classified as automatic is not in every record: Language is in 59.2%
            of the Crossref records. The heatmap and the timeline open on the
            voluntary fields only. Toggle "Voluntary only" to see all compared fields.
          </p>
          <p>
            <strong style={{ color: "var(--color-text)" }}>
              Temporal analysis:
            </strong>
            {" "}Every figure is also computed by year of publication.
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
          Journal articles of 2015 to 2025 read from Crossref in March 2026,
          up to 8,000 per publisher and year.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                <th className="text-left py-1.5 px-2" style={{ color: "var(--color-text-muted)" }}>Publisher</th>
                <th className="text-left py-1.5 px-2" style={{ color: "var(--color-text-muted)" }}>Category</th>
                <th className="text-right py-1.5 px-2" style={{ color: "var(--color-text-muted)" }}>Articles read</th>
              </tr>
            </thead>
            <tbody>
              {publishers.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td className="py-1.5 px-2">{p.label}</td>
                  <td className="py-1.5 px-2" style={{ color: "var(--color-text-muted)" }}>{p.categoryLabel}</td>
                  <td className="py-1.5 px-2 text-right font-mono" style={{ color: "var(--color-text-muted)" }}>{p.totalWorksSampled.toLocaleString("en-US")}</td>
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
          The 48 Fields in 5 Categories
        </h3>
        <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
          The 26 fields without a mark are the ones the charts use. Fields marked
          with * are non-comparable; fields marked with † were left out on 25 November 2026.
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
                    const isNonComp = f.endsWith("*") || f.endsWith("†");
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
        <h3 className="text-lg font-semibold mb-3">Timeline of Policies and Infrastructure</h3>
        <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
          Events related to the compared fields, each with a source, read on
          25 November 2026. Vertical lines in the timeline charts
          mark these years. The page does not test whether an event caused a change.
        </p>
        <div className="space-y-3">
          {mandates.map((m) => (
            <div key={m.year} className="flex gap-3 items-start">
              <span
                className="text-sm font-mono font-bold flex-shrink-0 mt-0.5"
                style={{ color: "var(--color-accent)" }}
              >
                {m.year}
              </span>
              <div>
                <div className="text-sm font-medium">{m.label}</div>
                <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {m.description}{" "}
                  <a href={m.source} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)" }}>Source</a>
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
            {" "}is a DOI registration agency. By its documentation, the
            metadata is deposited by its members, and Crossref adds ORCID and
            ROR identifiers in some cases, in its own words "where they are
            missing in the original deposit". So a value in a Crossref record
            is not always what the publisher deposited.
          </p>
          <p>
            <strong style={{ color: "var(--color-openalex)" }}>OpenAlex</strong>
            {" "}is an open catalogue of scholarly works, over 320 million by
            its documentation in November 2026. It builds its records from
            several sources, Crossref among them, and adds to them: every
            institution is mapped to a ROR record, the language of a work is
            detected by OpenAlex, and open access locations come from Unpaywall, which
            the same team runs on the same database. OpenAlex stores licences,
            PDFs and version information across multiple <code>locations[]</code>
            {" "}(journals, repositories, preprint servers), not just the primary
            location. So a value that is in the OpenAlex record and not in the
            Crossref record may come from another source or from OpenAlex
            itself; the page does not tell which.
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
            author affiliation ROR IDs. A field can be absent from the JSON or
            present and empty (an author with <code>"affiliation": []</code>,
            for example); the checks count both as not present.
          </p>
          <p>
            <strong style={{ color: "var(--color-openalex)" }}>
              OpenAlex:
            </strong>
            {" "}Records include <code>abstract_inverted_index</code> (checked
            for &gt;10 words to exclude fragments),{" "}
            <code>authorships[].institutions[].ror</code> for affiliations,{" "}
            <code>funders[]</code> and <code>awards[]</code>{" "}
            for funding, and all <code>locations[]</code> for licenses and
            PDFs (not just <code>primary_location</code>).
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
          (Crossref, OpenAlex) with no proprietary sources. The articles were read in March
          2026; the control counts and the shares of other record types were
          asked on 25 November 2026. The dataset on Zenodo is that of March
          2026, with 48 fields, before the revision of 25 November 2026.
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
