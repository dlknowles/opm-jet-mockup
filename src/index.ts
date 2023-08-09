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
                        <a href="#series-${i}" class="usa-link series-name" data-series-index="${i}">${series.number} - ${series.name}</a>
                    </li>
                    `;
                    topSeriesList.innerHTML += html;
                });

                topSeriesList.addEventListener('click', function (event) {
                    const targetElement = event.target as HTMLElement;
                    if (targetElement && targetElement.classList.contains('series-name')) {
                        event.preventDefault();

                        const seriesIndex = targetElement.getAttribute('data-series-index');
                        const scrollTargetElement = document.getElementById(`series-${seriesIndex}`);

                        if (scrollTargetElement) {
                            scrollTargetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            }

            const seriesContainer = document.querySelector('#data');
            if (seriesContainer) {
                let currentIndex = 0;
                const displaySeries = () => {
                    for (let i = currentIndex; i < currentIndex + 10 && i < seriesArr.length; i++) {
                        const series = seriesArr[i];

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
                                <!--<h2 class="match-number match-color-${matchColor}">${series.match}% Match</h2>
                                <p class="usa-prose">Your interests have a <strong class="match-color-${matchColor}">${matchCopy} alignment</strong> with jobs in this series</p>-->
                            </div>
                            <div class="tablet:grid-col series">
                                <div class="series-detail">
                                    <h2><span class="series-name">${series.number} - ${series.name}</span></h2>
                                    <p class="usa-prose">${series.description}</p>
                                    <div class="job-titles">
                                        <h3>Popular job titles for this series</h3>
                                        <p class="usa-prose">Here's a list of the <em>most applied to</em> job titles within the <span class="series-name">${series.name}</span>:</p>
                                        <ul class="usa-list">
                                        ${series.jobs.map((job: any, i: number) => `
                                        <li>${job.name}</li>
                                        `).join('')}
                                        </ul>
                                    </div>
                                </div>
                                <div class="series-actions">
                                    <div class="usa-button-group">
                                        <!--<a href="#" class="usa-button usa-button--outline">Explore related series</a>-->
                                        <a href="#" class="usa-button">Search this series on USAJOBS</a>
                                    </div>
                                </div>
                                <!--<div class="series-jobs">
                                    <h3>Common job titles for the <span class="series-name">${series.name}</span></h3>
                                    <div class="usa-accordion usa-accordion--bordered usa-accordion--multiselectable" data-allow-multiple>
                                        ${series.jobs.map((job: any, i: number) => `
                                        <h4 class="usa-accordion__heading">
                                            <button type="button" class="usa-accordion__button" ${(i === 0) ? 'aria-expanded="true"' : 'aria-expanded="false"'} aria-controls="a${job.id}">${job.name}</button>
                                        </h4>
                                        <div id="a${job.id}" class="usa-accordion__content" ${(i === 0) ? '' : 'hidden'}>
                                            <p class="usa-prose">${job.description}</p>
                                        </div>
                                        `).join('')}
                                    </div>
                                </div>-->
                            </div>
                        </div>
                        `;
                        seriesContainer.innerHTML += html;
                    };
                    currentIndex += 10;
                };

                displaySeries();

                const loadMoreButton = document.querySelector('#load-more');
                if (loadMoreButton) {
                    loadMoreButton.addEventListener('click', () => {
                        //console.log(currentIndex);
                        displaySeries();
                        if (currentIndex >= seriesArr.length) {
                            loadMoreButton.remove();
                        }
                    });
                }

            }

            const prevButton = document.querySelector('#prev');
            const nextButton = document.querySelector('#next');

            // Function to find the index of the element in the viewport
            function findCurrentIndex(results: any) {

                let minDistance = Number.MAX_SAFE_INTEGER;
                let closestIndex = 0;

                results.forEach((result: any, index: number) => {
                    let distance = Math.abs(result.getBoundingClientRect().top);
                    if (distance < minDistance) {
                        closestIndex = index;
                        minDistance = distance;
                    }
                });

                return closestIndex;
            }
            prevButton.addEventListener('click', function () {
                let results = document.querySelectorAll('.result');
                let currentIndex = findCurrentIndex(results);

                // Only decrement the index if it's not already at 0
                if (currentIndex > 0) {
                    currentIndex--;
                    // Scroll to the new current element
                    results[currentIndex].scrollIntoView({ behavior: "smooth" });
                }
            });
            nextButton.addEventListener('click', function () {
                let results = document.querySelectorAll('.result');
                let currentIndex = findCurrentIndex(results);

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
                const labels = ['Not Interested', 'Slightly Interested', 'Moderately Interested', 'Very Interested', 'Extremely Interested'];
                const fieldset = document.querySelector('#' + fieldsetId);
                for (let i = 1; i <= n; i++) {
                    let radioId = `${fieldsetId}-r${i}`;  // Generate a unique id for each radio button
                    let radioName = `${fieldsetId}-rating`;  // Generate a unique name for each group of radio buttons
                    let html = `
                    <div class="usa-radio">
                        <input class="usa-radio__input" id="${radioId}" type="radio" name="${radioName}" value="${i}" />
                        <label class="usa-radio__label" for="${radioId}">${labels[i - 1]}</label>  <!-- Use the unique id -->
                    </div>
                    `;
                    if (fieldset) {
                        fieldset.innerHTML += html;
                    }
                }
            };

            const questionsContainer = document.querySelector('.questions') as HTMLElement;
            if (questionsContainer) {
                questionsArr.forEach((question: any, i: number) => {
                    let fieldsetId = `rating${i}`;
                    let html = `
                    <div class="question">
                        <div>
                            <h2>Question #${i + 1}</h2>
                            <p class="usa-prose"><strong>How interested are you in doing these activities at work?</strong></p>
                            <p class="usa-prose">${question.question}</p>
                        </div>
                        <fieldset class="usa-fieldset">
                            <legend class="usa-legend">Select one rating</legend>
                            <div class="radio-group" id="${fieldsetId}"></div>
                        </fieldset>
                    </div>
                    `;
                    questionsContainer.innerHTML += html;
                    addRadioButtons(5, fieldsetId);
                });
            }

            let currentQuestionIndex = 0; //Outer scope this to imitate state

            const questions = document.querySelectorAll('.question');
            const navigateToQuestion = (index: number) => {
                if (index >= 0 && index < questions.length) {
                    questions[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                    currentQuestionIndex = index;

                    //Check if the question has been answered
                    if (isQuestionAnswered(questions[currentQuestionIndex])) {
                        nextButton.style.visibility = 'visible';
                    } else {
                        nextButton.style.visibility = 'hidden';
                    }
                }
                updateNextButtonState();
            };

            const prevButton = document.querySelector('#prev') as HTMLElement;
            if (prevButton) {
                prevButton.addEventListener('click', () => {
                    navigateToQuestion(currentQuestionIndex - 1);
                    updatePrevButtonVisibility();
                    updateNextButtonState();
                });
            }

            const nextButton = document.querySelector('#next') as HTMLElement;
            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    navigateToQuestion(currentQuestionIndex + 1);
                    updatePrevButtonVisibility();
                    updateNextButtonState();
                });
            }

            const isQuestionAnswered = (question: Element): boolean => {
                const radios = question.querySelectorAll('input[type="radio"]');
                for (let i = 0; i < radios.length; i++) {
                    if ((radios[i] as HTMLInputElement).checked) {
                        return true;
                    }
                }
                return false;
            };

            function updatePrevButtonVisibility() {
                if (prevButton) {
                    if (currentQuestionIndex === 0) {
                        prevButton.style.visibility = 'hidden';
                    } else {
                        prevButton.style.visibility = 'visible';
                    }
                }
            }
            updatePrevButtonVisibility();

            function updateNextButtonState() {
                if (nextButton) {
                    // Hide the button when on the last question
                    if (currentQuestionIndex === 24) {
                        nextButton.style.visibility = 'hidden';
                        return; // Exit the function early
                    }
                    // Get the current question based on index
                    const currentQuestion = questions[currentQuestionIndex] as HTMLElement;

                    // If the current question has been answered, show the button
                    if (isQuestionAnswered(currentQuestion)) {
                        nextButton.style.visibility = 'visible';
                    } else {
                        nextButton.style.visibility = 'hidden';
                    }
                }
            }
            updateNextButtonState();

            const radioButtons = document.querySelectorAll('.usa-radio__input');
            radioButtons.forEach((radioButton) => {
                radioButton.addEventListener('change', (e) => {
                    const currentRadioButton = e.target as HTMLInputElement;
                    const parentQuestion = currentRadioButton.closest('.question');
                    const questionIndex = Array.from(questions).indexOf(parentQuestion);

                    // Only navigate if the question hasn't been answered yet
                    if (!answeredQuestions.has(questionIndex)) {
                        navigateToQuestion(currentQuestionIndex + 1);
                        answeredQuestions.add(questionIndex);  // Mark the question as answered
                    }

                    updatePrevButtonVisibility();
                    updateNextButtonState();
                    updateSubmitButtonState();
                });
            });

            const qFirst = document.querySelector('#qFirst');
            if (qFirst) {
                qFirst.addEventListener('click', () => {
                    navigateToQuestion(0);
                    updatePrevButtonVisibility();
                    updateNextButtonState();
                });
            }

            const qLast = document.querySelector('#qLast');
            if (qLast) {
                qLast.addEventListener('click', () => {
                    const lastSlideIndex = questions.length - 1;
                    navigateToQuestion(lastSlideIndex);
                    updatePrevButtonVisibility();
                    updateNextButtonState();
                });
            }

            const complete = document.querySelector('#complete') as HTMLElement;

            complete.addEventListener('click', () => {
                questions.forEach((question, index) => {
                    const radioButtons = question.querySelectorAll('input[type="radio"]');
                    const randomIndex = Math.floor(Math.random() * radioButtons.length);  // Choose a random radio button to select
                    const radioButton = radioButtons[randomIndex] as HTMLInputElement;

                    radioButton.checked = true;
                    answeredQuestions.add(index);
                });

                // After automatically answering, update the visibility of the Next and Submit buttons.
                updateNextButtonState();
                updateSubmitButtonState();
                updateProgressBar();
            });

            const radioButtonsArr = document.querySelectorAll('.usa-radio__input');

            radioButtonsArr.forEach((radio) => {
                radio.addEventListener('change', updateProgress);
            });

            let answeredQuestions = new Set(); // To store the indices of answered questions

            function updateProgress(event: any) {
                const parentQuestion = event.target.closest('.question');
                const questionIndex = Array.from(questions).indexOf(parentQuestion);

                answeredQuestions.add(questionIndex);

                updateProgressBar();
            }

            function updateProgressBar() {
                const totalQuestions = questions.length;
                const answeredCount = answeredQuestions.size;

                const progressPercentage = (answeredCount / totalQuestions) * 100;

                (document.querySelector('#progressBar') as HTMLElement).style.width = `${progressPercentage}%`;
                (document.querySelector('#progressText') as HTMLElement).textContent = `Progress: ${Math.round(progressPercentage)}% Complete`;
            }

            function areAllQuestionsAnswered(): boolean {
                return Array.from(questions).every(questionElement => isQuestionAnswered(questionElement as HTMLElement));
            }

            const submitButton = document.querySelector('#submit-button') as HTMLElement;
            console.log(submitButton);

            function updateSubmitButtonState() {
                if (areAllQuestionsAnswered()) {
                    submitButton.style.visibility = 'visible';
                } else {
                    submitButton.style.visibility = 'hidden';
                }
            }
            updateSubmitButtonState();


        } catch (error) {
            console.error('Error:', error);
        }
    }
}