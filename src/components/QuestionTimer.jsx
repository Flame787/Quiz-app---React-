import { useState, useEffect } from "react";

export default function QuestionTimer({ timeout, onTimeout }) {
  
  const [remainingTime, setRemainingTime] = useState(timeout);

  useEffect(() => {
    // 2nd argument for setTimeout function is 'timeout' => timout-value is fetched via prop from another component
    setTimeout(onTimeout, timeout);
  }, [timeout, onTimeout]);
  // this useEffect has 2 dependencies

  useEffect(() => {
    setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 100);
    }, 100);
    // state (progress-bar) is updated every 100 ms
  }, []);

  return <progress id="question-time" max={timeout} value={remainingTime} />;
}
