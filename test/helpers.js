// Shared helpers for network-backed tests. Runs the same pipeline the browser
// runs in script.js's submit handler, and produces the same row shape as the
// CSV download.

const {
    yearDatasetMap,
    fetchPaginatedData,
    collapseByAdvancedPracticeProvider,
    addAdvancedPracticePct,
    clinicianTypeOrder,
    sortFinalData,
    buildTaggedData,
} = require('../script.js');

async function runQuery(codeList) {
    const selectedYears = Object.keys(yearDatasetMap);
    const verbose = typeof process !== 'undefined' && process.env && process.env.VERBOSE_FETCH === '1';

    if (verbose) console.log(`[query] starting [${codeList.join(', ')}] across ${selectedYears.length} years`);

    let completed = 0;
    const resultsPerYear = await Promise.all(
        selectedYears.map(async year => {
            const result = await fetchPaginatedData(yearDatasetMap[year], codeList, year);
            completed++;
            if (verbose) console.log(`[query] [${codeList.join(',')}] year ${year} done (${completed}/${selectedYears.length})`);
            return result;
        })
    );
    // Aggregate block only — the browser CSV additionally appends per-code
    // blocks for multi-code queries (buildAllTaggedData), but the consistency
    // tests' sum-invariant is defined over the aggregate rows.
    const combinedData = resultsPerYear.flat();
    const collapsedData = collapseByAdvancedPracticeProvider(combinedData);
    const finalData = sortFinalData(addAdvancedPracticePct(collapsedData));
    return buildTaggedData(finalData, codeList);
}

module.exports = { runQuery, clinicianTypeOrder };
