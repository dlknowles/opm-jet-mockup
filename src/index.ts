const path = window.location.pathname; // Get the path
const pathSegments = path.split('/'); // Split the path into segments
const fileName = pathSegments[pathSegments.length - 1]; // Get the last segment
console.log(fileName);

if (fileName === 'results.html') {
    const staticSeriesData = './data/series.json';
    fetchSeries(staticSeriesData);

    const matchRanges = [
        { min: 0, max: 69, color: "red", copy: "very weak" },
        { min: 70, max: 79, color: "orange", copy: "somewhat weak" },
        { min: 80, max: 89, color: "yellow", copy: "somewhat strong" },
        { min: 90, max: 100, color: "green", copy: "very strong" }
    ];

    async function fetchSeries(staticSeriesData: any) {
        try {
            const res = await fetch(staticSeriesData);
            const data = await res.json();
            const seriesArr = data['series'];
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
                    <a href="#series-${i}" class="usa-link series-name">${series.gsNumber} - ${series.gsName}</a>
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
            const results = document.querySelectorAll('.result');
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
            prevButton.addEventListener('click', function () {
                let currentIndex = findCurrentIndex();

                // Only decrement the index if it's not already at 0
                if (currentIndex > 0) {
                    currentIndex--;
                    // Scroll to the new current element
                    results[currentIndex].scrollIntoView({ behavior: "smooth" });
                }
            });
            nextButton.addEventListener('click', function () {
                let currentIndex = findCurrentIndex();

                // Only increment the index if it's not already at the last element
                if (currentIndex < results.length - 1) {
                    currentIndex++;
                    // Scroll to the new current element
                    results[currentIndex].scrollIntoView({ behavior: "smooth" });
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

if (fileName === 'quiz.html') {
    const staticQuestionsData = './data/questions.json';
    fetchQuestions(staticQuestionsData);

    async function fetchQuestions(staticQuestionsData: any) {
        try {
            const res = await fetch(staticQuestionsData);
            const data = await res.json();
            const questionsArr = data['questions'];
            console.log(questionsArr);

            const addRadioButtons = (n: number, fieldsetId: string) => {
                const fieldset = document.querySelector('#' + fieldsetId);
                for (let i = 1; i <= n; i++) {
                    let radioId = `${fieldsetId}-r${i}`;  // Generate a unique id for each radio button
                    let radioName = `${fieldsetId}-rating`;  // Generate a unique name for each group of radio buttons
                    let html = `
                    <div class="usa-radio">
                        <input class="usa-radio__input" id="${radioId}" type="radio" name="${radioName}" value="${i}" />
                        <label class="usa-radio__label" for="${radioId}">${i}</label>  <!-- Use the unique id -->
                    </div>
                    `;
                    if (fieldset) {
                        fieldset.innerHTML += html;
                    }
                }
            };

            const questionsContainer = document.querySelector('#quiz-questions');

            if (questionsContainer) {
                questionsArr.forEach((question: any, i: number) => {
                    let fieldsetId = `rating${i}`;
                    let html = `
                    <div class="quiz-question">
                        <h2>Question #${i + 1}</h2>
                        <p class="question usa-prose">How interested are you in doing the following activities at work?</p>
                        <p class="usa-prose">${question.question}</p>
                        <fieldset class="usa-fieldset">
                            <legend class="usa-legend">Select one rating</legend>
                            <div class="radio-group" id="${fieldsetId}"></div>
                            <div class="rating-choices">
                                <div>Not interested</div>
                                <div>Extremely interested</div>
                            </div>
                        </fieldset>
                    </div>
                    `;
                    questionsContainer.innerHTML += html;
                    addRadioButtons(5, fieldsetId);
                });
            }

            const questionContainers = document.querySelectorAll('.quiz-question');
            const prevButton = document.querySelector('#prev');
            const nextButton = document.querySelector('#next');
            let currentQuestionIndex = 0;

            // const getNextVisibleQuestionIndex = () => {
            //     for (let i = 0; i < questionContainers.length; i++) {
            //         const question = questionContainers[i];
            //         const questionRect = question.getBoundingClientRect();
            //         if (questionRect.top >= 0 && questionRect.bottom <= window.innerHeight) {
            //             return i;
            //         }
            //     }
            //     return -1;
            // };

            const navigateToQuestion = (index: number) => {
                if (index >= 0 && index < questionContainers.length) {
                    questionContainers[index].scrollIntoView({ behavior: 'smooth' });
                    currentQuestionIndex = index;
                }
            };

            prevButton.addEventListener('click', () => {
                navigateToQuestion(currentQuestionIndex - 1);
            });

            nextButton.addEventListener('click', () => {
                navigateToQuestion(currentQuestionIndex + 1);
            });

            const radioButtons = document.querySelectorAll('.usa-radio__input');
            radioButtons.forEach((radioButton) => {
                radioButton.addEventListener('change', () => {
                    navigateToQuestion(currentQuestionIndex + 1);
                });
            });

        } catch (error) {
            console.error('Error:', error);
        }
    }
}