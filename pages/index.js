import Head from 'next/head';
import React, { useState } from 'react';

const Home = () => {

  const [userInputRole, setUserInputRole] = useState('');
  const [userInputCompany, setUserInputCompany] = useState('');
  const [userInputJobDescription, setUserInputJobDescription] = useState('');
  const [userInputResponse, setUserInputResponse] = useState('');
  const messages = [];
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [questionNumber, setQuestionNumber] = useState(1);

  const [formData, setFormData] = useState(null);

  const onUserChangedCompany = (event) => {
    console.log(event.target.value);
    setUserInputCompany(event.target.value);
  };

  const onUserChangedRole = (event) => {
    console.log(event.target.value);
    setUserInputRole(event.target.value);
  };

  const onUserChangedJobDescription = (event) => {
    console.log(event.target.value);
    setUserInputJobDescription(event.target.value);
  };

  const onUserChangedAnswer = (event) => {
    console.log(event.target.value);
    setUserInputResponse(event.target.value);
  };

  const [apiOutputQuestion, setApiOutputQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiOutputFeedback, setApiOutputFeedback] = useState('');
  const [isProvidingFeedback, setIsProvidingFeedback] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const callGenerateQuestionEndpoint = async () => {
    // Add animation to the Generate Question Button
    setIsGenerating(true);
    
    console.log("Calling OpenAI for question...")

    // Make API Call
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userRole: userInputRole, userCompany: userInputCompany, jobDescription: userInputJobDescription}),
    });

    const { output } = await response.json();

    console.log("OpenAI replied...", output)

    var outputString = `${output}`;

    // Show Response
    setQuestionNumber(1);
    setApiOutputQuestion(outputString);
    setIsGenerating(false);
  }

  const handleFile = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
     
      // Check that file size is less than 25MB
      if (file.size > 25 * 1024 * 1024) {
        alert("Please upload an audio file less than 25MB");
        return;
      }

      // Updating Form Data
      const data = new FormData();
      data.append("file", file);
      data.append("model", "whisper-1");
      data.append("language", "en");
      data.append("prompt", `${apiOutputQuestion}`)

      setFormData(data);
    }
  };

  const generateTranscription = async () => {
    // Add Animation to Transcribing API
    setIsTranscribing(true);

    console.log("Calling OpenAI for transcription...")

    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? ''}`,
      },
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setUserInputResponse(data.text);
    setIsTranscribing(false);
  }

  const callProvideFeedbackEndpoint = async () => {
    // Add animation to the Recieve Feedback Button
    setIsProvidingFeedback(true);

     // Make API Call
    console.log("Calling OpenAI for feedback...")

    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userRole: userInputRole , userCompany: userInputCompany , userQuestion: apiOutputQuestion , userResponse: userInputResponse}),
    });
  
    const { output } = await response.json();
    console.log("OpenAI replied...", output)

    var outputString = `${output}`;

    // Show Response
    setApiOutputFeedback(outputString);
    setIsProvidingFeedback(false);
  }

  function initialPrompt(company, role, jobDescription){
    return (
      `Prompt>>> You are an interviewer at Microsoft and you are interviewing someone for a Software Engineer role. Ask the interviewee one question related to the role. The question can be why the compnay, why the role, behavioral, or technical.
      Answer>>> Can you give me an example of a time when you had to collaborate with a team to solve a problem, and how did you contribute to the team's success?
      ---
      Prompt>>> You are an interviewer at ${company} and you are interviewing someone for a ${role} role. Job Description: ${jobDescription}. Ask the interviewee one question related to the role. The question can be why the compnay, why the role, behavioral, or technical.
      Answer>>>`
      );
  }

  function updateMessages() {
    if(isFirstMessage){
      messages.push({'role': 'system', 'content':`${initialPrompt(userInputCompany, userInputRole, userInputJobDescription)}`});
      setIsFirstMessage(false);
    }
    else {
      messages.push({'role': 'assistant', 'content': apiOutputQuestion});
    }
    messages.push({'role': 'user', 'content': userInputResponse});
  }

  const callGenerateFollowUpEndpoint = async () => {
    // Add animation to the Generate Question Button
    setIsGenerating(true);
    updateMessages();
    
    console.log("Calling OpenAI for next question...")

    // Make API Call
    const response = await fetch('/api/generateFollowUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({messages: messages}),
    });

    const { output } = await response.json();

    console.log("OpenAI replied...", output)

    var outputString = `${output}`;

    // Show Response
    setUserInputResponse('');
    setApiOutputFeedback('');
    setQuestionNumber(questionNumber + 1);
    setApiOutputQuestion(outputString);
    setIsGenerating(false);
  }

  return (
    <div className="root">
      <Head>
        <title>Interview Helper</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Interview Assistant</h1>
          </div>
          <div className="header-subtitle">
            <h2>Practice without pressure!</h2>
              <h3>1. Add a company and role<br></br>2. Generate a question<br></br>3. Type or record your response<br></br>4. Ask for feedback or move to the next question</h3>
          </div>
        </div>
        <div className="prompt-container">
          <input 
            className="prompt-box"
            placeholder="Company..." 
            maxLength="2048"
            value={userInputCompany}
            onChange={onUserChangedCompany}
            />
          <input 
            className="prompt-box"
            placeholder="Role..." 
            maxLength="2048"
            value={userInputRole}
            onChange={onUserChangedRole}
            />
            <input 
            className="prompt-box"
            placeholder="(Optional) Job Description..." 
            maxLength="2048"
            value={userInputJobDescription}
            onChange={onUserChangedJobDescription}
            />
          <div className="prompt-buttons">
            <a 
            className={isGenerating ? 'generate-button loading' : 'generate-button'} 
            onClick={callGenerateQuestionEndpoint}
            >
              <div className="generate">
              {isGenerating ? <span className="loader"></span> : <p>New Interview</p>}
              </div>
            </a>
          </div>
        </div>
        {apiOutputQuestion && (
          <div className="output">
            <div className="output-content">
              <h1><b>Question #{questionNumber}</b></h1>
              <h2>{apiOutputQuestion}</h2>
            </div>
          </div>
          )}
        {apiOutputQuestion && (
        <div className="prompt-container-2">
          <textarea 
            className="prompt-box-2"
            placeholder="Written Reponse..." 
            value={userInputResponse}
            onChange={onUserChangedAnswer}
            />
          <div className='upload-box'>
            <h3>Record and Upload a Response</h3>
            <input
            className='file-input'
            type="file"
            accept="audio/*"
            onChange={handleFile}
            />
            <a 
            className={isTranscribing ? 'transcribe-button loading' : 'transcribe-button'} 
            onClick={generateTranscription}
            >
              <div className="generate">
              {isTranscribing ? <span className="loader"></span> : <p>Transcribe</p>}
              </div>
            </a>
          </div>
          <div className="prompt-buttons">
            <a 
            className={isProvidingFeedback ? 'generate-button loading' : 'generate-button'} 
            onClick={callProvideFeedbackEndpoint}
            >
              <div className="generate">
              {isProvidingFeedback ? <span className="loader"></span> : <p>Get Feedback</p>}
              </div>
            </a>
            <a 
            className={isGenerating ? 'generate-button loading' : 'generate-button'} 
            onClick={callGenerateFollowUpEndpoint}
            >
              <div className="generate">
              {isGenerating ? <span className="loader"></span> : <p>Next Question</p>}
              </div>
            </a>
          </div>
          {apiOutputFeedback && (
          <div className="output">
            <div className="output-content">
              <h3>{apiOutputFeedback}</h3>
            </div>
          </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Home;
