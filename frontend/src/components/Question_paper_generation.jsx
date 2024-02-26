import React, { useState } from 'react';
import axios from 'axios';
import Navbar from "./Navbar";
import "./question_generator.css";
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

function Question_paper_generation() {
  const [totalMarks, setTotalMarks] = useState('');
  const [easyPercentage, setEasyPercentage] = useState('');
  const [mediumPercentage, setMediumPercentage] = useState('');
  const [hardPercentage, setHardPercentage] = useState('');
  const [questionPaper, setQuestionPaper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGeneratePaper = async () => {
    try {
      const response = await axios.post('http://localhost:5000/generate-paper', {
        totalMarks: parseInt(totalMarks),
        difficultyDistribution: {
          Easy: parseInt(easyPercentage),
          Medium: parseInt(mediumPercentage),
          Hard: parseInt(hardPercentage),
        },
      });

      setTotalMarks('');
      setEasyPercentage('');
      setMediumPercentage('');
      setHardPercentage('');
      setQuestionPaper(response.data);
      openModal();
    } catch (error) {
      console.error('Error generating question paper:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Navbar />
      <section className='backgroun first'>
        <div className='heading'>
          <h1>Question Paper Generator</h1>
        </div>
        <div className='form'>
        <input
            className='input'
            type="number"
            placeholder='Total Marks'
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
          />
          <input
            className='input'
            placeholder='Percentage of Easy Questions'
            type="number"
            value={easyPercentage}
            onChange={(e) => setEasyPercentage(e.target.value)}
          />
          <input
            className='input'
            placeholder='Percentage of Medium Questions'
            type="number"
            value={mediumPercentage}
            onChange={(e) => setMediumPercentage(e.target.value)}
          />
          <input
            className='input'
            placeholder='Percentage of Hard Questions'
            type="number"
            value={hardPercentage}
            onChange={(e) => setHardPercentage(e.target.value)}
          />
          <div className="gap">
            <button className='submit-btn' onClick={handleGeneratePaper}>Generate Question Paper</button>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Generated Question Paper"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <span className="close-btn" onClick={closeModal}>&times;</span>
          <h2>Generated Question Paper</h2>
          {questionPaper && (
            <div>
              <p>Total Marks: {questionPaper.totalMarks}</p>
              {questionPaper.sections.map((section, index) => (
                <div key={index}>
                  <p>
                    {section.difficulty} Questions: {section.marks} Marks
                  </p>
                  <ul>
                    {section.questions.map((q, i) => (
                      <li key={i}>
                        {q.question} - {q.marks} Marks
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Modal>
      </section>
    </>
  );
}

export default Question_paper_generation;
