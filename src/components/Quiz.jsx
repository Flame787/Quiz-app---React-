import { useState, useCallback } from "react";
// useCallback-hook ensures that the functions are NOT re-created unless their own dependencies changed
// but these functions won't be triggered if just the surrounding componend was re-rendered - we prevent that!

import QUESTIONS from "../questions.js";
import QuestionTimer from "./QuestionTimer.jsx"; // importing a child component
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

  // function handleSelectAnswer(selectedAnswer) - before, but now we have to wrap it with useCallback
  const handleSelectAnswer = useCallback(function handleSelectAnswer(
    selectedAnswer
  ) {
    setUserAnswers((prevUserAnswers) => {
      return [...prevUserAnswers, selectedAnswer];
    });
    // function is taking the selected answer as a parameter/value, and then is updating the state 'userAnswers'.
    // updating state: copying all previous states (useAnswers) + adding newly selected answer to the list
  },
  []);
  // Dependency list is empty, because in handleSelectAnswer we are not using any state or props, or any other
  // values that depend on state or props.
  // State-updating functions don't have to be added here, beacuse React will guarantee that they never change.
  // This way (with useCallback), we ensure that the functions are not recreated, just because the surrounding
  // function was re-rendered.

  const handleSkipAnswer = useCallback(
    () => handleSelectAnswer(null),
    [handleSelectAnswer]
  );
  // skip answer - is the situation when tiemr has expired before user has chosen any answer.
  // wrapping the function handleSelectAnswer(null) with a useCallback-hook
  // 'handleSelectAnswer' is dependency because it's value is depending on props and state

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
          key={activeQuestionIndex}
          // adding key: whenever the key changes, React will destroy the old component and create a new one
          // so React will unmount the component from DOM, and remount the component back into DOM.
          // we can use 'key' when we want to recreate/restart the 'timer'-component (<progress> above each question)
          timeout={10000} // setting timer to max. value of 10 sec
          // onTimeout={() => handleSelectAnswer(null)}
          // null = placeholder, if no answer was chosen for this question, and the time runs out
          // onTimeout={() => handleSelectAnswer(handleSkipAnswer)} -> moved that function up into useCallback
          // each time a new <QuestionTimer> starts, newer TIMER and INTERVAL are started
          onTimeout={handleSkipAnswer}
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
