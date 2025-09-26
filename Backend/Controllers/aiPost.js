const Groq = require('groq-sdk');
require('dotenv').config();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Enhance user's post text
module.exports.enhancePost = async (req, res) => {
  try {
    const { text } = req.body;
    // console.log("Received text for enhancement:", text);
    if (!text) return res.status(400).json({ success: false, msg: "No text provided" });
 
    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "You are a professional social media assistant. Improve clarity, grammar, and engagement of posts without changing meaning and include 6-7 hashtags`." },
        { role: "user", content: text },
      ],
    });
    // console.log(completion);
    const enhancedText = completion.choices[0].message.content.trim();
    res.json({ success: true, enhancedText });
  } catch (error) {
    console.error("AI Enhance Error:", error.message);
    res.status(500).json({ success: false, msg: "AI service failed" });
  }
};

// Generate new post draft
module.exports.generatePost = async (req, res) => {
  try {
    // console.log(req.body)
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, msg: "Prompt required" });

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "You are a LinkedIn-style assistant. Write short, engaging, professional posts (2-4 sentences) for career and tech growth." },
        { role: "user", content: `Generate a post about: ${prompt} and include 6-7 hashtags` },
      ],
    });

    const generatedText = completion.choices[0].message.content.trim();
    res.json({ success: true, generatedText });
  } catch (error) {
    console.error("AI Generate Error:", error.message);
    res.status(500).json({ success: false, msg: "AI service failed" });
  }
};


exports.enhanceAbout = async (req, res) => {
  try {
    const { text } = req.body;
    console.log("Received text for enhancement:", req.body);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, msg: "Text is required" });
    }

    // Ask AI to improve the about section
    const prompt = `
      Enhance and polish the following "About" section for a LinkedIn-style profile.
      Make it professional, clear, and engaging, but keep the meaning intact.
      Text: "${text}"
    `;

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 300,
    });

    const enhancedText =
      response.choices[0]?.message?.content?.trim() || text;

    res.json({ success: true, enhancedText });
  } catch (error) {
    console.error("AI enhance error:", error);
    res.status(500).json({ success: false, msg: "AI enhancement failed" });
  }
};