/* 
TO-DO
 */
import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';
import formidable from 'formidable';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  api: {
    bodyParser: false
  }
};

const openai = new OpenAIApi(configuration);

const transcribeAudio = async (req, res) => {
  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    console.log("Parsing Form")
    if(!files.demo) {
      console.log("Empty Files")
      res.status(400).send("No file uploaded");
      return;
    }

    try {
      console.log("attempting API Call")
      const audioFile = fs.createReadStream(files.demo.filepath);
      console.log(audioFile);
      const resp = await openai.createTranscription(
        audioFile,
        'whisper-1'
      )
      
      const transcriptionOutput = resp.data;
      console.log(transcriptionOutput);
      res.status(200).json({ output: transcriptionOutput });
    }

    catch(err) {
      console.error(err.response.error);
    };
  });
};

export default transcribeAudio;