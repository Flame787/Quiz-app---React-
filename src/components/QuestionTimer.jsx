import { useState, useEffect } from "react";

export default function QuestionTimer({ timeout, onTimeout }) {
  const [remainingTime, setRemainingTime] = useState(timeout);

  // To prevent that the setTimeout runs again every time the state is updated,
  // and to prevent having multiple timers up and running, we wrap setTimeout-function into useEffect():
  useEffect(() => {
    console.log("SETTING TIMEOUT");
    // 2nd argument for setTimeout function is 'timeout' => timout-value is fetched via prop from another component
    const timer = setTimeout(onTimeout, timeout);

    // adding the timer-cleanup-function:
    return () => {
      clearTimeout(timer);
    };
  }, [timeout, onTimeout]);
  // this useEffect has 2 dependencies because we are using 2 props here
  // setTimeout-function should re-execute if one of those dependencies is changed
  // (and if surrounding component re-renders)

  // To prevent that this interval sets up whenever the state of this component is changed,
  // we should wrap it into a separate useEffect-hook (runs independantly of useState):
  useEffect(() => {
    console.log("SETTING INTERVAL");
    const interval = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 100);
    }, 100);
    // state (progress-bar) is updated every 100 ms (0.1 sec)
    // every 0.1 sec, we deduct 0.1 sec from the prev. count, so the time is running out

    // adding the interval-cleanup-function:
    return () => {
      clearInterval(interval);
    };
    // cleanup-function will be automatically executed by React before it runs this useEffect-function again,
    // or when this component is unmounted from DOM (if it dissapears from the screen 
    // - f.e. at page-reload, or when we start with next question)
  }, []);
  // During development, </React.StrictMode> in main.jsx will execute every component-function 2x !
  // to help us catch any errors!
  // because some errors won't happen immediately in the first run, but in the 2nd run, or after that...
  // But this also triggers that our interval-function is called 2x, instead just once.
  // Therefore, we need a cleanup-function for interval. Then, it doesn't matter if the interval is called 10x,
  // because we always clean up old intervals, and only one will be up and running at one time.

  return <progress id="question-time" max={timeout} value={remainingTime} />;
}
