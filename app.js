const apiUrl =
  "https://opentdb.com/api.php?amount=4&difficulty=medium&type=multiple";
const question = document.getElementById("question");
const options = document.querySelectorAll(".btn");
const nextBtn = document.getElementById("next-btn");
const playAgain = document.getElementById("play-again");
const loader = document.getElementById("loader");
const card = document.getElementById("card");
const answerButtons = document.getElementById("answer-buttons");
const errorMessage = document.getElementById("error-message")
let resultIndex = 0;
let score = 0;
let data;

const fetchData = () =>
  fetch(apiUrl)
    .then((response) => response.json())
    .then((fetchedData) => {
      console.log("got data");
      data = fetchedData;
      fetchQuestions(data);
      loader.classList.add("hidden");
      card.classList.remove("hidden");
    })
    .catch((error) => {
      errorMessage.classList.toggle('hidden')
      loader.classList.add("hidden")
      console.log(error);
    });
fetchData();

function fetchQuestions(data) {
  answerButtons.style.display = "block";
  nextBtn.innerHTML = "Next";
  // Reset the styles on options
  options.forEach((option) => {
    option.classList.remove("bg-green-400");
    option.disabled = false;
    option.classList.add("hover:bg-black");
    option.classList.add("hover:text-white");
    option.classList.remove("bg-red-400");
  });

  // Load new question
  question.innerHTML = data.results[resultIndex].question;
  const incorrectAnswers = data.results[resultIndex].incorrect_answers;
  const correctAnswer = data.results[resultIndex].correct_answer;
  console.log(correctAnswer);
  incorrectAnswers.push(correctAnswer);
  const randomAnswers = [];

  // Randomize answers

  for (let i = 0; i < incorrectAnswers.length; ) {
    let randomIndex = Math.floor(Math.random() * incorrectAnswers.length);
    randomAnswers.push(incorrectAnswers[randomIndex]);
    incorrectAnswers.splice(randomIndex, 1);
  }
  // Update the button text with new answers
  options.forEach((option) => option.removeEventListener("click", addEvent));

  for (let i = 0; i < options.length; i++) {
    options[i].innerHTML = randomAnswers[i];
    options[i].addEventListener("click", addEvent);
  }
}

nextBtn.addEventListener("click", () => {
  resultIndex++;
  if (resultIndex < data.results.length) {
    fetchQuestions(data);
  } else {
    answerButtons.style.display = "none";
    question.innerText = `Lere Lund ke ${score} gand me daal de ${data.results.length}`;
    playAgain.classList.remove("hidden");
  }
  nextBtn.style.display = "none";
});

playAgain.addEventListener("click", () => {
  loader.classList.remove("hidden");
  card.classList.add("hidden");
  resultIndex = 0;
  fetchData();
  score = 0;
  nextBtn.style.display = "block";
  playAgain.classList.add("hidden");
});

function addEvent(event) {
  {
    if (event.target.innerHTML == data.results[resultIndex].correct_answer) {
      event.target.classList.add("bg-green-400");
      console.log(score);
      score++;
    } else {
      event.target.classList.add("bg-red-400");
    }
    nextBtn.style.display = "block";
    disableBtn();
  }
}

function disableBtn() {
  options.forEach((option) => {
    if (option.innerHTML == data.results[resultIndex].correct_answer) {
      option.classList.add("bg-green-400");
    }
    option.disabled = true;
    option.classList.remove("hover:bg-black");
    option.classList.remove("hover:text-white");
  });
}
