export class QuizService {
  constructor(pool) {
    this.pool = pool;
  }

  async getAllQuizzes() {
    const [rows] = await this.pool.execute(`
      SELECT q.*, COUNT(qu.id) as question_count
      FROM quizzes q
      LEFT JOIN questions qu ON q.id = qu.quiz_id
      GROUP BY q.id
      ORDER BY q.created_at DESC
    `);
    return rows;
  }

  async searchQuizzes(searchTerm) {
    const [rows] = await this.pool.execute(`
      SELECT DISTINCT q.*
      FROM quizzes q
      LEFT JOIN questions qu ON q.id = qu.quiz_id
      LEFT JOIN question_options qo ON qu.id = qo.question_id
      WHERE 
        q.title LIKE ? OR
        q.subject LIKE ? OR
        qu.text LIKE ? OR
        qo.option_text LIKE ?
    `, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]);
    return rows;
  }

  async getQuizById(id) {
    const [quiz] = await this.pool.execute(
      'SELECT * FROM quizzes WHERE id = ?',
      [id]
    );

    if (!quiz[0]) return null;

    const [questions] = await this.pool.execute(`
      SELECT q.*, GROUP_CONCAT(qo.option_text ORDER BY qo.option_index) as options
      FROM questions q
      LEFT JOIN question_options qo ON q.id = qo.question_id
      WHERE q.quiz_id = ?
      GROUP BY q.id
      ORDER BY q.id
    `, [id]);

    return {
      ...quiz[0],
      questions: questions.map(q => ({
        ...q,
        options: q.options?.split(',') || [],
        image: q.image_url ? {
          url: q.image_url,
          width: q.image_width,
          height: q.image_height
        } : undefined
      }))
    };
  }

  async createQuiz(quizData) {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      const [quizResult] = await connection.execute(
        `INSERT INTO quizzes (title, subject, time_limit)
         VALUES (?, ?, ?)`,
        [quizData.title, quizData.subject, quizData.timeLimit]
      );
      
      const quizId = quizResult.insertId;

      for (const question of quizData.questions) {
        const [questionResult] = await connection.execute(
          `INSERT INTO questions (quiz_id, text, image_url, image_width, image_height)
           VALUES (?, ?, ?, ?, ?)`,
          [
            quizId,
            question.text,
            question.image?.url,
            question.image?.width,
            question.image?.height
          ]
        );

        const questionId = questionResult.insertId;

        for (let i = 0; i < question.options.length; i++) {
          await connection.execute(
            `INSERT INTO question_options (question_id, option_text, option_index)
             VALUES (?, ?, ?)`,
            [questionId, question.options[i], i]
          );
        }
      }

      await connection.commit();
      return quizId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}