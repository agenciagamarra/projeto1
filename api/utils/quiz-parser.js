export function parseTxtQuiz(content) {
  const questions = [];
  const blocks = content.split('\n\n').filter(block => block.trim());

  for (const block of blocks) {
    const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
    const questionData = {
      options: [],
      correctOption: -1,
    };

    for (const line of lines) {
      if (line.startsWith('P:')) {
        questionData.text = line.substring(2).trim();
      } else if (line.startsWith('IMG:')) {
        const [url, dimensions] = line.substring(4).trim().split('|');
        questionData.image = { url };
        if (dimensions) {
          const [width, height] = dimensions.split('x').map(Number);
          if (!isNaN(width)) questionData.image.width = width;
          if (!isNaN(height)) questionData.image.height = height;
        }
      } else if (/^[a-d]:/.test(line)) {
        const option = line.substring(2).trim();
        const optionIndex = line[0].charCodeAt(0) - 'a'.charCodeAt(0);
        
        if (option.endsWith('*')) {
          questionData.correctOption = optionIndex;
          questionData.options.push(option.slice(0, -1).trim());
        } else {
          questionData.options.push(option);
        }
      }
    }

    if (
      questionData.text &&
      questionData.options.length === 4 &&
      questionData.correctOption !== -1
    ) {
      questions.push(questionData);
    }
  }

  if (questions.length === 0) {
    throw new Error('Nenhuma questão válida encontrada no arquivo');
  }

  return questions;
}

export function validateQuizImport(quiz) {
  if (!quiz.title || typeof quiz.title !== 'string') {
    throw new Error('Título do quiz é obrigatório');
  }

  if (!quiz.subject || typeof quiz.subject !== 'string') {
    throw new Error('Matéria do quiz é obrigatória');
  }

  if (!quiz.timeLimit || typeof quiz.timeLimit !== 'number' || quiz.timeLimit < 1) {
    throw new Error('Tempo limite deve ser um número maior que 0');
  }

  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    throw new Error('Quiz deve ter pelo menos uma questão');
  }

  quiz.questions.forEach((question, index) => {
    if (!question.text) {
      throw new Error(`Questão ${index + 1}: texto é obrigatório`);
    }

    if (!Array.isArray(question.options) || question.options.length !== 4) {
      throw new Error(`Questão ${index + 1}: deve ter exatamente 4 opções`);
    }

    if (
      typeof question.correctOption !== 'number' ||
      question.correctOption < 0 ||
      question.correctOption > 3
    ) {
      throw new Error(`Questão ${index + 1}: opção correta inválida`);
    }

    if (question.image) {
      if (!question.image.url) {
        throw new Error(`Questão ${index + 1}: URL da imagem é obrigatória`);
      }

      try {
        new URL(question.image.url);
      } catch {
        throw new Error(`Questão ${index + 1}: URL da imagem inválida`);
      }
    }
  });

  return true;
}