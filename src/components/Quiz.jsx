import { useState, useCallback, useRef } from "react";
// useCallback-hook ensures that the functions are NOT re-created unless their own dependencies changed
// but these functions won't be triggered if just the surrounding componend was re-rendered - we prevent that!

import QUESTIONS from "../questions.js";
// import QuestionTimer from "./QuestionTimer.jsx"; // importing a child component
// import Answers from "./Answers.jsx";
import Question from "./Question.jsx";

import quizCompletedImg from "../assets/quiz-complete.png";

export default function Quiz() {
  // state-logic to manage currently active question, change to different question, store the answers

  // new - useRef to manage shuffling the answers (better than to add another useEffect - too much not good)
  // useRef: used here not to connect some html-element, but to manage some value which will not change
  // if the component function is executed again -> value will be stored independently from component-cycle.
  // const shuffledAnswers = useRef();   -> later moved to Answers.jsx-component

  // const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  // -> but not needed, because this state could be derrived from the answers-state,
  // because all answers are connected to the questions in the questions.js file

  // new state, that's controlling the current answer's state (is it answered, or not):
  // const [answerState, setAnswerState] = useState(""); // initially we can have an empty string (not answered)
  // -> state not needed anymore, logic is moved into better suited Question-component, where it's more needed

  const [userAnswers, setUserAnswers] = useState([]);

  // derrived state, a computed value to this component, it refers on the index/count of the answers:
  // if activeQuestionIndex is 0, then we are showing the 1st question to the user,
  // next index = 1 ==> this means 2nd question etc.
  // We want to manage as little state as possible, and DERRIVE as much state as possible.
  // const activeQuestionIndex = answerState === "" ? userAnswers.length : userAnswers.length - 1;
    const activeQuestionIndex = userAnswers.length;
  // activeQuestionIndex is equal to userAnswers.length, if the current answerState is an empty string (if
  // the question was not answered yet), otherwise (:) it should be equal to userAnswers.length - 1

  const quizIsComplete = activeQuestionIndex === QUESTIONS.length;
  // with this check, we make sure that we can't exceed the number of questions we have.

  // function handleSelectAnswer(selectedAnswer) - before, but now we have to wrap it with useCallback
  const handleSelectAnswer = useCallback(
    function handleSelectAnswer(selectedAnswer) {
      // adding new state:
      // setAnswerState("answered"); - not needed here

      setUserAnswers((prevUserAnswers) => {
        return [...prevUserAnswers, selectedAnswer];
      });
      // function is taking the selected answer as a parameter/value, and then is updating the state 'userAnswers'.
      // updating state: copying all previous states (useAnswers) + adding newly selected answer to the list

      // adding new timeout (nested) - after 1 sec we change the state of selected answer to correct or wrong:
      // setTimeout(() => {
      //   if (selectedAnswer === QUESTIONS[activeQuestionIndex].answers[0]) {
      //     // if user selected answer which is also the 1st answer in our Questions-file under this question[index]:
      //     setAnswerState("correct");
      //   } else {
      //     setAnswerState("wrong");
      //   }

        // reseting to the empty string - via this new timer, which is nested into a bigger timer:
      //   setTimeout(() => {
      //     setAnswerState("");
      //   }, 2000);
      //   // here ends new nested timer. It lasts for 2 extra sec, when we highlight the selected answer.
      //   // (short period after user answered the question), but before it was switched to next question.
      //   // -> during those 2 sec, the selected answer will be marked green if correct, or red if incorrect.
      // }, 1000);
    }, []
    // [activeQuestionIndex] - no longer needed as dependancy, it was needed for timers, which we moved away.
  );
  // Dependency list was initially empty, because in handleSelectAnswer we are not using any state or props,
  // or any other values that depend on state or props.
  // State-updating functions don't have to be added here, beacuse React will guarantee that they never change.
  // This way (with useCallback), we ensure that the functions are not recreated, just because the surrounding
  // function was re-rendered.
  // Later, we add activeQuestionIndex as dependency, because it impacts the selectedAnswer-state.

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

  // // wrapping the shuffledAnswers.current with this logic:  -> later moved to Answers.jsx-component
  // // if shuffledAnswers.current is undefined/not truethy, then there are no shuffeled answers (initial state):
  // // only then will the answers be shuffled - once,
  // // but if they were already shuffled (if condition is truethy), then the following code will not be executed:
  // if (!shuffledAnswers.current) {
  //   // const shuffledAnswers = [...QUESTIONS[activeQuestionIndex].answers];
  //   shuffledAnswers.current = [...QUESTIONS[activeQuestionIndex].answers];
  //   // we will sort new array and not original saved array 'questions' (it must always stay in initial order)
  //   shuffledAnswers.current.sort(() => Math.random() - 0.5);
  //   // sort() has as function as argument, which always receives 2 elements from array.
  //   // shuffledAnswers.sort((a, b) => -1);
  //   // If they are returning a negative number (-1), the elements will be swapped.
  //   // If they are returning a positive number (1), they will not switch their order.
  //   // Function sort() will just go through all elements of the array and derrive a new order.
  //   // Math.random() will giv us a value between 0 and 1 (1 excluded).
  //   // If we deduct 1 from them, we get a negative value.
  //   // If we deduct 0.5 from them, we will sometimes get positive, and sometimes negative number
  //   // -> shuffling the answers.
  //   // We only want to shuffle the answers once at staring each question, and not again after picking answer.
  // }

  // return <p>Currently active question</p>
  return (
    <div id="quiz">
      <Question
        key={activeQuestionIndex} // using the single key, instead of 2 same keys in children-components
        index={activeQuestionIndex}  // we must use our own prop, even if the value is the same as in key. 
        // questionText={QUESTIONS[activeQuestionIndex].text}    // removing reduntant props
        // answers={QUESTIONS[activeQuestionIndex].answers}
        // answerState={answerState}
        // selectedAnswer={userAnswers[userAnswers.length - 1]}
        onSelectAnswer={handleSelectAnswer}
        onSkipAnswer={handleSkipAnswer}
      />
      {/* <div id="question"> */}
      {/* <QuestionTimer
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

        <Answers
          key={activeQuestionIndex} // component will be destroyed and recreated once the key changes
          // but it is WRONG to use the same key on 2 different components, specially if they are siblings in the same div 
          // -> her it creates additional <progress>-bar-elements after each new question - bug!
          answers={QUESTIONS[activeQuestionIndex].answers} // answers-property of each question-object
          selectedAnswer={userAnswers[userAnswers.length - 1]} // latest user's answer
          answerState={answerState}
          onSelect={handleSelectAnswer} // newly added, receives 'answer' from separate component Answers.jsx
        /> */}
      {/* <ul id="answers">  // -> copied into new component: Answers.jsx
          // {shuffledAnswers.map((answer) => { 
          {shuffledAnswers.current.map((answer) => {
            // {QUESTIONS[activeQuestionIndex].answers.map((answer) => (

            // derriving css-class which should be added throuth the button:
            const isSelected = userAnswers[userAnswers.length - 1] === answer;
            // helper constant to check if the last answer is equal to answer in the upper map-function
            let cssClass = "";
            if (answerState === "answered" && isSelected) {
              cssClass = "selected";
            }

            if (
              (answerState === "correct" || answerState === "wrong") &&
              isSelected
            ) {
              cssClass = answerState; // setting the css-class to 'correct' or 'wrong'
            } // .answer button.correct OR .answer button.wrong

            return (
              <li key={answer} className="answer">
                <button
                  onClick={() => handleSelectAnswer(answer)}
                  className={cssClass}
                >
                  {answer}
                </button>
                // function is not just passed, but is included inside of an anonymous function, so tha
            // we can have more control. It will not be called immidietly, but only when the button is clicked. 
              </li>
            );
          })}
        </ul> */}
      {/* </div> */}
    </div>
  );
}
