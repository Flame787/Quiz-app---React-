import { useState } from "react";

import QUESTIONS from "../questions.js";

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

  function handleSelectAnswer(selectedAnswer) {
    setUserAnswers((prevUserAnswers) => {
      return [...prevUserAnswers, selectedAnswer];
    });
    // function is taking the selected answer as a parameter/value, and then is updating the state
    // updating state: copiyng all previous state + adding newly selected answer
  }

  // return <p>Currently active question</p>
  return (
    <div id="quiz">
    <div id="question">
      <h2>{QUESTIONS[activeQuestionIndex].text}</h2>
      <ul id="answers">
        {QUESTIONS[activeQuestionIndex].answers.map((answer) => (
          <li key={answer} className="answer">
            <button onClick={() => handleSelectAnswer(answer)}>{answer}</button>
            {/* function is not just passed, but is included inside of an anonymous function, so tha
            we can have more control. It will not be called immidietly, but only when the button is clicked. */}
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}
