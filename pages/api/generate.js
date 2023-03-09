import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

function generateBehavioralQuestion(userCompany, userRole) {
    return (
`
Prompt>>> You are an interviewer at Microsoft and you are interviewing someone for a Software Engineer role. Ask the interviewee one question related to the role. The question can be why the company, why the role, behavioral, or technical.
Answer>>> Why do you want to work at Microsoft?

Prompt>>> You are an interviewer at Microsoft and you are interviewing someone for a Software Engineer role. Ask the interviewee one question related to the role. The question can be why the company, why the role, behavioral, or technical.
Answer>>> Why Software Engineering?

Prompt>>> You are an interviewer at Microsoft and you are interviewing someone for a Software Engineer role. Ask the interviewee one question related to the role. The question can be why the company, why the role, behavioral, or technical.
Answer>>> Tell me about a time when you had to work with a difficult team member on a project. How did you handle the situation and what was the outcome?

Prompt>>> You are an interviewer at ${userCompany} and you are interviewing someone for a ${userRole} role. Ask the interviewee one question related to the role. The question can be why the company, why the role, behavioral, or technical.
Answer>>>
`);
}

const generateQuestion = async (req, res) => {
  // Generate First prompt
  console.log(generateBehavioralQuestion(req.body.userCompany, req.body.userRole))

  const baseCompletion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{role: `system`, content: `${generateBehavioralQuestion(req.body.userCompany, req.body.userRole)}`}],
    temperature: 1,
    max_tokens: 500,
  });

  const basePromptOutput = baseCompletion.data.choices[0].message.content;
  console.log(basePromptOutput);
  res.status(200).json({ output: basePromptOutput });
};

export default generateQuestion;