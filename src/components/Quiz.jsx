import { useState } from "react";

export default function Quiz(){

// state-logic to manage currently active question, change to different question, store the answers 

const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

const [userAnswers, setUserAnswers] = useState([]);

    return <p>Currently active question</p>
}