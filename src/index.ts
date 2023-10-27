const path = window.location.pathname; // Get the path
const pathSegments = path.split('/'); // Split the path into segments
const fileName = pathSegments[pathSegments.length - 1]; // Get the last segment
console.log(fileName);


document.getElementById('menuToggle')?.addEventListener('click', function () {
    document.querySelector('.mockup-nav')?.classList.toggle('hidden');
});


if (fileName === 'index.html') {

    const div1 = document.getElementById("div1");
    const div2 = document.getElementById("div2");
    const div3 = document.getElementById("div3");

    document.getElementById("showDiv1").addEventListener("click", function () {
        hideAllDivs();
        div1.style.display = "block";
    });

    document.getElementById("showDiv2").addEventListener("click", function () {
        hideAllDivs();
        div2.style.display = "block";
    });

    document.getElementById("showDiv3").addEventListener("click", function () {
        hideAllDivs();
        div3.style.display = "block";
    });

    function hideAllDivs() {
        div1.style.display = "none";
        div2.style.display = "none";
        div3.style.display = "none";
    }

}

if (fileName === 'results.html') {

    const loadingContainer = document.querySelector('.loading-container') as HTMLElement;
    const animation = document.querySelector('.loading-container > div') as HTMLElement;

    // Function to show the loading animation
    const showLoadingAnimation = () => {
        loadingContainer.style.display = 'flex';  // use 'flex' to center the beaker and bubbles
        setTimeout(() => {
            animation.style.opacity = '0';
        }, 3500);

        // After 5 seconds, start the fade-out effect
        setTimeout(() => {
            loadingContainer.style.opacity = '0';

            // After 1 more second (the duration of the fade-out effect), hide the loading container
            setTimeout(() => {
                loadingContainer.style.display = 'none';
            }, 1000);
        }, 4000);
    };

    // Call this function when you navigate to the results page
    showLoadingAnimation();

    const staticSeriesData = './data/jet-series.json';
    fetchSeries(staticSeriesData);

    const matchRanges = [
        { min: 0, max: 79, color: "red", copy: "weak" },
        { min: 80, max: 89, color: "orange", copy: "moderate" },
        { min: 90, max: 95, color: "lt-green", copy: "strong" },
        { min: 96, max: 100, color: "green", copy: "very strong" }
    ];

    async function fetchSeries(staticSeriesData: any) {
        try {
            const res = await fetch(staticSeriesData);
            const data = await res.json();
            console.log(data);
            const seriesArr = data['Series'];
            seriesArr.sort((a: any, b: any) => {
                if (a.Match < b.Match) {
                    return 1;
                }
                if (a.Match > b.Match) {
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
                        <a href="#series-${i}" class="usa-link series-name" data-series-index="${i}">${series.CodeName} Series</a>
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
                        let match = series.Match;
                        // Find the color range that match falls into
                        let matchRange = matchRanges.find(range => match >= range.min && match <= range.max);
                        // Get the color class from the color range, or a default class if no range is found
                        let matchColor = matchRange ? matchRange.color : "";
                        let matchCopy = matchRange ? matchRange.copy : "";

                        let html = `
                        <div class="grid-row grid-gap result" id="series-${i}">
                            <div class="tablet:grid-col-3 match bg-blue text-align-right">
                                <!--<h2 class="match-number match-color-${matchColor}">${series.Match}% Match</h2>-->
                                <p class="usa-prose">Based on your answers, your interests are a <strong class="match-color-${matchColor}">${matchCopy} match</strong> with this job series.</p>
                            </div>
                            <div class="tablet:grid-col series">
                                <div class="series-detail">
                                    <h2><span class="series-name">${series.CodeName} Series</span></h2>
                                    <p class="usa-prose">${series.Description}</p>
                                    <div class="job-titles">
                                        <h3>Most applied to job titles within this series</h3>
                                        <!--<p class="usa-prose">Here's a list of the <em>most applied to</em> job titles in the <span class="series-name">${series.Name}</span>:</p>-->
                                        <ul class="usa-list">
                                        ${series.JobTitles.map((job: any, i: number) => `
                                        <li>${job}</li>
                                        `).join('')}
                                        </ul>
                                    </div>
                                </div>
                                <div class="series-actions">
                                    <div class="usa-button-group">
                                        <!--<a href="#" class="usa-button usa-button--outline">Explore related series</a>-->
                                        <a href="https://www.usajobs.gov/Search/Results?j=${series.Code}" class="usa-button icon"><svg class="usa-icon" aria-hidden="true" focusable="false" role="img">
                                        <use xlink:href="assets/uswds/img/sprite.svg#search"></use>
                                      </svg> Find jobs in this series</a>
                                    </div>
                                </div>
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

            const prevButton = document.querySelector('#prev');
            if (prevButton) {
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
            }

            const nextButton = document.querySelector('#next');
            if (nextButton) {
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
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }
}

if (fileName === 'quiz-old.html') {
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

                    // // Only navigate if the question hasn't been answered yet
                    // if (!answeredQuestions.has(questionIndex)) {
                    //     navigateToQuestion(currentQuestionIndex + 1);
                    //     answeredQuestions.add(questionIndex);  // Mark the question as answered
                    // }

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

                const progressBar = document.querySelector('#progressBar') as HTMLElement;
                if (progressBar) {
                    progressBar.style.width = `${progressPercentage}%`;
                }
                const progressText = document.querySelector('#progressText') as HTMLElement;
                if (progressText) {
                    //progressText.textContent = `Progress: ${Math.round(progressPercentage)}% Complete`;
                    progressText.textContent = `Progress: ${Math.round(progressPercentage)}% Complete (${answeredCount}/${totalQuestions})`;

                }
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

if (fileName === 'quiz.html') {
    const staticQuestionsData = './data/questions.json';
    fetchQuestionsV3(staticQuestionsData);

    async function fetchQuestionsV3(staticQuestionsData: any) {
        try {
            const res = await fetch(staticQuestionsData);
            const data = await res.json();
            const questionsArr = data['questions'];

            const addRadioButtons = (n: number, fieldsetId: string) => {
                const labels = ['Not Interested', 'Slightly Interested', 'Moderately Interested', 'Very Interested', 'Extremely Interested'];
                const fieldset = document.querySelector('#' + fieldsetId);
                for (let i = 1; i <= n; i++) {
                    let html = `
                    <div class="selection" tabindex="0">
                        ${labels[i - 1]}
                    </div>
                    `;
                    if (fieldset) {
                        fieldset.innerHTML += html;
                    }
                }
            };

            const progressBar = document.querySelector('#progress-bar') as HTMLElement;
            const questionsContainer = document.querySelector('#quiz-container') as HTMLElement;

            if (questionsContainer) {

                let startScreen = `
                    <div class="question" data-question="0">
                        <div class="question-content submit-quiz">
                            <div>
                                <h2>Take this 25-question quiz and find out how well your interests align with jobs in the federal government.</h2>
                                <!--<h2>How interested are you in doing the following activities at work?</h2>-->
                                <a class="usa-button selection" tabindex="0">Continue</a>
                            </div>
                        </div>
                    </div>
                `;

                questionsContainer.innerHTML += startScreen;

                questionsArr.forEach((question: any, i: number) => {
                    let fieldsetId = `rating${i}`;
                    let html = `
                        <div class="question" data-question="${i + 1}">
                            <div class="question-content">
                            
                                    <h2><div class="question-number"><span class="sr-only">Question</span>${i + 1}</div><div class="question-text"><span class="question-number"><span class="sr-only">Question</span>${i + 1}. </span>Rate your interest</div></h2>
                                    <p>${question.question}</p>
        
                                <fieldset class="usa-fieldset">
                                    <legend class="usa-legend">Select one rating</legend>
                                    <div class="selections" id="${fieldsetId}"></div>
                                </fieldset>
                            </div>
                        </div>
                        `;
                    questionsContainer.innerHTML += html;
                    addRadioButtons(5, fieldsetId);
                });

                let completeScreen = `
                    <div class="question" data-question="26">
                        <div class="question-content submit-quiz">
                            <div>
                                <h2>Great!</h2>
                                <p>You've answered all the questions. <br>Submit the quiz to see your results.</p>
                                <a href="results.html" class="usa-button">See your results</a>
                            </div>
                        </div>
                    </div>
                `;

                questionsContainer.innerHTML += completeScreen;

                let currentQuestion = 0;

                const handleSelection = (target: HTMLElement) => {
                    target.closest('.selections')?.querySelectorAll('.selection').forEach((selection) => {
                        selection.classList.remove('selected');
                    });
                    target.classList.add('selected');

                    const currentElement = target.closest('.question') as HTMLElement;
                    const currentQuestionNumber = Number(currentElement.dataset.question);

                    if (currentQuestionNumber === currentQuestion) {
                        currentQuestion++;
                        navigateToQuestion(currentQuestion);
                        updateProgress();
                    }
                };

                const navigateToQuestion = (questionNumber: number) => {
                    const targetElement = questionsContainer.querySelector(`.question[data-question="${questionNumber}"]`) as HTMLElement;
                    console.log(targetElement);
                    if (targetElement) {
                        targetElement.style.display = 'flex';
                        setTimeout(() => {
                            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            if (questionNumber === 1) {
                                setTimeout(() => {
                                    (document.querySelector('.question[data-question="0"]') as HTMLElement).style.display = 'none';
                                }, 300);
                            }
                        }, 300);
                    }
                };

                const updateProgress = () => {
                    // Update progress bar
                    const progressPercentage = ((currentQuestion - 1) / questionsArr.length) * 100;
                    progressBar.style.width = progressPercentage + '%';

                    // Update progress text
                    const progressTextElement = document.querySelector('#progress-text');
                    if (progressTextElement) {
                        progressTextElement.textContent = `${Math.floor(progressPercentage)}% Complete | ${currentQuestion - 1}/25 Answered (progress saved!)`;
                    }
                };

                questionsContainer.addEventListener('click', function (event) {
                    const target = event.target as HTMLElement;
                    if (target.classList.contains('selection')) {
                        event.preventDefault();
                        handleSelection(target);
                    }
                });

                questionsContainer.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter' || event.key === ' ') {
                        const target = event.target as HTMLElement;
                        if (target.classList.contains('selection')) {
                            event.preventDefault();
                            handleSelection(target);
                        }
                    }
                });

                // Auto answer first 24 questions
                const autoAnswerButton = document.querySelector('#autoAnswer');
                if (autoAnswerButton) {
                    autoAnswerButton.addEventListener('click', function () {
                        for (let i = 1; i <= 24; i++) {
                            const questionElement = questionsContainer.querySelector(`.question[data-question="${i}"]`) as HTMLElement;
                            if (questionElement) {
                                const selections = questionElement.querySelectorAll('.selection');
                                const targetSelection = selections[0]; // Select the first option for simplicity
                                if (targetSelection) {
                                    handleSelection(targetSelection as HTMLElement);
                                }
                            }
                        }
                    });
                }

                // const prevButton = document.querySelector('.prev-button') as HTMLButtonElement;
                // const nextButton = document.querySelector('.next-button') as HTMLButtonElement;

                // if (prevButton) {
                //     prevButton.addEventListener('click', () => goToPreviousQuestion());
                // }
                // if (nextButton) {
                //     nextButton.addEventListener('click', () => goToNextQuestion());
                // }

                // const goToNextQuestion = () => {

                // };

                // const goToPreviousQuestion = () => {

                // };

                // const updateProgressBar = () => {
                //     const progressPercentage = (currentQuestion / questionsArr.length) * 100;
                //     console.log(progressPercentage);
                //     progressBar.style.width = progressPercentage + '%';
                // };

                // const updateProgressText = () => {
                //     const progressTextElement = document.querySelector('#progress-text');
                //     const progressPercentage = Math.floor((currentQuestion / questionsArr.length) * 100);

                //     if (progressTextElement) {
                //         progressTextElement.textContent = `Answered ${currentQuestion}/25 - ${progressPercentage}% Complete`;
                //     }
                // };

            }

        } catch (error) {
            console.error('Error:', error);
        }
    }
}