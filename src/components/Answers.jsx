import { useRef } from "react";

export default function Answers({
  answers,
  selectedAnswer,
  answerState,
  onSelect,
}) {
  const shuffledAnswers = useRef();

  // wrapping the shuffledAnswers.current with this logic:  -> later moved to Answers.jsx-component
  // if shuffledAnswers.current is undefined/not truethy, then there are no shuffeled answers (initial state):
  // only then will the answers be shuffled - once,
  // but if they were already shuffled (if condition is truethy), then the following code will not be executed:
  if (!shuffledAnswers.current) {
    // const shuffledAnswers = [...QUESTIONS[activeQuestionIndex].answers];
    // shuffledAnswers.current = [...QUESTIONS[activeQuestionIndex].answers];
    shuffledAnswers.current = [...answers]; // using answers as prop here
    // we will sort new array and not original saved array 'questions' (it must always stay in initial order)
    shuffledAnswers.current.sort(() => Math.random() - 0.5);
    // sort() has as function as argument, which always receives 2 elements from array.
    // shuffledAnswers.sort((a, b) => -1);
    // If they are returning a negative number (-1), the elements will be swapped.
    // If they are returning a positive number (1), they will not switch their order.
    // Function sort() will just go through all elements of the array and derrive a new order.
    // Math.random() will giv us a value between 0 and 1 (1 excluded).
    // If we deduct 1 from them, we get a negative value.
    // If we deduct 0.5 from them, we will sometimes get positive, and sometimes negative number
    // -> shuffling the answers.
    // We only want to shuffle the answers once at staring each question, and not again after picking answer.
  }

  return (
    // cut the <ul> from the Quiz-component-return and pasted it here:
    <ul id="answers">
      {/* {shuffledAnswers.map((answer) => { */}
      {shuffledAnswers.current.map((answer) => {
        // {QUESTIONS[activeQuestionIndex].answers.map((answer) => (

        // derriving css-class which should be added throuth the button:
        // const isSelected = userAnswers[userAnswers.length - 1] === answer;
        const isSelected = selectedAnswer === answer;
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
              // onClick={() => handleSelectAnswer(answer)}
              onClick={() => onSelect(answer)}
              className={cssClass}
              disabled={answerState != ""}
              // disabled-prop = is making sure that we cannot click on other answers, if we already selected an answer.
              // button should get disabled, if answer is not equal to empty string (if something was already selected)
            >
              {answer}
            </button>
            {/* function is not just passed, but is included inside of an anonymous function, so tha
      we can have more control. It will not be called immidietly, but only when the button is clicked. */}
          </li>
        );
      })}
    </ul>
  );
}
