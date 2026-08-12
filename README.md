# advanced-practice-providers

A web application to calculate the number and proportion of procedures submitted to Medicare Part B by advanced practice providers (APPs; physician assistants, nurse practitioners, certified registered nurse anesthetists, anesthesiology assistants, certified clinical nurse specialists, and certified nurse midwives) between 2010 and 2025. 

**Live site:** [open-hsr.github.io/advanced-practice-providers](https://open-hsr.github.io/advanced-practice-providers)

The user inputs up to twenty-five HCPCS procedure codes separated by semicolons, and a request for all publicly available data is sent to the CMS API for the entered codes. Procedures submitted by APPs and physicians are identified with clinician specialty codes and summed. The proportion of procedures submitted by APPs and physicians is calculated, and the output includes a line chart and downloadable CSV file.

## What's in this repository

- **`index.html`** — the page you see when you visit the site. Static HTML; nothing to compile or install.
- **`script.js`** — all the logic behind the page: fetching data from CMS, aggregating it by year and clinician type, drawing the chart, building the CSV.
- **`test/`** — automated tests that check the calculations. Several different angles, including one that re-computes the numbers from CMS's full annual data files using a completely separate implementation, just to make sure the website's numbers agree. See [`test/README.md`](test/README.md) for details.
- **`CLAUDE.md`** — guidance notes for AI coding assistants working on this repo.
- **`LICENSE`** — open-source license.
- **`.gitignore`** — [a standard file](https://docs.github.com/en/get-started/git-basics/ignoring-files) that tells Git not to save certain files (like large CSVs downloaded for testing) to this repository

That's the whole repo. There's no build system, no server, no deploy step beyond pushing to GitHub.

---

## For maintainers

### Running the site locally

Open `index.html` directly in a browser, or serve the directory with any static file server (e.g. `python3 -m http.server`). No install step.

### Running the tests

All tests use Node's built-in test runner (Node 18+). No `npm install`, no dependencies.

```bash
node --test test/unit.test.js                                # fast, no network — safe for CI
node --test test/snapshot.test.js                            # ~30s, hits the CMS API
node --test --test-timeout=180000 test/consistency.test.js   # ~1min, hits the CMS API
node --test test/csv_reference/verify.test.js                # <1s, runs against committed fixture
```

See [`test/README.md`](test/README.md) for what each test catches and the env vars that opt into the slower / more expensive cases. The CSV-reference test has its own [README](test/csv_reference/README.md) covering the one-time bulk download needed to regenerate its fixture.

### Architecture and CMS API quirks

See [`CLAUDE.md`](CLAUDE.md). It documents the data pipeline, the year-era column-name change CMS made in 2020, the `"*"` redaction behavior in 2021+, and the rate-limit / concurrency handling around the CMS public API.
