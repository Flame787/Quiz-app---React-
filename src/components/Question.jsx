// to avoid using 2 keys for 2 sibling components inside of the Quiz-component, we created separate component:

import QuestionTimer from "./QuestionTimer";
import Answers from "./Answers";

export default function Question(
  questionText,
  answers,
  onSelectAnswer,
  selectedAnswer,
  answerState,
  onSkipAnswer
) {
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

      {/* <h2>{QUESTIONS[activeQuestionIndex].text}</h2>  */}

      <h2>{questionText}</h2>

      <Answers
        // key={activeQuestionIndex} // component will be destroyed and recreated once the key changes
        // but it is WRONG to use the same key on 2 different components, specially if they are siblings in the same div
        // -> her it creates additional <progress>-bar-elements after each new question - bug!
        // -> keys are not needed anymore here 
        // (we'll use just one single key on the Question-component inside the parent Quiz-component)

        // answers={QUESTIONS[activeQuestionIndex].answers} // answers-property of each question-object
        answers={answers}
        // selectedAnswer={userAnswers[userAnswers.length - 1]} // latest user's answer
        selectedAnswer={selectedAnswer} 
        answerState={answerState}
        // onSelect={handleSelectAnswer} // newly added, receives 'answer' from separate component Answers.jsx
        onSelect={onSelectAnswer}
      />
    </div>
  );
}
