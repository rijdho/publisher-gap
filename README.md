# Publisher Gap

**A dashboard that compares the metadata of journal articles in Crossref with the record
OpenAlex holds for the same articles, for 14 publishers and the years 2015 to 2025.**

The page reads data files that were computed beforehand and asks nothing of Crossref or
OpenAlex when it is opened. It loads its fonts and scripts from its own address only.

For people who work with research information and want to see, field by field, what a
publisher deposits and what an aggregator holds.

🔗 **Live:** https://rijdho.github.io/publisher-gap/

The page is in English.

## What it shows

- **Overview:** a score for each of the 14 publishers in each source, its change over the years
  of publication, and a grid of fields by publisher.
- **Gap Analysis:** the five categories of fields over the years, each field over the years,
  and the difference between the two sources field by field.
- **A page per publisher**, reached from the ranking table.
- **About:** the fields by category, the method and the sources.

## The data

The data files in `public/data/` hold the results for 835,664 Crossref records of journal
articles and the OpenAlex record of each, where there is one. The answers of the two sources
were fetched on 2026-03-30 and 2026-03-31. The files are computed by a pipeline that is not
part of this repository; a dataset of the same 835,664 articles,
published on 2026-03-31, is on Zenodo (https://doi.org/10.5281/zenodo.19363053).

## Tests

```bash
npm test
```

The tests check that the copy of the shared stylesheet in `src/house/` is the one its lock
records, and that it is loaded before the page's own styles. The charts have no tests.

## Run locally

```bash
npm ci
npm run dev
```

## Deploy

A push to `main` runs the tests, builds the page and publishes it to GitHub Pages
(`.github/workflows/deploy.yml`). The build adds a Content-Security-Policy to the page.

## Caveats

- **The two sources are not always asked the same thing.** A check of the fields made on
  2026-11-25 found that for eight of the 38 compared fields the Crossref check and the OpenAlex
  check do not ask the same thing (for example, the subjects of an article in Crossref against
  the topics OpenAlex assigns by itself), and that some fields have exactly as many records as
  another field. The scores on the page do not account for this yet.
- **A category named "Essential" is the page's own grouping.** It does not say that Crossref
  requires the field.
- **The texts of the page were written with the data of March 2026** and have not been reviewed
  since.
- **The data are of March 2026.** Both sources have changed since.
- **A score is a weighted mean of shares of records**, per publisher, and the figure for all
  publishers is a plain mean of theirs: each publisher counts once, whatever its size.

## License

Copyright 2026 Ricardo Hartley Belmar. The code is under the [MIT License](LICENSE). The data
files and the texts of the page are under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Inter, in `src/house/fonts/`, is
under the SIL Open Font License 1.1. [`NOTICE`](NOTICE) carries all three.
