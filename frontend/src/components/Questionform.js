import React, { useState } from 'react';
import axios from 'axios';
import Navbar from "./Navbar.jsx";
import "./question_generator.css"

function QuestionForm() {
  const [formData, setFormData] = useState({
    question: '',
    subject: '',
    topic: '',
    difficulty: '',
    marks: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Log the form data to the console before making the request
      console.log('Form Data:', formData);

      // Make a POST request to your backend endpoint
      await axios.post('http://localhost:5000/submitForm', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
      // Reset the form after submission
      setFormData({
        question: '',
        subject: '',
        topic: '',
        difficulty: '',
        marks: 0,
      });

      alert('Question submitted successfully!');
    } catch (error) {
      console.error('Error submitting question:', error.message);
    }
  };

  return (
    <>
      <Navbar/>
      <section className='backgroun first' >
        <div className='heading'>
      <h1>Question Form</h1>
      </div>
      <form className='form' onSubmit={handleSubmit}>
        <input
        placeholder='Type the question'
          type="text"
          id="question"
          name="question"
          value={formData.question}
          onChange={handleChange}
          className='input'
          required
        /><br />
        <input
        placeholder='Type the subject'
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className='input'
          required
        /><br />
        <input
        placeholder='Topic'
          type="text"
          id="topic"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          className='input'
          required
        /><br />
        <input
        placeholder='Difficulty'
          type="text"
          id="difficulty"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className='input'
          required
        /><br />
        <input
        placeholder='Enter the marks for this question'
          type="number"
          id="marks"
          name="marks"
          value={formData.marks}
          onChange={handleChange}
          className='input'
          required
        /><br />
        <div className="gap">
        <button className='submit-btn'type="submit">Submit</button>
        </div>
      </form>
      </section>
      </>
  );
}

export default QuestionForm;
