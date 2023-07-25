/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (() => {

eval("const staticData = './data/data.json';\nconst matchRanges = [\n    { min: 0, max: 69, color: \"red\", copy: \"very weak\" },\n    { min: 70, max: 79, color: \"orange\", copy: \"somewhat weak\" },\n    { min: 80, max: 89, color: \"yellow\", copy: \"somewhat strong\" },\n    { min: 90, max: 100, color: \"green\", copy: \"very strong\" }\n];\nfetch(staticData)\n    .then(response => response.json())\n    .then((series) => {\n    const seriesArr = series['series'];\n    seriesArr.sort((a, b) => {\n        if (a.match < b.match) {\n            return 1;\n        }\n        if (a.match > b.match) {\n            return -1;\n        }\n        return 0;\n    });\n    console.log(seriesArr);\n    const container = document.getElementById('data');\n    if (container) {\n        seriesArr.forEach((series) => {\n            console.log(series);\n            // Get the match number for the series\n            let match = series.match;\n            // Find the color range that match falls into\n            let matchRange = matchRanges.find(range => match >= range.min && match <= range.max);\n            // Get the color class from the color range, or a default class if no range is found\n            let matchColor = matchRange ? matchRange.color : \"\";\n            let matchCopy = matchRange ? matchRange.copy : \"\";\n            let html = `\n                <div class=\"grid-row grid-gap result\">\n                    <div class=\"tablet:grid-col-3 match\">\n                        <h2 class=\"match-number match-color-${matchColor}\">${series.match}% Match</h2>\n                        <p class=\"usa-prose\">Your interests have a <strong class=\"match-color-${matchColor}\">${matchCopy} alignment</strong> with jobs in this series</p>\n                    </div>\n                    <div class=\"tablet:grid-col series\">\n                        <div class=\"series-detail\">\n                            <h2><span class=\"series-name\">${series.gsName}</span><span>${series.gsNumber}</span></h2>\n                            <p class=\"usa-prose\">${series.gsDescription}</p>\n                            <div class=\"usa-button-group\">\n                                <a href=\"${series.gsLink}\" class=\"usa-button\">Search this series on USAJOBS</a>\n                            </div>\n                        </div>\n                        <div class=\"series-jobs\">\n                            <h3 class=\"series-name\">${series.gsName} Jobs</h3>\n                            <div class=\"usa-accordion usa-accordion--bordered usa-accordion--multiselectable\" data-allow-multiple>\n                                ${series.jobs.map((job, i) => `\n                                <h4 class=\"usa-accordion__heading\">\n                                    <button type=\"button\" class=\"usa-accordion__button\" ${(i === 0) ? 'aria-expanded=\"true\"' : 'aria-expanded=\"false\"'} aria-controls=\"a${job.jobId}\">${job.jobName}</button>\n                                </h4>\n                                <div id=\"a${job.jobId}\" class=\"usa-accordion__content\" ${(i === 0) ? '' : 'hidden'}>\n                                    <p class=\"usa-prose\">${job.jobDescription}</p>\n                                </div>\n                                `).join('')}\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                `;\n            container.innerHTML += html;\n        });\n    }\n})\n    .catch(error => console.error('Error:', error));\n\n\n//# sourceURL=webpack://jet-prototype-v2/./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.ts"]();
/******/ 	
/******/ })()
;