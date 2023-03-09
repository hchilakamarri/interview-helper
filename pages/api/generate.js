import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

function generateBehavioralQuestion(userCompany, userRole, jobDescription) {
  if(jobDescription){
    return (
      `
      Prompt>>> You are an interviewer at Microsoft and you are interviewing someone for a Software Engineer role. Ask the interviewee one question related to the role. The question can be why the company, why the role, behavioral, or technical.
      Answer>>> Why do you want to work at Microsoft?
      
      Prompt>>> You are an interviewer at Microsoft and you are interviewing someone for a Software Engineer role. Ask the interviewee one question related to the role. The question can be why the company, why the role, behavioral, or technical.
      Answer>>> Why Software Engineering?
      
      Prompt>>> You are an interviewer at Microsoft and you are interviewing someone for a Software Engineer role. Ask the interviewee one question related to the role. The question can be why the company, why the role, behavioral, or technical.
      Answer>>> Tell me about a time when you had to work with a difficult team member on a project. How did you handle the situation and what was the outcome?
      
      Prompt>>> You are an interviewer at OpenAI and you are interviewing someone for a Buisness Develpoment Representative role. Job Description: Generate new business opportunities to fuel the sales pipeline Efficiently respond and qualify inbound leads Drive net new business meetings by conducting targeted campaigns, emails and cold calls Conduct high level discovery calls with senior executives in target and prospect accounts Help create and prioritize strategic target account lists within a defined territory Research and build new and existing accounts (i.e.: adding contacts, emails, strategic calling) Achieve monthly quotas of qualified opportunities and meetings. Ask the interviewee one question related to the role. The question can be why the company, why the role, behavioral, or technical.
      Answer>>> What experience do you have in sales or business development, and how do you plan to use that experience in this role at OpenAI?
      
      Prompt>>> You are an interviewer at ${userCompany} and you are interviewing someone for a ${userRole} role. Job Description: ${jobDescription}. Ask the interviewee one question related to the role. The question can be why the company, why the role, behavioral, or technical.
      Answer>>>
      `
    )
  } else {
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
      `
    )
  }
};

const generateQuestion = async (req, res) => {
  // Generate First prompt
  console.log(generateBehavioralQuestion(req.body.userCompany, req.body.userRole, req.body.jobDescription))

  const baseCompletion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{role: `system`, content: `${generateBehavioralQuestion(req.body.userCompany, req.body.userRole, req.body.jobDescription)}`}],
    temperature: 1,
    max_tokens: 500,
  });

  const basePromptOutput = baseCompletion.data.choices[0].message.content;
  console.log(basePromptOutput);
  res.status(200).json({ output: basePromptOutput });
};

export default generateQuestion;