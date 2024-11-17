document.addEventListener("DOMContentLoaded", () => {
    const questionContainer = document.getElementById("question");
    const optionsContainer = document.getElementById("options");
    const nextButton = document.getElementById("next-btn");
    const feedback = document.getElementById("feedback");
    let currentQuestionIndex = 0;
    let questions = [];
  
    // Fetch questions from the API
    async function fetchQuestions() {
      const url = "https://opentdb.com/api.php?amount=15&type=multiple";
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          questions = data.results;
          displayQuestion();
        } else {
          console.error("Failed to fetch questions");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
  
    //Progress Bar
    function initializeProgressBar() {
      document.getElementById("progress-bar").style.width = "0%";
    }
  
    function updateProgressBar() {
      const progressPercentage =
        ((currentQuestionIndex + 1) / questions.length) * 100;
      document.getElementById(
        "progress-bar"
      ).style.width = `${progressPercentage}%`;
    }
  
    // Display current question and options
    function displayQuestion() {
      // Reset lifeline clickability
      document.querySelectorAll(".lifeline").forEach((lifeline) => {
        lifeline.style.pointerEvents = "";
      });
      const currentQuestion = questions[currentQuestionIndex];
      questionContainer.innerHTML = decodeHtml(
        currentQuestionIndex + 1 + ". " + currentQuestion.question
      );
      optionsContainer.innerHTML = "";
  
      const options = [
        ...currentQuestion.incorrect_answers,
        currentQuestion.correct_answer,
      ];
      shuffleArray(options);
      //console.log(options);
      //console.log("Correct answer:", decodeHtml(currentQuestion.correct_answer));
  
      options.forEach((option) => {
        const optionElement = document.createElement("div");
        optionElement.classList.add("option");
        optionElement.textContent = decodeHtml(option);
        optionElement.addEventListener("click", () => {
          const correct = option === currentQuestion.correct_answer;
          checkAnswer(correct);
          if (correct) {
            optionElement.classList.add("highlighted");
          }
        });
        optionsContainer.appendChild(optionElement);
      });
    }
    async function restartGame() {
      currentQuestionIndex = 0;
      questions = [];
      await fetchQuestions(); // Ensure this function resets and fetches new questions
  
      // Reset UI elements
      questionContainer.innerHTML = "";
      optionsContainer.innerHTML = "";
      feedback.textContent = "";
      feedback.style.color = "initial"; // Or whatever your default text color is
  
      // Reset and enable all lifelines
      document.querySelectorAll(".lifeline").forEach((button) => {
        button.disabled = false;
        button.classList.remove("disabled");
      });
  
      // Clear highlighting from the dashboard
      document.querySelectorAll(".money-amount").forEach((amount) => {
        amount.classList.remove("highlighted");
      });
  
      // Hide the game-over modal if not already hidden
      document.getElementById("game-over-modal").style.display = "none";
      document.getElementById("winner-modal").style.display = "none";
  
      // Display the first question of the new game session
      displayQuestion(); // Ensure this is called after the new questions are loaded
      initializeProgressBar();
    }
  
    // Initialize the dashboard with money amounts
    function initializeDashboard() {
      const dashboard = document.getElementById("dashboard");
      const amounts = [
        1000000, 500000, 250000, 125000, 64000, 32000, 16000, 8000, 4000, 2000,
        1000, 500, 300, 200, 100,
      ];
  
      amounts.forEach((amount) => {
        const moneyAmount = document.createElement("div");
        moneyAmount.classList.add("money-amount");
        moneyAmount.textContent = `$${amount.toLocaleString()}`;
        dashboard.appendChild(moneyAmount);
      });
    }
  
    // Decode HTML entities
    function decodeHtml(html) {
      const txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    }
  
    // Utility function to shuffle an array (Fisher-Yates shuffle algorithm)
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  
    // Event listener for closing the game over modal
    document
      .querySelector("#game-over-modal #restart-game")
      .addEventListener("click", async function () {
        await restartGame();
      });
  
    // Event listener for closing the winner modal
    document
      .querySelector("#winner-modal #restart-game")
      .addEventListener("click", async function () {
        await restartGame();
      });
  
    //Event listeners for lifelines
    document
      .getElementById("lifeline-5050")
      .addEventListener("click", function () {
        let incorrectOptions = [];
        optionsContainer.childNodes.forEach((option) => {
          if (
            !option.textContent.includes(
              decodeHtml(questions[currentQuestionIndex].correct_answer)
            ) &&
            incorrectOptions.length < 2
          ) {
            incorrectOptions.push(option);
          }
        });
  
        incorrectOptions.forEach((option) => {
          option.style.display = "none"; // Hide two incorrect answers
        });
  
        this.disabled = true;
        this.classList.add("disabled");
      });
  
    document
      .getElementById("lifeline-audience")
      .addEventListener("click", function () {
        const optionsContainer = document.getElementById("options");
        const options = optionsContainer.querySelectorAll(".option");
  
        // Calculate total votes to distribute among options
        let totalVotes = 100;
        let votes = [];
  
        // Randomly generate vote percentages for each option except the last one
        for (let i = 0; i < options.length - 1; i++) {
          let vote = Math.floor(
            Math.random() * (totalVotes / (options.length - i))
          );
          totalVotes -= vote;
          votes.push(vote);
        }
        // Assign remaining votes to the last option
        votes.push(totalVotes);
  
        // Shuffle the votes array to randomize distribution among options
        shuffleArray(votes);
  
        // Append vote percentages to each option
        options.forEach((option, index) => {
          // Prevent appending multiple times if the button is somehow activated again
          if (!option.textContent.includes("%")) {
            option.textContent += ` - ${votes[index]}%`;
          }
        });
        this.disabled = true;
        this.classList.add("disabled");
      });
  
    document
      .getElementById("lifeline-phone")
      .addEventListener("click", function () {
        // Randomly select any option as the suggestion
        const options = document.querySelectorAll(".option");
        const suggestionIndex = Math.floor(Math.random() * options.length);
        document.getElementById("friend-suggestion").textContent =
          "Your friend thinks the answer might be: " +
          options[suggestionIndex].textContent;
  
        // Display the dialog
        document.getElementById("friend-dialog").style.display = "block";
  
        // Optionally disable the button after use
        this.disabled = true;
  
        this.classList.add("disabled");
      });
  
     
  
    // Close the dialog
    document
      .querySelector(".close-friend")
      .addEventListener("click", function () {
        document.getElementById("friend-dialog").style.display = "none";
      });
  
    // Event listener for next button
    nextButton.addEventListener("click", () => {
      // Increment the question index here if not done on correct answer
  
      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(); // Show the next question
        //enableLifelines()
  
        feedback.textContent = ""; // Reset feedback text
        nextButton.disabled = true; // Disable the button until the next answer is selected
  
        // Re-enable option selection for the new question
        document.querySelectorAll(".option").forEach((option) => {
          option.style.pointerEvents = "";
        });
  
        // Re-enable or adjust lifelines based on your game rules
      } else {
        // End of game logic if needed
        feedback.textContent = "End of questions!";
        nextButton.disabled = true;
      }
    });
  
    function updateDashboard() {
      // Highlight the current amount based on the question index
      // Assuming the last amount corresponds to the first question and so on
      const moneyAmounts = document.querySelectorAll(".money-amount");
      if (moneyAmounts.length > currentQuestionIndex) {
        moneyAmounts[
          moneyAmounts.length - currentQuestionIndex - 1
        ].classList.add("highlighted");
      }
    }
  
    function checkAnswer(correct) {
      if (correct) {
        feedback.textContent = "Correct!";
        feedback.style.color = "green";
        nextButton.disabled = false;
        updateProgressBar();
        updateDashboard();
        //disableLifelines();
        document.querySelectorAll(".option").forEach((option) => {
          option.style.pointerEvents = "none";
        });
        document.querySelectorAll(".lifeline").forEach((lifeline) => {
          lifeline.style.pointerEvents = "none";
        });
        //currentQuestionIndex++;
        console.log(currentQuestionIndex);
        if (currentQuestionIndex + 1 == questions.length) {
          document.getElementById("winner-modal").style.display = "block";
        }
      } else {
        //nextButton.disabled = true;
        const correctAnswer = decodeHtml(
          questions[currentQuestionIndex].correct_answer
        );
        // Calculate the amount won
        let amountWon = "0";
        if (currentQuestionIndex > 0) {
          const moneyAmounts = document.querySelectorAll(".money-amount");
          amountWon =
            moneyAmounts[moneyAmounts.length - currentQuestionIndex].textContent;
        }
  
        // Display game over message
        document.getElementById(
          "game-over-message"
        ).innerHTML = `Game Over!<br>You're going home with ${amountWon}.<br>The correct answer was ${correctAnswer}.`;
        document.getElementById("game-over-modal").style.display = "block";
      }
    }
    //Testing the winner modal
    /* document.getElementById('test-modal-btn').addEventListener('click', function() {
      document.getElementById('winner-modal').style.display = 'block';
  });*/
  
    // Initialization
    fetchQuestions();
    initializeDashboard();
    initializeProgressBar();
  });
  