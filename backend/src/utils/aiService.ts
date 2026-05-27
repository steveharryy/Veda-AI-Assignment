import { IAssignment } from '../types';
import { generateMockQuestionPaper } from './mockGenerator';

export const generateAIPaper = async (assignment: IAssignment): Promise<any> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
    return generateMockQuestionPaper(assignment);
  }

  const prompt = `You are a professional educational assessment designer.
Generate a high-quality academic question paper based on the following criteria:
- Assignment Title: "${assignment.title}"
- Teacher's Instructions: "${assignment.instructions || 'Attempt all questions.'}"
- Section Blueprints: ${JSON.stringify(assignment.questionTypes)}

Return the output in EXACT JSON format matching this schema:
{
  "title": "string (e.g. 'Chemistry Midterm Exam')",
  "schoolName": "string (e.g. 'Apex Academy' or appropriate local school name)",
  "subject": "string (e.g. 'Physics', 'Mathematics', 'Computer Science' etc., appropriate to the title)",
  "gradeClass": "string (e.g. 'Class IX' or 'Grade 10')",
  "timeAllowed": "string (e.g. '2 Hours' or '3 Hours' based on total length/difficulty)",
  "maxMarks": "string (the total marks computed from the sections)",
  "sections": [
    {
      "title": "string (e.g. 'Section A')",
      "instruction": "string (e.g. 'Answer all multiple choice questions. Each question carries 1 mark.')",
      "questions": [
        {
          "question": "string (the full text of the question)",
          "difficulty": "Easy" | "Moderate" | "Hard",
          "marks": number (marks for this specific question, matching the blueprint)
        }
      ]
    }
  ],
  "answerKey": [
    "string (e.g. '[Question 1] Model Answer:\\nStep-by-step detailed solution...')"
  ]
}

CRITICAL CONSTRAINTS:
1. You MUST generate exactly the number of questions in each section as specified in the blueprint "questionCount".
2. The marks for each question in a section MUST match the blueprint "marks" for that section.
3. The content must be highly realistic, academically rigorous, and direct (no meta-commentary, no markdown blocks, just pure JSON).
4. Return ONLY valid JSON that can be parsed directly. Do not wrap the JSON in \`\`\`json markdown blocks.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API returned status ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as any;
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('No content returned from Gemini API.');
    }

    const cleanJson = JSON.parse(rawText.trim());
    
    if (!cleanJson.title || !Array.isArray(cleanJson.sections) || !Array.isArray(cleanJson.answerKey)) {
      throw new Error('Gemini API response is missing required question paper fields.');
    }

    return cleanJson;

  } catch (error: any) {
    console.error('💥 [AI Service] Gemini API Error:', error.message || error);
    return generateMockQuestionPaper(assignment);
  }
};
