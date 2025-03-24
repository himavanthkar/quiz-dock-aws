import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../context/QuizContext';

// Main component for creating a new quiz
const CreateQuiz = () => {
  // Hooks for navigation and context
  const navigate = useNavigate();
  const { createQuiz } = useContext(QuizContext);
  
  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general', // default category
    timeLimit: 0,
    passingScore: 70,
    shuffleQuestions: false,
    isPublic: true,
    questions: []
  });
  
  // Current question being edited
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    choices: ['', '', '', ''],
    rightAnswer: 0,
    explanation: '',
    points: 10,
    difficulty: 'medium'
  });
  
  // Track which step of the form we're on
  const [step, setStep] = useState(1);
  
  // Destructure form data for easier access
  const { 
    title, 
    description, 
    category, 
    timeLimit, 
    passingScore, 
    shuffleQuestions, 
    isPublic, 
    questions 
  } = formData;
  
  // Available quiz categories
  const categories = [
    { value: 'general', label: 'General Knowledge' },
    { value: 'history', label: 'Wizarding History' },
    { value: 'spells', label: 'Spells & Charms' },
    { value: 'potions', label: 'Potions' },
    { value: 'creatures', label: 'Magical Creatures' },
    { value: 'characters', label: 'Characters' },
    { value: 'places', label: 'Magical Places' },
    { value: 'other', label: 'Other' }
  ];
  
  // Handle form field changes
  const onChange = e => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox inputs differently
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle question field changes
  const onQuestionChange = e => {
    const { name, value, type, checked } = e.target;
    
    setCurrentQuestion({
      ...currentQuestion,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle changes to answer choices
  const onChoiceChange = (index, value) => {
    // Create a copy of the choices array
    const newChoices = [...currentQuestion.choices];
    
    // Update the specific choice
    newChoices[index] = value;
    
    setCurrentQuestion({
      ...currentQuestion,
      choices: newChoices
    });
  };
  
  // Add a new answer choice
  const addChoice = () => {
    // Limit to 6 choices max
    if (currentQuestion.choices.length < 6) {
      setCurrentQuestion({
        ...currentQuestion,
        choices: [...currentQuestion.choices, '']
      });
    }
  };
  
  // Remove an answer choice
  const removeChoice = index => {
    // Keep at least 2 choices
    if (currentQuestion.choices.length > 2) {
      // Filter out the choice at the given index
      const newChoices = currentQuestion.choices.filter((_, i) => i !== index);
      
      // Need to adjust the right answer if it's affected
      let newRightAnswer = currentQuestion.rightAnswer;
      
      if (index === currentQuestion.rightAnswer) {
        // If we're removing the correct answer, default to the first option
        newRightAnswer = 0;
      } else if (index < currentQuestion.rightAnswer) {
        // If we're removing an option before the correct answer, decrement the index
        newRightAnswer--;
      }
      
      setCurrentQuestion({
        ...currentQuestion,
        choices: newChoices,
        rightAnswer: newRightAnswer
      });
    }
  };
  
  // Add the current question to the quiz
  const addQuestion = () => {
    // Validate the question first
    if (
      currentQuestion.text.trim() === '' ||
      currentQuestion.choices.some(choice => choice.trim() === '')
    ) {
      alert('Please fill in all fields for the question and choices.');
      return;
    }
    
    // Add the question to our form data
    setFormData({
      ...formData,
      questions: [...questions, currentQuestion]
    });
    
    // Reset the current question form
    setCurrentQuestion({
      text: '',
      choices: ['', '', '', ''],
      rightAnswer: 0,
      explanation: '',
      points: 10,
      difficulty: 'medium'
    });
  };
  
  // Edit an existing question
  const editQuestion = index => {
    // Load the question into the editor
    setCurrentQuestion(questions[index]);
    
    // Remove it from the list
    const newQuestions = questions.filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      questions: newQuestions
    });
  };
  
  // Remove a question from the quiz
  const removeQuestion = index => {
    // Filter out the question at the given index
    const newQuestions = questions.filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      questions: newQuestions
    });
  };
  
  // Move to the next step in the form
  const nextStep = () => {
    // Validate the current step before proceeding
    if (step === 1) {
      if (title.trim() === '' || description.trim() === '') {
        alert('Please fill in all required fields.');
        return;
      }
    }
    
    // Increment the step
    setStep(step + 1);
  };
  
  // Go back to the previous step
  const prevStep = () => {
    setStep(step - 1);
  };
  
  // Submit the form to create the quiz
  const onSubmit = async e => {
    e.preventDefault();
    
    // Make sure we have at least one question
    if (questions.length === 0) {
      alert('Please add at least one question to your quiz.');
      return;
    }
    
    // Create the quiz and redirect to its page
    const quiz = await createQuiz(formData);
    
    if (quiz) {
      navigate(`/quizzes/${quiz._id}`);
    }
  };
  
  // Render the component
  return (
    <div className="container mt-4">
      <div className="card shadow-lg mb-4">
        {/* Card Header */}
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">
            <i className="fas fa-magic mr-2"></i>
            Create a New Magical Quiz
          </h2>
        </div>
        
        {/* Card Body */}
        <div className="card-body">
          {/* Progress Bar */}
          <div className="progress mb-4">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${(step / 3) * 100}%` }}
              aria-valuenow={step}
              aria-valuemin="0"
              aria-valuemax="3"
            >
              Step {step} of 3
            </div>
          </div>
          
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="step-1">
              <h4 className="mb-3">
                <i className="fas fa-info-circle mr-2"></i>
                Basic Information
              </h4>
              
              {/* Quiz Title */}
              <div className="form-group">
                <label htmlFor="title">Quiz Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={title}
                  onChange={onChange}
                  placeholder="Enter a magical title for your quiz"
                  required
                />
              </div>
              
              {/* Quiz Description */}
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={description}
                  onChange={onChange}
                  placeholder="Describe what your quiz is about"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              {/* Quiz Category */}
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  className="form-control"
                  id="category"
                  name="category"
                  value={category}
                  onChange={onChange}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Quiz Image */}
              <div className="form-group">
                <label htmlFor="quizImage">Quiz Image URL (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  id="quizImage"
                  name="quizImage"
                  value={formData.quizImage || ''}
                  onChange={onChange}
                  placeholder="Enter an image URL for your quiz"
                />
                <small className="form-text text-muted">
                  Leave blank for a random image
                </small>
              </div>
            </div>
          )}
          
          {/* Step 2: Quiz Settings */}
          {step === 2 && (
            <div className="step-2">
              <h4 className="mb-3">
                <i className="fas fa-cog mr-2"></i>
                Quiz Settings
              </h4>
              
              <div className="row">
                {/* Time Limit */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="timeLimit">Time Limit (minutes)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="timeLimit"
                      name="timeLimit"
                      value={timeLimit}
                      onChange={onChange}
                      min="0"
                      max="180"
                    />
                    <small className="form-text text-muted">
                      0 means no time limit
                    </small>
                  </div>
                </div>
                
                {/* Passing Score */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="passingScore">Passing Score (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="passingScore"
                      name="passingScore"
                      value={passingScore}
                      onChange={onChange}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>
              
              {/* Shuffle Questions Toggle */}
              <div className="form-group">
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="shuffleQuestions"
                    name="shuffleQuestions"
                    checked={shuffleQuestions}
                    onChange={onChange}
                  />
                  <label className="custom-control-label" htmlFor="shuffleQuestions">
                    Shuffle Questions
                  </label>
                </div>
              </div>
              
              {/* Public Quiz Toggle */}
              <div className="form-group">
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="isPublic"
                    name="isPublic"
                    checked={isPublic}
                    onChange={onChange}
                  />
                  <label className="custom-control-label" htmlFor="isPublic">
                    Make Quiz Public
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Add Questions */}
          {step === 3 && (
            <div className="step-3">
              <h4 className="mb-3">
                <i className="fas fa-question-circle mr-2"></i>
                Add Questions
              </h4>
              
              {/* Question Editor */}
              <div className="card mb-4">
                <div className="card-header bg-info text-white">
                  <h5 className="mb-0">Question Editor</h5>
                </div>
                <div className="card-body">
                  {/* Question Text */}
                  <div className="form-group">
                    <label htmlFor="questionText">Question Text</label>
                    <input
                      type="text"
                      className="form-control"
                      id="questionText"
                      name="text"
                      value={currentQuestion.text}
                      onChange={onQuestionChange}
                      placeholder="Enter your question"
                      required
                    />
                  </div>
                  
                  {/* Answer Choices */}
                  <div className="form-group">
                    <label>Answer Choices</label>
                    
                    {/* Map through each choice */}
                    {currentQuestion.choices.map((choice, index) => (
                      <div key={index} className="input-group mb-2">
                        {/* Radio button for correct answer */}
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <input
                              type="radio"
                              name="rightAnswer"
                              value={index}
                              checked={parseInt(currentQuestion.rightAnswer) === index}
                              onChange={onQuestionChange}
                              aria-label="Correct answer"
                            />
                          </div>
                        </div>
                        
                        {/* Choice text input */}
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Choice ${index + 1}`}
                          value={choice}
                          onChange={e => onChoiceChange(index, e.target.value)}
                          required
                        />
                        
                        {/* Remove button (only if we have more than 2 choices) */}
                        {currentQuestion.choices.length > 2 && (
                          <div className="input-group-append">
                            <button
                              className="btn btn-outline-danger"
                              type="button"
                              onClick={() => removeChoice(index)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Add Choice Button */}
                    {currentQuestion.choices.length < 6 && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={addChoice}
                      >
                        <i className="fas fa-plus mr-1"></i> Add Choice
                      </button>
                    )}
                  </div>
                  
                  {/* Explanation */}
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="explanation">Explanation (Optional)</label>
                        <textarea
                          className="form-control"
                          id="explanation"
                          name="explanation"
                          value={currentQuestion.explanation}
                          onChange={onQuestionChange}
                          placeholder="Explain why the answer is correct"
                          rows="2"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  {/* Points and Difficulty */}
                  <div className="row">
                    {/* Points */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="points">Points</label>
                        <input
                          type="number"
                          className="form-control"
                          id="points"
                          name="points"
                          value={currentQuestion.points}
                          onChange={onQuestionChange}
                          min="1"
                          max="100"
                        />
                      </div>
                    </div>
                    
                    {/* Difficulty */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="difficulty">Difficulty</label>
                        <select
                          className="form-control"
                          id="difficulty"
                          name="difficulty"
                          value={currentQuestion.difficulty}
                          onChange={onQuestionChange}
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Add/Update Question Button */}
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={addQuestion}
                  >
                    <i className="fas fa-plus-circle mr-1"></i>
                    {currentQuestion._id ? 'Update Question' : 'Add Question'}
                  </button>
                </div>
              </div>
              
              {/* Questions List */}
              <div className="questions-list">
                <h5 className="mb-3">
                  <i className="fas fa-list mr-2"></i>
                  Questions ({questions.length})
                </h5>
                
                {/* Show message if no questions added */}
                {questions.length === 0 ? (
                  <div className="alert alert-info">
                    No questions added yet. Use the form above to add questions.
                  </div>
                ) : (
                  <div className="list-group">
                    {/* Map through each question */}
                    {questions.map((question, index) => (
                      <div key={index} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="mb-1">
                            <span className="badge badge-secondary mr-2">Q{index + 1}</span>
                            {question.text}
                          </h5>
                          <div>
                            {/* Edit button */}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary mr-2"
                              onClick={() => editQuestion(index)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            
                            {/* Delete button */}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeQuestion(index)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <p className="mb-1">
                          <small>
                            {question.choices.length} choices | 
                            {question.points} points | 
                            {question.difficulty} difficulty
                          </small>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Card Footer with Navigation Buttons */}
        <div className="card-footer">
          <div className="d-flex justify-content-between">
            {/* Previous Button (only show if not on first step) */}
            {step > 1 ? (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={prevStep}
              >
                <i className="fas fa-arrow-left mr-1"></i> Previous
              </button>
            ) : (
              <div></div>
            )}
            
            {/* Next/Create Button */}
            {step < 3 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
              >
                Next <i className="fas fa-arrow-right ml-1"></i>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-success"
                onClick={onSubmit}
                disabled={questions.length === 0}
              >
                <i className="fas fa-save mr-1"></i> Create Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz; 