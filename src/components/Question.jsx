// to avoid using 2 keys for 2 sibling components inside of the Quiz-component, we created separate component:

import { useState } from "react";

import QuestionTimer from "./QuestionTimer";
import Answers from "./Answers";

import QUESTIONS from "../questions.js";

export default function Question(  // list of props:
  {index,   // initially: 'key', but we must rename this prop, as we cannot use 'key' as a prop
  //   questionText,   // removing props which are not needed, once we have more logic in this component
  //   answers,
  onSelectAnswer,
  //   selectedAnswer,
  //   answerState,
  onSkipAnswer}
) {
  // moving logic to the places where it belogs:
  const [answer, setAnswer] = useState({
    selectedAnswer: "",
    isCorrect: null, // can later be true or false
  });

  function handleSelectAnswer(answer) {
    setAnswer({
      selectedAnswer: answer,
      isCorrect: null, // we don't know yet if the answer is correct or wrong
    });
    setTimeout(() => {
      setAnswer({
        selectedAnswer: answer,
        isCorrect: QUESTIONS[index].answers[0] === answer,
        // after 1 sec, we determine if answer is correct or wrong, and mark it with color.
        // if selected answer is the same as the 1st answer in the question.js for this question-key,
        // then isCorrect will be true, otherwise it will be false
      });

      // additional timer (nested) which will mark the selected answer as correct or wrong:
      setTimeout(() => {
        onSelectAnswer(answer);
      }, 2000);
      // here ends nested timer.
    }, 1000);
  }

  // new: a helper-variable:
  let answerState = "";

  if (answer.selectedAnswer) {
    answerState = answer.isCorrect ? "correct" : "wrong";
  }

  return (
    <div id="question">
      <QuestionTimer
        // key={activeQuestionIndex}
        // adding key: whenever the key changes, React will destroy the old component and create a new one
        // so React will unmount the component from DOM, and remount the component back into DOM.
        // we can use 'key' when we want to recreate/restart the 'timer'-component (<progress> above each question)
        // -> but keys are not needed anymore here
        // (we'll use just one single key on the Question-component inside the parent Quiz-component)

        timeout={10000} // setting timer to max. value of 10 sec
        // onTimeout={() => handleSelectAnswer(null)}
        // null = placeholder, if no answer was chosen for this question, and the time runs out
        // onTimeout={() => handleSelectAnswer(handleSkipAnswer)} -> moved that function up into useCallback
        // each time a new <QuestionTimer> starts, newer TIMER and INTERVAL are started
        // onTimeout={handleSkipAnswer}
        onTimeout={onSkipAnswer}
      />

    

      {/* <h2>{QUESTIONS[index].text}</h2> */}

      <Answers
        // key={activeQuestionIndex} // component will be destroyed and recreated once the key changes
        // but it is WRONG to use the same key on 2 different components, specially if they are siblings in the same div
        // -> her it creates additional <progress>-bar-elements after each new question - bug!
        // -> keys are not needed anymore here
        // (we'll use just one single key on the Question-component inside the parent Quiz-component)

        // answers={QUESTIONS[activeQuestionIndex].answers} // answers-property of each question-object
        // answers={answers}
        answers={QUESTIONS[index].answers}
        // selectedAnswer={userAnswers[userAnswers.length - 1]} // latest user's answer
        // selectedAnswer={selectedAnswer}
        selectedAnswer={answer.selectedAnswer}
        answerState={answerState}
        // onSelect={handleSelectAnswer} // newly added, receives 'answer' from separate component Answers.jsx
        // onSelect={onSelectAnswer}
        onSelect={handleSelectAnswer}
      />
    </div>
  );
}
