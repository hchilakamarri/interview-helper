import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import React, { useState } from 'react';

const Home = () => {
  
  const [userInput, setUserInput] = useState('');

  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };

  const [apiOutput, setApiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputTitle, setOutputTitle] = useState('');
  const [outputBody, setOutputBody] = useState('');

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);
    
    console.log("Calling OpenAI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });
  
    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text)
  
    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }

  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>sous chef wizard</h1>
          </div>
          <div className="header-subtitle">
            <h2>Add ingredients or anything you're craving (i.e. rice, chicken, butter)</h2>
              <h3><i><b>pro tip:</b> Include cuisine specific ingredients like curry with paneer, onion, tomato</i></h3>
          </div>
        </div>
        <div className="prompt-container">
          <textarea 
            className="prompt-box"
            placeholder="Start Typing Here..." 
            value={userInput}
            onChange={onUserChangedText}
            />
          <div className="prompt-buttons">
            <a 
            className={isGenerating ? 'generate-button loading' : 'generate-button'} 
            onClick={callGenerateEndpoint}
            >
              <div className="generate">
              {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>
          {apiOutput && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Output</h3>
              </div>
            </div>
            <div className="output-content">
              <p>{apiOutput}</p>
            </div>
          </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
