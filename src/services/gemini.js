const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getInsight = async (context) => {
  const { today, stats, challenges, activities, user } = context;

  const model = genAI.getGenerativeModel({ model: "gemma-3-1b-it" });

  const prompt = `
    As an environmental coach for the EcoTrack app, provide a personalized carbon footprint insight for ${user.name}.

    Here is the user's data:
    - Today's carbon output: ${today.total}g CO₂.
    - Weekly carbon breakdown: ${stats.map((s) => `${s._id}: ${s.total}g`).join(", ")}.
    - Active challenges: ${activities.map((a) => a.title).join(", ")}.
    - Available challenges: ${challenges.map((c) => c.title).join(", ")}.

    Based on this data, provide a short, encouraging, and actionable insight (2-3 sentences).
    - If their output is high, suggest a specific, relevant challenge they are not yet doing.
    - If their output is low, praise them and suggest a new challenge to maintain momentum.
    - Frame the advice in a positive and motivational tone.
    - End with a specific call to action related to one of the available challenges.
    `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return { insight: text.trim() };
};

module.exports = {
  getInsight,
};
