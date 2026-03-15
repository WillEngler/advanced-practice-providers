# advanced-practice-providers

Software to calculate the number and proportion of procedures submitted to Medicare Part B by Advanced Practice Providers (APPs) between 2010 and 2024.

## Usage

Open `index.html` in a browser (or visit the GitHub Pages deployment). Enter up to 25 HCPCS procedure codes separated by semicolons, then click **Run Query**. Results are displayed as a line chart and can be downloaded as a CSV.

No build step, install, or server required — the app runs entirely in the browser using vanilla HTML and JavaScript.

## Running tests

```bash
node --test test/snapshot.test.js
```

Uses Node's built-in test runner (Node 18+). No dependencies to install. The first run saves a fixture to `test/fixtures/`; subsequent runs compare against it.
