const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/question_bank', { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connection successful");
}

const questionSchema = new mongoose.Schema({
  question: String,
  subject: String,
  topic: String,
  difficulty: String,
  marks: Number,
});

const Question = mongoose.model('Question', questionSchema);

app.use(bodyParser.json());

app.use(express.static('public'));


//Api to take a question as input and store it in the database
app.post('/submitForm', async (req, res) => {
  try {
    const formData = req.body;
    console.log('Form Data Received:', formData);
    const newQuestionData = new Question(formData);
    const result = await newQuestionData.save();
    console.log('Question saved to the database:', result);
    res.send('Question submitted successfully!');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});




// Function to generate a question paper based on difficulty distribution using dynamic programming
const generateQuestionPaper = async (totalMarks, difficultyDistribution) => {
  const questionPaper = {
    totalMarks,
    sections: [],
  };

  const calculateMarksForDifficulty = (percentage) => Math.floor((percentage / 100) * totalMarks);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const generateSection = async (difficulty, marksForDifficulty) => {
    const questions = await Question.find({ difficulty });
    const shuffledQuestions = shuffleArray([...questions]); // Ensure a copy is shuffled

    const dp = Array(marksForDifficulty + 1).fill(false);
    dp[0] = true;

    for (const question of shuffledQuestions) {
      for (let i = marksForDifficulty; i >= question.marks; i--) {
        if (dp[i - question.marks]) {
          dp[i] = true;
        }
      }
    }

    if (dp[marksForDifficulty]) {
      // There exists a sequence, find it
      const selectedQuestions = [];
      let remainingMarks = marksForDifficulty;

      for (const question of shuffledQuestions) {
        if (question.marks <= remainingMarks && dp[remainingMarks - question.marks]) {
          selectedQuestions.push(question);
          remainingMarks -= question.marks;
        }

        if (remainingMarks === 0) {
          break;
        }
      }

      questionPaper.sections.push({
        difficulty,
        marks: marksForDifficulty,
        questions: [...selectedQuestions],
      });
    }
  };

  const easyMarks = calculateMarksForDifficulty(difficultyDistribution.Easy);
  const mediumMarks = calculateMarksForDifficulty(difficultyDistribution.Medium);
  const hardMarks = calculateMarksForDifficulty(difficultyDistribution.Hard);

  await generateSection('Easy', easyMarks);
  await generateSection('Medium', mediumMarks);
  await generateSection('Hard', hardMarks);

  return questionPaper;
};


//api to handle generate paper request

app.post('/generate-paper', async (req, res) => {
  const { totalMarks, difficultyDistribution } = req.body;

  if (!totalMarks || !difficultyDistribution) {
    return res.status(400).json({ error: 'Invalid request. Please provide totalMarks and difficultyDistribution.' });
  }
console.log(totalMarks)
console.log(difficultyDistribution)
  

  try {
    const questionPaper = await generateQuestionPaper(totalMarks, difficultyDistribution);
    res.json(questionPaper);
  } catch (error) {
    console.error('Error generating question paper:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});





app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
