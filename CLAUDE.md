# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static web application that queries the CMS (Centers for Medicare & Medicaid Services) public API to calculate the number and proportion of Medicare Part B procedures submitted by Advanced Practice Providers (APPs) from 2010-2024. APPs include physician assistants, nurse practitioners, CRNAs, clinical nurse specialists, and certified nurse midwives.

## Development

No build system — the app is vanilla HTML + JavaScript served as static files. Open `index.html` directly or use any static file server. Styling via CMS Design System v9.0.1 CDN. Chart.js v4.4.7 via CDN.

### Testing

```bash
node --test test/snapshot.test.js
```

Zero-dependency snapshot test using Node's built-in test runner. First run saves a fixture to `test/fixtures/snapshot_31237.json`; subsequent runs compare against it. Delete the fixture file to regenerate.

`script.js` is dual-environment: DOM code is guarded by `typeof document !== 'undefined'` and functions are exported via conditional `module.exports` for Node test imports.

## Architecture

All application logic lives in `script.js`; the UI is in `index.html` with inline CSS.

**Data pipeline flow:**
1. User enters up to 25 semicolon-separated HCPCS procedure codes
2. All 15 years (2010-2024) are fetched concurrently via `Promise.all()` from CMS Data API (`data.cms.gov`), with recursive pagination in 5000-record pages (`fetchPaginatedData`)
3. `filterColumns` normalizes column names across years (CMS renamed `SUBMITTED_SERVICE_CNT` to `PSPS_SUBMITTED_SERVICE_CNT` in 2020) and handles redacted `"*"` values (2021+)
4. `collapseByAdvancedPracticeProvider` aggregates procedure counts by year and clinician type
5. `addAdvancedPracticePct` calculates APP vs physician proportions
6. `buildTaggedData` produces the final row objects used by both the chart and CSV download

**Results display:** Line chart (Physicians omitted; they are the complement). The aggregate "All Advanced Practice Providers" line is drawn on top with heavier weight; individual specialty lines are thinner. Lines with all-zero data are omitted. Direct labels at line endpoints replace a legend.

**Key data mappings in `script.js`:**
- `yearDatasetMap` — maps each year to its CMS dataset ID
- `advancedPracticeProviderCodes` — the 5 provider specialty codes that define APPs ("42", "43", "50", "89", "97")
- `validProviderSpecCodes` — full set of 60+ valid provider codes
- `yearColumnMap` — handles the 2020 column name change

## CMS Data API notes

- Public, no auth required. Base: `data.cms.gov/data-api/v1/dataset/{id}/data`
- Max page size is 5000 (not 1000 as docs suggest). Filter-only — no aggregation, no SQL, no COUNT.
- `group_by` parameter does NOT aggregate; it returns one arbitrary row per group. Do not use it.
- CMS suppresses counts <11 with `"*"` starting in 2021, making `psps_submitted_service_cnt` a string field.
