const apiUrl =
  "https://opentdb.com/api.php?amount=4&difficulty=medium&type=multiple";
const question = document.getElementById("question");
const options = document.querySelectorAll(".btn");
const nextBtn = document.getElementById("next-btn");
let resultIndex = 0;
let data;
fetch(apiUrl)
  .then((response) => response.json())
  .then((fetchedData) => {
    data = fetchedData;
    fetchQuestions(data);
  })
  .catch((error) => console.log(error));

function fetchQuestions(data) {
  disableBtn(false);
  removeBtnColor();
  question.innerHTML = data.results[resultIndex].question;
  const incorrectAnswers = data.results[resultIndex].incorrect_answers;
  const correctAnswer = data.results[resultIndex].correct_answer;
  incorrectAnswers.push(correctAnswer);
  const randomAnswers = [];

  for (let i = 0; i < incorrectAnswers.length; ) {
    let randomIndex = Math.floor(Math.random() * incorrectAnswers.length);
    randomAnswers.push(incorrectAnswers[randomIndex]);
    incorrectAnswers.splice(randomIndex, 1);
  }

  for (let i = 0; i < options.length; i++) {
    options[i].innerHTML = randomAnswers[i];

    options[i].addEventListener("click", (event) => {
      if (event.target.innerHTML == data.results[resultIndex].correct_answer) {
        event.target.classList.add("bg-green-400");
        nextBtn.style.display = "block";
      } else {
        event.target.classList.add("bg-red-400");
        nextBtn.style.display = "block";
      }
      disableBtn(true);
    });
  }
}

function disableBtn(resonse) {
  for (let i = 0; i < options.length; i++) {
    if (resonse == true) {
      options[i].disabled = true;
      options[i].classList.add("hover:bg-black");
      options[i].classList.add("hover:text-white");
      options[i].classList.add("cursor-no-drop");
    } else {
      options[i].disabled = false;
      options[i].classList.remove("hover:bg-black");
      options[i].classList.remove("hover:text-white");
      options[i].classList.remove("cursor-no-drop");
    }
  }
}

function removeBtnColor() {
  for (let i = 0; i < options.length; i++) {
    options[i].classList.remove("bg-green-400");
    options[i].classList.remove("bg-red-400");
  }
}

nextBtn.addEventListener("click", () => {
  resultIndex++;
  fetchQuestions(data);
});
