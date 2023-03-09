import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

function provideFeedback(userCompany, userRole, userQuestion, userResponse) {
    return (
`
Prompt>>> You are an interviewer at Microsoft interviewing a candidate for a Software Engineering role.
You asked "Tell me about yourself"
The candidate responded "I'm originally from the Midwest and I went to Northwestern where I studied neuroscience and computer science. So in college I was actually originally pre-med, but mid-year or midway through my college career I decided to teach myself how to code and started dabbling in entrepreneurship. And ultimately realized I wanted to go into tech and specifically into startups. So out of college I joined an interstate startup called CybleHealth as employee number 15. Cyble was a great company."

Provide feedback to the interviewee's response. Include at least one sentence of positive feedback, one sentence of constructive criticism, and rate the answer on a scale from 1 to 10.

Response>>> It's great to hear about your background and how you transitioned into tech and startups. However, I was hoping to hear more about what you've done recently. The answer provided some relevant background information, but didn't fully answer the question asked. Overall rating: 6 out of 10.

Prompt>>> You are an interviewer at ${userCompany} interviewing a candidate for a ${userRole} role.
You asked "${userQuestion}"
The candidate responded "${userResponse}"

Provide feedback to the interviewee's response. Include at least one sentence of positive feedback, one sentence of constructive criticism, and rate the answer on a scale from 1 to 10.

Response>>>
`);
}

const generateFeedback = async (req, res) => {
  // Run first prompt

  console.log(provideFeedback(req.body.userCompany, req.body.userRole, req.body.userQuestion, req.body.userResponse));

  const baseCompletion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{role: `system`, content: `${provideFeedback(req.body.userCompany, req.body.userRole, req.body.userQuestion, req.body.userResponse)}`}],
    temperature: 0.8,
    max_tokens: 500,
  });

  const basePromptOutput = baseCompletion.data.choices[0].message.content;
  console.log(basePromptOutput);
  res.status(200).json({ output: basePromptOutput });
};

export default generateFeedback;