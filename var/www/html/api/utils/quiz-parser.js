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