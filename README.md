# Interview Prep Guide using ChatGPT and Whisper
Interview Assistant generates interview questions so you can practice at your own pace!

[Video Demo](https://www.loom.com/share/8a47a9cb29aa49729f3399b3e65d363d)

## Instructions
1. Add the company and role you're applying to (optionally, add the job description)
2. Start a new interview
3. Answer the generated question by recording a response or writing one
4. Recieve feedback on your response including positives, critiscim, and a rating
5. Generate a follow-up

## Build
This repo uses OpenAI's chat completion (gpt3.5-turbo) and voice transcription APIs (whisper-1).

### OpenAI API
1. The following are generated using gpt3.5-turbo
    a. Initial Questions
    b. Feedback
    c. Follow-up questions
2. Recordings are transcribed with whisper-1

### ChatGPT
I used ChatGPT for several use cases when building this project:
1. Debugging code - ChatGPT was able to provide very specific answers if I provided the full context of code and any exceptions that were thrown. When the problem was more nebulous, ChatGPT explained concepts or code edits (i.e. console.error(err)) when necessary so I could better debug code myself.
2. Project Feedback - I explained the prompt I was given for this project and my soluiton. ChatGPT provided feedback on my solution.
3. New Feature Suggestions - After explaining the project, I asked ChatGPT for feature solutions and implemented some such as a scoring feature (question number) etc.