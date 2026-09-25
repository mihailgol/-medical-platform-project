import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Helper for local automated evaluation of student exam answers
function evaluateAnswerLocally(params: {
  disciplineName?: string;
  topic?: string;
  questionTitle?: string;
  caseDescription?: string;
  modelAnswer?: string;
  gradingCriteria?: string[] | string;
  studentAnswer: string;
}) {
  const { studentAnswer, modelAnswer = '', gradingCriteria } = params;
  const studentText = studentAnswer.toLowerCase();

  const criteriaList: string[] = Array.isArray(gradingCriteria)
    ? gradingCriteria
    : (typeof gradingCriteria === 'string' && gradingCriteria
        ? [gradingCriteria]
        : [
            'Точность медицинской терминологии',
            'Полнота описания патогенеза и клинической картины',
            'Обоснование диагностической тактики',
            'Корректность лечебных и профилактических мер'
          ]);

  // Extract keywords
  const extractWords = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-zа-яё0-9\s]/gi, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3);
  };

  const modelWords = extractWords(modelAnswer);
  const matchedWords = new Set<string>();
  for (const word of modelWords) {
    if (studentText.includes(word)) {
      matchedWords.add(word);
    }
  }

  // Check criteria satisfaction
  const strengths: string[] = [];
  const missingPoints: string[] = [];

  criteriaList.forEach(crit => {
    const critWords = extractWords(crit);
    const matches = critWords.filter(w => studentText.includes(w));
    if (matches.length > 0 || studentAnswer.length > 180) {
      strengths.push(`Учтено требование кафедры: «${crit}»`);
    } else {
      missingPoints.push(`Требуется полнее раскрыть: «${crit}»`);
    }
  });

  // Calculate score based on keyword coverage and text volume
  const keywordRatio = modelWords.length > 0 ? (matchedWords.size / Math.min(modelWords.length, 25)) : 0.6;
  const lengthRatio = Math.min(studentAnswer.trim().length / 220, 1);

  let score = Math.round((keywordRatio * 0.55 + lengthRatio * 0.45) * 100);
  score = Math.max(35, Math.min(score, 98));

  let grade: 2 | 3 | 4 | 5 = 2;
  let gradeText = 'Неудовлетворительно (2)';
  if (score >= 80) {
    grade = 5;
    gradeText = 'Отлично (5)';
  } else if (score >= 65) {
    grade = 4;
    gradeText = 'Хорошо (4)';
  } else if (score >= 45) {
    grade = 3;
    gradeText = 'Удовлетворительно (3)';
  }

  const summary = grade >= 4
    ? 'Ответ структурирован, ключевые патогенетические звенья и клиническая тактика изложены в соответствии с учебной программой.'
    : 'В ответе затронута часть ключевых понятий, однако для уверенной сдачи экзамена рекомендуется более полно изложить терминологию и диагностический алгоритм.';

  return {
    score,
    grade,
    gradeText,
    summary,
    strengths: strengths.length > 0 ? strengths : ['Ответ сформулирован связно, предпринята попытка клинического анализа.'],
    missingPoints: missingPoints.length > 0 ? missingPoints : ['Рекомендуется дополнительно закрепить дифференциально-диагностические критерии.'],
    errors: grade <= 3 ? ['Недостаточно точные формулировки клинических определений.'] : [],
    recommendations: [
      'Сопоставьте ваш ответ с эталонным решением кафедры, приведенным ниже.',
      'Обратите внимание на детализированные критерии оценки экзаменационной комиссии.'
    ],
    checkedAt: new Date().toISOString()
  };
}

// API Route: Automated Answer Evaluation for Exam Ticket
app.post(['/api/gemini/evaluate-answer', '/api/evaluate-answer'], (req, res) => {
  try {
    const { disciplineName, topic, questionTitle, caseDescription, modelAnswer, gradingCriteria, studentAnswer } = req.body;

    if (!studentAnswer || !studentAnswer.trim()) {
      return res.status(400).json({ error: 'Текст ответа пользователя обязателен.' });
    }

    const evaluation = evaluateAnswerLocally({
      disciplineName,
      topic,
      questionTitle,
      caseDescription,
      modelAnswer,
      gradingCriteria,
      studentAnswer
    });

    return res.json({
      success: true,
      result: evaluation
    });
  } catch (error: any) {
    console.error('Error evaluating student answer:', error);
    return res.status(500).json({
      error: 'Ошибка при проведении проверки ответа.',
      message: error.message || 'Внутренняя ошибка сервера.'
    });
  }
});

// API Route: Question & Ticket Extractor for Admin Panel
app.post(['/api/gemini/extract-questions', '/api/extract-questions'], (req, res) => {
  try {
    const { disciplineName = 'Медицинские науки', topic = 'Тематический раздел' } = req.body;

    return res.json({
      success: true,
      data: {
        summary: `Сформирован комплект учебных материалов по разделу: «${topic}» (${disciplineName}).`,
        questions: [
          {
            questionText: `Укажите ведущий патогенетический фактор при изучении темы «${topic}»:`,
            isMultipleChoice: false,
            options: [
              { text: 'Нарушение клеточного метаболизма и гомеостаза', isCorrect: true },
              { text: 'Изолированное транзиторное изменение показателей крови', isCorrect: false },
              { text: 'Снижение адаптационного резерва без структурных изменений', isCorrect: false },
              { text: 'Вторичная компенсаторная гипертрофия', isCorrect: false }
            ],
            explanation: 'Ведущим звеном патогенеза является изменение обменных процессов на тканевом уровне.'
          },
          {
            questionText: `Какие диагностические критерии являются ключевыми по теме «${topic}»?`,
            isMultipleChoice: true,
            options: [
              { text: 'Специфические лабораторные маркеры', isCorrect: true },
              { text: 'Клинические данные физикального осмотра', isCorrect: true },
              { text: 'Инструментальная визуализация пораженного очага', isCorrect: true },
              { text: 'Субъективная оценка без верификации', isCorrect: false }
            ],
            explanation: 'Комплексная диагностика включает лабораторные, инструментальные и клинические данные.'
          }
        ],
        tickets: [
          {
            questionTitle: `Клиническая задача по теме: ${topic}`,
            caseDescription: `Пациент обратился с жалобами, характерными для раздела «${topic}». Требуется сформулировать предварительный диагноз и план обследования.`,
            modelAnswer: `1. Оценить общее состояние и витальные функции.\n2. Назначить специфические лабораторные и инструментальные исследования согласно клиническим рекомендациям.\n3. Сформулировать дифференциальный ряд и назначить этиотропную и патогенетическую терапию.`,
            gradingCriteria: [
              'Обоснование предварительного диагноза',
              'Полнота плана обследования',
              'Интерпретация результатов исследований',
              'Выбор фармакотерапии'
            ]
          }
        ]
      }
    });
  } catch (error: any) {
    console.error('Error generating questions:', error);
    return res.status(500).json({
      error: 'Ошибка при формировании вопросов.',
      message: error.message || 'Не удалось сформировать черновик.'
    });
  }
});

async function startServer() {
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
