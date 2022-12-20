import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

function basePromptPrefix(userPrompt) {
    return (
`
Prompt: Write me a food description with a title that uses some of the following ingredients:
chicken, garam masala

Output: 
Aromatic Garam Masala Chicken

This delectable dish is a feast for the senses. Aromatic garam masala spices tantalize the nose with notes of cumin, coriander, cardamom, pepper, and ginger. Succulent chicken pieces are marinated in the spices then lightly pan-fried, giving the chicken a crispy golden-brown exterior. The juicy, tender chicken is a perfect compliment to the flavorsome garam masala. Enjoy this delicious and flavorful dish!

Prompt: Write me a food description with a title that uses some of the following ingredients:
${userPrompt}

Output:
`);
}

function secoondPromptPrefix(generatedPrompt) {
    return (
`
Prompt: Write a recipe in 10 steps or less for the following dish:

Nutrient-Packed Beet and Chia Bowl

This flavorful and nourishing bowl is the perfect way to start your day. Colorful beets are steamed and sliced into cubes, then mixed with nutrient-rich chia seeds. Topped with a light lemon-yogurt dressing, this bowl is bursting with flavor and crunch. The beets provide fiber and vitamins, while the chia seeds are a great source of protein, omega-3 fatty acids, and antioxidants. Enjoy this delicious and healthy breakfast bowl!

Output:

Nutrient-Packed Beet and Chia Bowl

This flavorful and nourishing bowl is the perfect way to start your day. Colorful beets are steamed and sliced into cubes, then mixed with nutrient-rich chia seeds. Topped with a light lemon-yogurt dressing, this bowl is bursting with flavor and crunch. The beets provide fiber and vitamins, while the chia seeds are a great source of protein, omega-3 fatty acids, and antioxidants. Enjoy this delicious and healthy breakfast bowl!

Ingredients

-2 medium beets
-1 tablespoon chia seeds
-3 tablespoons plain yogurt
-1 tablespoon lemon juice
-Salt and pepper, to taste

Instructions

1. Preheat oven to 375 degrees F and line a baking sheet with aluminum foil.

2. Cut the beets into 1/2 inch cubes and place them on the baking sheet.

3. Drizzle with olive oil and season with salt and pepper.

4. Roast for 20-25 minutes, flipping halfway through.

5. Once the beets are cooked, remove from the oven and let cool.

6. In a medium bowl, combine the beets, chia seeds, yogurt, and lemon juice.

7. Mix well and season with salt and pepper, to taste.

8. Divide the mixture into two bowls.

9. Serve warm or chill in the refrigerator before eating.

10. Enjoy!

Prompt: Write a recipe in 10 steps or less for the following dish:
${generatedPrompt}

Output: 
`);
}

const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix(req.body.userInput)}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix(req.body.userInput)}`,
    temperature: 0.8,
    max_tokens: 500,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt = secoondPromptPrefix(basePromptOutput.text);

  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    temperature: 0.8,
    max_tokens: 500,
  })

  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;