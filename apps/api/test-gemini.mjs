import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import 'dotenv/config';

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          whyMatch: { type: SchemaType.STRING, description: "A brief, compelling paragraph on why this company is a great match." },
          buyingSignals: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                icon: { type: SchemaType.STRING, description: "Material Symbols icon name, e.g., trending_up" },
                title: { type: SchemaType.STRING, description: "Short title for the signal" },
                description: { type: SchemaType.STRING, description: "Detailed description of the buying signal" }
              }
            }
          },
          outreachStrategy: { type: SchemaType.STRING, description: "Customized outreach strategy paragraph." },
          criticalPainPoints: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Array of 2-3 critical pain points."
          },
          companyMaturity: { type: SchemaType.STRING, description: "Estimated company maturity." },
          digitalWeaknesses: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Array of 1-3 digital weaknesses."
          },
          growthScore: { type: SchemaType.INTEGER, description: "Growth score between 1-100." },
          aiReadiness: { type: SchemaType.STRING, description: "Assessment of AI readiness." },
          likelihoodToNeedServices: { type: SchemaType.STRING, description: "Assessment of likelihood to need services." },
          suggestedSalesAngle: { type: SchemaType.STRING, description: "Suggested sales angle." },
          recommendedOutreach: { type: SchemaType.STRING, description: "Recommended outreach message or next step." }
        },
        required: ["whyMatch", "buyingSignals", "outreachStrategy", "companyMaturity", "digitalWeaknesses", "growthScore", "aiReadiness", "likelihoodToNeedServices", "suggestedSalesAngle", "recommendedOutreach"]
      }
    }
  });

  const prompt = "Generate insights for a company named ACME Corp in the tech industry.";
  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (e) {
    console.error(e);
  }
}
test();
