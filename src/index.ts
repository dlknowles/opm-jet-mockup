const staticData = './data/data.json';

const matchRanges = [
    { min: 0, max: 69, color: "red", copy: "very weak" },
    { min: 70, max: 79, color: "orange", copy: "somewhat weak" },
    { min: 80, max: 89, color: "yellow", copy: "somewhat strong" },
    { min: 90, max: 100, color: "green", copy: "very strong" }
];

fetch(staticData)
    .then(response => response.json())
    .then((series) => {
        const seriesArr = series['series'];
        seriesArr.sort((a: any, b: any) => {
            if (a.match < b.match) {
                return 1;
            }
            if (a.match > b.match) {
                return -1;
            }
            return 0;
        });
        console.log(seriesArr);

        const topSeriesList = document.querySelector('#top-series-list');
        if (topSeriesList) {
            const top10 = seriesArr.slice(0, 10);
            top10.forEach((series: any, i: number) => {
                let html = `
                <li>
                    <a href="#series-${i}" class="usa-link series-name">${series.gsNumber} | ${series.gsName}</a>
                </li>
                `;
                topSeriesList.innerHTML += html;
            });
        }

        const seriesContainer = document.querySelector('#data');
        if (seriesContainer) {
            seriesArr.forEach((series: any, i: number) => {

                // Get the match number for the series
                let match = series.match;

                // Find the color range that match falls into
                let matchRange = matchRanges.find(range => match >= range.min && match <= range.max);

                // Get the color class from the color range, or a default class if no range is found
                let matchColor = matchRange ? matchRange.color : "";
                let matchCopy = matchRange ? matchRange.copy : "";

                let html = `
                <div class="grid-row grid-gap result" id="series-${i}">
                    <div class="tablet:grid-col-3 match bg-blue text-align-right">
                        <h2 class="match-number match-color-${matchColor}">${series.match}% Match</h2>
                        <p class="usa-prose">Your interests have a <strong class="match-color-${matchColor}">${matchCopy} alignment</strong> with jobs in this series</p>
                    </div>
                    <div class="tablet:grid-col series">
                        <div class="series-detail">
                            <h2><span class="series-name">${series.gsName}</span><span>${series.gsNumber}</span></h2>
                            <p class="usa-prose">${series.gsDescription}</p>
                        </div>
                        <div class="series-actions">
                            <div class="usa-button-group">
                                <a href="#" class="usa-button usa-button--outline">Explore related series</a>
                                <a href="#" class="usa-button">Search this series on USAJOBS</a>
                            </div>
                        </div>
                        <div class="series-jobs">
                            <h3>Common job titles for the <span class="series-name">${series.gsName}</span></h3>
                            <div class="usa-accordion usa-accordion--bordered usa-accordion--multiselectable" data-allow-multiple>
                                ${series.jobs.map((job: any, i: number) => `
                                <h4 class="usa-accordion__heading">
                                    <button type="button" class="usa-accordion__button" ${(i === 0) ? 'aria-expanded="true"' : 'aria-expanded="false"'} aria-controls="a${job.jobId}">${job.jobName}</button>
                                </h4>
                                <div id="a${job.jobId}" class="usa-accordion__content" ${(i === 0) ? '' : 'hidden'}>
                                    <p class="usa-prose">${job.jobDescription}</p>
                                </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                `;
                seriesContainer.innerHTML += html;

            });
        }

    })
    .then(() => {
        const results = document.querySelectorAll('.result');

        // Get the prev and next buttons
        const prevButton = document.querySelector('#prev');
        const nextButton = document.querySelector('#next');

        // Function to find the index of the element in the viewport
        function findCurrentIndex() {
            let minDistance = Number.MAX_SAFE_INTEGER;
            let closestIndex = 0;

            results.forEach((result, index) => {
                let distance = Math.abs(result.getBoundingClientRect().top);
                if (distance < minDistance) {
                    closestIndex = index;
                    minDistance = distance;
                }
            });

            return closestIndex;
        }

        // Add event listener for the prev button
        prevButton.addEventListener('click', function () {
            let currentIndex = findCurrentIndex();

            // Only decrement the index if it's not already at 0
            if (currentIndex > 0) {
                currentIndex--;
                // Scroll to the new current element
                results[currentIndex].scrollIntoView({ behavior: "smooth" });
            }
        });

        // Add event listener for the next button
        nextButton.addEventListener('click', function () {
            let currentIndex = findCurrentIndex();

            // Only increment the index if it's not already at the last element
            if (currentIndex < results.length - 1) {
                currentIndex++;
                // Scroll to the new current element
                results[currentIndex].scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    )
    .catch(error => console.error('Error:', error));

// document.addEventListener('DOMContentLoaded', function () {

// });