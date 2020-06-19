import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import styles from "./App.module.css";
import axios from "axios";

const App = () => {
  const FULL_STACK_URL = "https://www.fullstack.cafe/api/v1";
  const [topics, setTopics] = useState(null);
  const [questions, setQuestion] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [quesIds, setQuesIds] = useState([]);
  const getTopics = async () => {
    const fullStackTopics = await axios.get(`${FULL_STACK_URL}/topics/topics/`);
    const topics = await fullStackTopics.data;

    setTopics(topics);
  };

  const questionsForTopics = async (topic) => {
    const questionsData = await axios.get(
      `${FULL_STACK_URL}/questions/topics/${topic}`
    );
    const data = await questionsData.data;
    const quesData = data.map((question) => ({
      id: question._id,
      title: question.title,
    }));
    setQuestion(quesData);
  };

  const getAnswerValue = async (id) => {
    console.log(quesIds);
    // if (quesIds.includes(id)) return;
    const answerData = await axios.get(`${FULL_STACK_URL}/questions/${id}`);
    const ans = await answerData.data;
    setAnswer((prev) => ({ ...prev, id: id, answer: ans.answer }));
    // setQuesIds((prev) => [...prev, id]);
  };

  useEffect(() => {
    getTopics();
  }, []);

  const getQuestions = (value) => {
    questionsForTopics(value);
  };

  const getAnswer = (e) => {
    getAnswerValue(e.currentTarget.dataset.id);
  };
  const Answers = ({ getAnswer }) => {
    const questionsAnswers = questions.map((qa) => (
      <li key={qa.id} data-id={qa.id} onClick={getAnswer}>
        {qa.title}
        <br />
        <br />
        {answer && answer.id === qa.id ? answer.answer : <></>}
        <br />
        <br />
      </li>
    ));
    return <ul>{questionsAnswers}</ul>;
  };

  const Topics = ({ getQuestions }) => {
    const handleClick = (e) => {
      getQuestions(e.currentTarget.dataset.value);
    };
    const listItems =
      topics &&
      topics.map((topic, index) => (
        <li
          key={index}
          id={index}
          data-value={topic.name}
          onClick={handleClick}
        >
          {topic.name}
        </li>
      ));
    return (
      <>
        <ul>{listItems}</ul>
      </>
    );
  };

  return (
    <div className={styles.App}>
      <Topics getQuestions={getQuestions} />
      <Answers getAnswer={getAnswer} />
    </div>
  );
};

export default App;
