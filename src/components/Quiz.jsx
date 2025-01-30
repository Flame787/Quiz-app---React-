import { useState } from "react";

import QUESTIONS from "../questions.js";
import QuestionTimer from "./QuestionTimer.jsx";
import quizCompletedImg from "../assets/quiz-complete.png";

export default function Quiz() {
  // state-logic to manage currently active question, change to different question, store the answers

  // const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  // -> this state could be derrived from the answers-state,
  // because all answers are connected to the questions in the questions.js file

  const [userAnswers, setUserAnswers] = useState([]);

  // derrived state, a computed value to this component, it refers on the index/count of the answers:
  // if activeQuestionIndex is 0, then we are showing the 1st question to the user,
  // next index = 1 ==> this means 2nd question etc.
  // We want to manage as little state as possible, and DERRIVE as much state as possible.
  const activeQuestionIndex = userAnswers.length;

  const quizIsComplete = activeQuestionIndex === QUESTIONS.length;
  // with this check, we make sure that we can't exceed the number of questions we have.

  function handleSelectAnswer(selectedAnswer) {
    setUserAnswers((prevUserAnswers) => {
      return [...prevUserAnswers, selectedAnswer];
    });
    // function is taking the selected answer as a parameter/value, and then is updating the state
    // updating state: copiyng all previous state + adding newly selected answer
  }

  // if we went through all questions, we should display something else (and not questions anymore):
  if (quizIsComplete) {
    return (
      <div id="summary">
        <img src={quizCompletedImg} alt="Trophy icon" />
        <h2>Quiz completed!</h2>
      </div>
    );
  }

  // This logic executes only if we still have some questions to display (not before, it would break the code):

  const shuffledAnswers = [...QUESTIONS[activeQuestionIndex].answers];
  // we will sort new array and not original saved array 'questions' (it must always stay in initial order)
  shuffledAnswers.sort(() => Math.random() - 0.5);
  // sort() has as function as argument, which always receives 2 elements from array.
  // shuffledAnswers.sort((a, b) => -1);
  // If they are returning a negative number (-1), the elements will be swapped.
  // If they are returning a positive number (1), they will not switch their order.
  // Function sort() will just go through all elements of the array and derrive a new order.
  // Math.random() will giv us a value between 0 and 1 (1 excluded).
  // If we deduct 1 from them, we get a negative value.
  // If we deduct 0.5 from them, we will sometimes get positive, and sometimes negative number
  // -> shuffling the answers.

  // return <p>Currently active question</p>
  return (
    <div id="quiz">
      <div id="question">
        <QuestionTimer
          timeout={10000}
          onTimeout={() => handleSelectAnswer(null)}
        />

        <h2>{QUESTIONS[activeQuestionIndex].text}</h2>
        <ul id="answers">
          {shuffledAnswers.map((answer) => (
            // {QUESTIONS[activeQuestionIndex].answers.map((answer) => (
            <li key={answer} className="answer">
              <button onClick={() => handleSelectAnswer(answer)}>
                {answer}
              </button>
              {/* function is not just passed, but is included inside of an anonymous function, so tha
            we can have more control. It will not be called immidietly, but only when the button is clicked. */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
