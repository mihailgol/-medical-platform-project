import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to instantiate Gemini AI client securely on server
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment secrets.');
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


// API Route: AI Answer Evaluation for Exam Ticket
app.post('/api/gemini/evaluate-answer', async (req, res) => {
  try {
    const { disciplineName, topic, questionTitle, caseDescription, modelAnswer, gradingCriteria, studentAnswer } = req.body;

    if (!studentAnswer || !studentAnswer.trim()) {
      return res.status(400).json({ error: 'Текст ответа пользователя обязателен.' });
    }

    const ai = getGeminiClient();

    const prompt = `
Ты — строго квалифицированный профессор кафедры медицинского вуза.
Проверь экзаменационный ответ студента по билету.

Дисциплина: ${disciplineName || 'Медицина'}
Тема: ${topic || 'Экзаменационный билет'}
Вопрос билета: ${questionTitle}
Описание задачи/кейса: ${caseDescription}

Эталонный ответ кафедры:
${modelAnswer}

Критерии оценки:
${Array.isArray(gradingCriteria) ? gradingCriteria.join('\n- ') : (gradingCriteria || 'Точность формулировок, полнота, клиническое мышление.')}

Ответ студента:
"""
${studentAnswer}
"""

Проведи глубокий рецензионный анализ. Оцени ответ объективно, определи оценку от 2 до 5 и процент соответствия (0-100%).
Укажи сильные стороны, пропущенные аспекты, фактически ошибочные утверждения и дай рекомендации по доработке.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Ты проводишь объективную медицинскую экзаменационную проверку ответов студентов. Форматируй строго в JSON.',
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: 'Процент соответствия эталонному ответу от 0 до 100'
            },
            grade: {
              type: Type.INTEGER,
              description: 'Экзаменационная оценка: 2 (неуд), 3 (удовл), 4 (хорошо), 5 (отлично)'
            },
            gradeText: {
              type: Type.STRING,
              description: 'Словесное описание оценки, например "Отлично (5)" или "Неудовлетворительно (2)"'
            },
            summary: {
              type: Type.STRING,
              description: 'Краткий итоговый комментарий профессора (2-3 предложения)'
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Список верных тезисов и сильных сторон ответа'
            },
            missingPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Список упущенных важных фактов, терминов или патогенетических звеньев'
            },
            errors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Фактические ошибки или неточные термины в ответе'
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Конкретные советы, что перечитать перед сдачей экзамена'
            }
          },
          required: ['score', 'grade', 'gradeText', 'summary', 'strengths', 'missingPoints', 'errors', 'recommendations']
        }
      }
    });

    const jsonText = response.text || '{}';
    const parsedData = JSON.parse(jsonText);

    return res.json({
      success: true,
      result: {
        ...parsedData,
        checkedAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Error evaluating student answer:', error);
    return res.status(500).json({
      error: 'Ошибка при проведении AI-проверки.',
      message: error.message || 'Не удалось связаться с модулем AI.'
    });
  }
});

// API Route: AI Document & Text Parser / Question & Ticket Extractor for Admin Panel
app.post('/api/gemini/extract-questions', async (req, res) => {
  try {
    const { documentText, disciplineName, topic } = req.body;

    if (!documentText || !documentText.trim()) {
      return res.status(400).json({ error: 'Текст документа или лекции не предоставлен.' });
    }

    const ai = getGeminiClient();

    const prompt = `
Ты — эксперт по составлению учебных материалов и экзаменационных билетов.
Проанализируй предоставленный текст лекции/методички и сформируй черновик тестовых вопросов и экзаменационных билетов.

Дисциплина: ${disciplineName || 'Медицинские науки'}
Тема: ${topic || 'Тематический раздел'}

Текст учебного материала:
"""
${documentText.slice(0, 15000)}
"""

Сформируй:
1. Ровно 3 качественных тестовых вопроса (из них 2 вопроса с одним верным ответом и 1 с несколькими верными ответами). Для каждого вопроса укажи 4 варианта ответа, подметь правильные и дай пояснение.
2. Ровно 2 экзаменационных билета с вопросом, ситуационной задачей/кейсом, детальным эталонным ответом и 4 ключевыми критериями оценки.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Ты — AI методист медицинского вуза. Извлекай ключевые научные концепции и создавай структурированные тесты и билеты.',
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'Краткое резюме проанализированного документа (2 предложения)'
            },
            questions: {
              type: Type.ARRAY,
              description: 'Список сгенерированных тестовых вопросов',
              items: {
                type: Type.OBJECT,
                properties: {
                  questionText: { type: Type.STRING },
                  isMultipleChoice: { type: Type.BOOLEAN },
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING },
                        isCorrect: { type: Type.BOOLEAN }
                      },
                      required: ['text', 'isCorrect']
                    }
                  },
                  explanation: { type: Type.STRING }
                },
                required: ['questionText', 'isMultipleChoice', 'options', 'explanation']
              }
            },
            tickets: {
              type: Type.ARRAY,
              description: 'Список сгенерированных экзаменационных билетов',
              items: {
                type: Type.OBJECT,
                properties: {
                  questionTitle: { type: Type.STRING },
                  caseDescription: { type: Type.STRING },
                  modelAnswer: { type: Type.STRING },
                  gradingCriteria: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ['questionTitle', 'caseDescription', 'modelAnswer', 'gradingCriteria']
              }
            }
          },
          required: ['summary', 'questions', 'tickets']
        }
      }
    });

    const jsonText = response.text || '{}';
    const parsedData = JSON.parse(jsonText);

    return res.json({
      success: true,
      data: parsedData
    });

  } catch (error: any) {
    console.error('Error extracting questions from file text:', error);
    return res.status(500).json({
      error: 'Ошибка автоизвлечения вопросов из текста.',
      message: error.message || 'Не удалось сформировать черновик.'
    });
  }
});

async function startServer() {
  // Vite middleware for development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
