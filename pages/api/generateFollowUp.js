import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

var followUpHelper = 
`
Prompt>>> You are the interviewer. Ask the interviewee one question related to the role. This question can be a follow-up or a new behavior or technical question.
Answer>>> Tell me about a time when you had to manage competing priorities and how you prioritized and managed them effectively?

Prompt>>> You are the interviewer. Ask the interviewee one question related to the role. This question can be a follow-up or a new behavior or technical question.
Answer>>> Can you walk me through how you would approach troubleshooting a technical issue with a customer over the phone? What steps would you take to diagnose and resolve the issue while providing excellent customer service?

Prompt>>> You are the interviewer. Ask the interviewee one question related to the role. This question can be a follow-up or a new behavior or technical question.
Answer>>>
`;

const generateFollowUp = async (req, res) => {
  console.log('Attempting API Call')
  var allMessages = req.body.messages;
  allMessages.push({role: 'assistant', content: followUpHelper})
  console.log(Array.isArray(req.body.messages));

  try {
    const baseCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: allMessages,
      temperature: 0.8,
    });

    console.log(baseCompletion);

  const basePromptOutput = baseCompletion.data.choices[0].message.content;
  console.log(basePromptOutput);
  res.status(200).json({ output: basePromptOutput });
  } catch (err) {
    console.error(err.response.data);
  }
};

export default generateFollowUp;