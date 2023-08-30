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
/***/ (function() {

eval("var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nconst path = window.location.pathname; // Get the path\nconst pathSegments = path.split('/'); // Split the path into segments\nconst fileName = pathSegments[pathSegments.length - 1]; // Get the last segment\nconsole.log(fileName);\nif (fileName === 'results.html') {\n    const staticSeriesData = './data/jet-series.json';\n    fetchSeries(staticSeriesData);\n    const matchRanges = [\n        { min: 0, max: 79, color: \"red\", copy: \"weak\" },\n        { min: 80, max: 89, color: \"orange\", copy: \"moderate\" },\n        { min: 90, max: 95, color: \"lt-green\", copy: \"strong\" },\n        { min: 96, max: 100, color: \"green\", copy: \"very strong\" }\n    ];\n    function fetchSeries(staticSeriesData) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                const res = yield fetch(staticSeriesData);\n                const data = yield res.json();\n                console.log(data);\n                const seriesArr = data['Series'];\n                seriesArr.sort((a, b) => {\n                    if (a.Match < b.Match) {\n                        return 1;\n                    }\n                    if (a.Match > b.Match) {\n                        return -1;\n                    }\n                    return 0;\n                });\n                console.log(seriesArr);\n                const topSeriesList = document.querySelector('#top-series-list');\n                if (topSeriesList) {\n                    const top10 = seriesArr.slice(0, 10);\n                    top10.forEach((series, i) => {\n                        let html = `\n                    <li>\n                        <a href=\"#series-${i}\" class=\"usa-link series-name\" data-series-index=\"${i}\">${series.CodeName} Series</a>\n                    </li>\n                    `;\n                        topSeriesList.innerHTML += html;\n                    });\n                    topSeriesList.addEventListener('click', function (event) {\n                        const targetElement = event.target;\n                        if (targetElement && targetElement.classList.contains('series-name')) {\n                            event.preventDefault();\n                            const seriesIndex = targetElement.getAttribute('data-series-index');\n                            const scrollTargetElement = document.getElementById(`series-${seriesIndex}`);\n                            if (scrollTargetElement) {\n                                scrollTargetElement.scrollIntoView({ behavior: 'smooth' });\n                            }\n                        }\n                    });\n                }\n                const seriesContainer = document.querySelector('#data');\n                if (seriesContainer) {\n                    let currentIndex = 0;\n                    const displaySeries = () => {\n                        for (let i = currentIndex; i < currentIndex + 10 && i < seriesArr.length; i++) {\n                            const series = seriesArr[i];\n                            // Get the match number for the series\n                            let match = series.Match;\n                            // Find the color range that match falls into\n                            let matchRange = matchRanges.find(range => match >= range.min && match <= range.max);\n                            // Get the color class from the color range, or a default class if no range is found\n                            let matchColor = matchRange ? matchRange.color : \"\";\n                            let matchCopy = matchRange ? matchRange.copy : \"\";\n                            let html = `\n                        <div class=\"grid-row grid-gap result\" id=\"series-${i}\">\n                            <div class=\"tablet:grid-col-3 match bg-blue text-align-right\">\n                                <!--<h2 class=\"match-number match-color-${matchColor}\">${series.Match}% Match</h2>-->\n                                <p class=\"usa-prose\">Based on your answers, your interests are a <strong class=\"match-color-${matchColor}\">${matchCopy} match</strong> with this job series.</p>\n                            </div>\n                            <div class=\"tablet:grid-col series\">\n                                <div class=\"series-detail\">\n                                    <h2><span class=\"series-name\">${series.CodeName} Series</span></h2>\n                                    <p class=\"usa-prose\">${series.Description}</p>\n                                    <div class=\"job-titles\">\n                                        <h3>Most applied to job titles within this series</h3>\n                                        <!--<p class=\"usa-prose\">Here's a list of the <em>most applied to</em> job titles in the <span class=\"series-name\">${series.Name}</span>:</p>-->\n                                        <ul class=\"usa-list\">\n                                        ${series.JobTitles.map((job, i) => `\n                                        <li>${job}</li>\n                                        `).join('')}\n                                        </ul>\n                                    </div>\n                                </div>\n                                <div class=\"series-actions\">\n                                    <div class=\"usa-button-group\">\n                                        <!--<a href=\"#\" class=\"usa-button usa-button--outline\">Explore related series</a>-->\n                                        <a href=\"https://www.usajobs.gov/Search/Results?j=${series.Code}\" class=\"usa-button find\"><svg class=\"usa-icon\" aria-hidden=\"true\" focusable=\"false\" role=\"img\">\n                                        <use xlink:href=\"assets/uswds/img/sprite.svg#search\"></use>\n                                      </svg> Find jobs in this series</a>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        `;\n                            seriesContainer.innerHTML += html;\n                        }\n                        ;\n                        currentIndex += 10;\n                    };\n                    displaySeries();\n                    const loadMoreButton = document.querySelector('#load-more');\n                    if (loadMoreButton) {\n                        loadMoreButton.addEventListener('click', () => {\n                            //console.log(currentIndex);\n                            displaySeries();\n                            if (currentIndex >= seriesArr.length) {\n                                loadMoreButton.remove();\n                            }\n                        });\n                    }\n                }\n                // Function to find the index of the element in the viewport\n                function findCurrentIndex(results) {\n                    let minDistance = Number.MAX_SAFE_INTEGER;\n                    let closestIndex = 0;\n                    results.forEach((result, index) => {\n                        let distance = Math.abs(result.getBoundingClientRect().top);\n                        if (distance < minDistance) {\n                            closestIndex = index;\n                            minDistance = distance;\n                        }\n                    });\n                    return closestIndex;\n                }\n                const prevButton = document.querySelector('#prev');\n                if (prevButton) {\n                    prevButton.addEventListener('click', function () {\n                        let results = document.querySelectorAll('.result');\n                        let currentIndex = findCurrentIndex(results);\n                        // Only decrement the index if it's not already at 0\n                        if (currentIndex > 0) {\n                            currentIndex--;\n                            // Scroll to the new current element\n                            results[currentIndex].scrollIntoView({ behavior: \"smooth\" });\n                        }\n                    });\n                }\n                const nextButton = document.querySelector('#next');\n                if (nextButton) {\n                    nextButton.addEventListener('click', function () {\n                        let results = document.querySelectorAll('.result');\n                        let currentIndex = findCurrentIndex(results);\n                        // Only increment the index if it's not already at the last element\n                        if (currentIndex < results.length - 1) {\n                            currentIndex++;\n                            // Scroll to the new current element\n                            results[currentIndex].scrollIntoView({ behavior: \"smooth\" });\n                        }\n                    });\n                }\n            }\n            catch (error) {\n                console.error('Error:', error);\n            }\n        });\n    }\n}\nif (fileName === 'quiz.html') {\n    const staticQuestionsData = './data/questions.json';\n    fetchQuestions(staticQuestionsData);\n    function fetchQuestions(staticQuestionsData) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                const res = yield fetch(staticQuestionsData);\n                const data = yield res.json();\n                const questionsArr = data['questions'];\n                console.log(questionsArr);\n                const addRadioButtons = (n, fieldsetId) => {\n                    const labels = ['Not Interested', 'Slightly Interested', 'Moderately Interested', 'Very Interested', 'Extremely Interested'];\n                    const fieldset = document.querySelector('#' + fieldsetId);\n                    for (let i = 1; i <= n; i++) {\n                        let radioId = `${fieldsetId}-r${i}`; // Generate a unique id for each radio button\n                        let radioName = `${fieldsetId}-rating`; // Generate a unique name for each group of radio buttons\n                        let html = `\n                    <div class=\"usa-radio\">\n                        <input class=\"usa-radio__input\" id=\"${radioId}\" type=\"radio\" name=\"${radioName}\" value=\"${i}\" />\n                        <label class=\"usa-radio__label\" for=\"${radioId}\">${labels[i - 1]}</label>  <!-- Use the unique id -->\n                    </div>\n                    `;\n                        if (fieldset) {\n                            fieldset.innerHTML += html;\n                        }\n                    }\n                };\n                const questionsContainer = document.querySelector('.questions');\n                if (questionsContainer) {\n                    questionsArr.forEach((question, i) => {\n                        let fieldsetId = `rating${i}`;\n                        let html = `\n                    <div class=\"question\">\n                        <div>\n                            <h2>Question #${i + 1}</h2>\n                            <p class=\"usa-prose\"><strong>How interested are you in doing these activities at work?</strong></p>\n                            <p class=\"usa-prose\">${question.question}</p>\n                        </div>\n                        <fieldset class=\"usa-fieldset\">\n                            <legend class=\"usa-legend\">Select one rating</legend>\n                            <div class=\"radio-group\" id=\"${fieldsetId}\"></div>\n                        </fieldset>\n                    </div>\n                    `;\n                        questionsContainer.innerHTML += html;\n                        addRadioButtons(5, fieldsetId);\n                    });\n                }\n                let currentQuestionIndex = 0; //Outer scope this to imitate state\n                const questions = document.querySelectorAll('.question');\n                const navigateToQuestion = (index) => {\n                    if (index >= 0 && index < questions.length) {\n                        questions[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });\n                        currentQuestionIndex = index;\n                        //Check if the question has been answered\n                        if (isQuestionAnswered(questions[currentQuestionIndex])) {\n                            nextButton.style.visibility = 'visible';\n                        }\n                        else {\n                            nextButton.style.visibility = 'hidden';\n                        }\n                    }\n                    updateNextButtonState();\n                };\n                const prevButton = document.querySelector('#prev');\n                if (prevButton) {\n                    prevButton.addEventListener('click', () => {\n                        navigateToQuestion(currentQuestionIndex - 1);\n                        updatePrevButtonVisibility();\n                        updateNextButtonState();\n                    });\n                }\n                const nextButton = document.querySelector('#next');\n                if (nextButton) {\n                    nextButton.addEventListener('click', () => {\n                        navigateToQuestion(currentQuestionIndex + 1);\n                        updatePrevButtonVisibility();\n                        updateNextButtonState();\n                    });\n                }\n                const isQuestionAnswered = (question) => {\n                    const radios = question.querySelectorAll('input[type=\"radio\"]');\n                    for (let i = 0; i < radios.length; i++) {\n                        if (radios[i].checked) {\n                            return true;\n                        }\n                    }\n                    return false;\n                };\n                function updatePrevButtonVisibility() {\n                    if (prevButton) {\n                        if (currentQuestionIndex === 0) {\n                            prevButton.style.visibility = 'hidden';\n                        }\n                        else {\n                            prevButton.style.visibility = 'visible';\n                        }\n                    }\n                }\n                updatePrevButtonVisibility();\n                function updateNextButtonState() {\n                    if (nextButton) {\n                        // Hide the button when on the last question\n                        if (currentQuestionIndex === 24) {\n                            nextButton.style.visibility = 'hidden';\n                            return; // Exit the function early\n                        }\n                        // Get the current question based on index\n                        const currentQuestion = questions[currentQuestionIndex];\n                        // If the current question has been answered, show the button\n                        if (isQuestionAnswered(currentQuestion)) {\n                            nextButton.style.visibility = 'visible';\n                        }\n                        else {\n                            nextButton.style.visibility = 'hidden';\n                        }\n                    }\n                }\n                updateNextButtonState();\n                const radioButtons = document.querySelectorAll('.usa-radio__input');\n                radioButtons.forEach((radioButton) => {\n                    radioButton.addEventListener('change', (e) => {\n                        const currentRadioButton = e.target;\n                        const parentQuestion = currentRadioButton.closest('.question');\n                        const questionIndex = Array.from(questions).indexOf(parentQuestion);\n                        // // Only navigate if the question hasn't been answered yet\n                        // if (!answeredQuestions.has(questionIndex)) {\n                        //     navigateToQuestion(currentQuestionIndex + 1);\n                        //     answeredQuestions.add(questionIndex);  // Mark the question as answered\n                        // }\n                        updatePrevButtonVisibility();\n                        updateNextButtonState();\n                        updateSubmitButtonState();\n                    });\n                });\n                const qFirst = document.querySelector('#qFirst');\n                if (qFirst) {\n                    qFirst.addEventListener('click', () => {\n                        navigateToQuestion(0);\n                        updatePrevButtonVisibility();\n                        updateNextButtonState();\n                    });\n                }\n                const qLast = document.querySelector('#qLast');\n                if (qLast) {\n                    qLast.addEventListener('click', () => {\n                        const lastSlideIndex = questions.length - 1;\n                        navigateToQuestion(lastSlideIndex);\n                        updatePrevButtonVisibility();\n                        updateNextButtonState();\n                    });\n                }\n                const complete = document.querySelector('#complete');\n                complete.addEventListener('click', () => {\n                    questions.forEach((question, index) => {\n                        const radioButtons = question.querySelectorAll('input[type=\"radio\"]');\n                        const randomIndex = Math.floor(Math.random() * radioButtons.length); // Choose a random radio button to select\n                        const radioButton = radioButtons[randomIndex];\n                        radioButton.checked = true;\n                        answeredQuestions.add(index);\n                    });\n                    // After automatically answering, update the visibility of the Next and Submit buttons.\n                    updateNextButtonState();\n                    updateSubmitButtonState();\n                    updateProgressBar();\n                });\n                const radioButtonsArr = document.querySelectorAll('.usa-radio__input');\n                radioButtonsArr.forEach((radio) => {\n                    radio.addEventListener('change', updateProgress);\n                });\n                let answeredQuestions = new Set(); // To store the indices of answered questions\n                function updateProgress(event) {\n                    const parentQuestion = event.target.closest('.question');\n                    const questionIndex = Array.from(questions).indexOf(parentQuestion);\n                    answeredQuestions.add(questionIndex);\n                    updateProgressBar();\n                }\n                function updateProgressBar() {\n                    const totalQuestions = questions.length;\n                    const answeredCount = answeredQuestions.size;\n                    const progressPercentage = (answeredCount / totalQuestions) * 100;\n                    const progressBar = document.querySelector('#progressBar');\n                    if (progressBar) {\n                        progressBar.style.width = `${progressPercentage}%`;\n                    }\n                    const progressText = document.querySelector('#progressText');\n                    if (progressText) {\n                        //progressText.textContent = `Progress: ${Math.round(progressPercentage)}% Complete`;\n                        progressText.textContent = `Progress: ${Math.round(progressPercentage)}% Complete (${answeredCount}/${totalQuestions})`;\n                    }\n                }\n                function areAllQuestionsAnswered() {\n                    return Array.from(questions).every(questionElement => isQuestionAnswered(questionElement));\n                }\n                const submitButton = document.querySelector('#submit-button');\n                console.log(submitButton);\n                function updateSubmitButtonState() {\n                    if (areAllQuestionsAnswered()) {\n                        submitButton.style.visibility = 'visible';\n                    }\n                    else {\n                        submitButton.style.visibility = 'hidden';\n                    }\n                }\n                updateSubmitButtonState();\n            }\n            catch (error) {\n                console.error('Error:', error);\n            }\n        });\n    }\n}\nif (fileName === 'index.html') {\n    const div1 = document.getElementById(\"div1\");\n    const div2 = document.getElementById(\"div2\");\n    const div3 = document.getElementById(\"div3\");\n    document.getElementById(\"showDiv1\").addEventListener(\"click\", function () {\n        hideAllDivs();\n        div1.style.display = \"block\";\n    });\n    document.getElementById(\"showDiv2\").addEventListener(\"click\", function () {\n        hideAllDivs();\n        div2.style.display = \"block\";\n    });\n    document.getElementById(\"showDiv3\").addEventListener(\"click\", function () {\n        hideAllDivs();\n        div3.style.display = \"block\";\n    });\n    function hideAllDivs() {\n        div1.style.display = \"none\";\n        div2.style.display = \"none\";\n        div3.style.display = \"none\";\n    }\n}\n\n\n//# sourceURL=webpack://jet-prototype-v2/./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.ts"]();
/******/ 	
/******/ })()
;