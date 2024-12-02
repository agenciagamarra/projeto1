-- Esquema do banco de dados MySQL

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  time_limit INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de questões
CREATE TABLE IF NOT EXISTS questions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  quiz_id BIGINT UNSIGNED NOT NULL,
  text TEXT NOT NULL,
  image_url VARCHAR(1024),
  image_width INT,
  image_height INT,
  subject VARCHAR(255) NOT NULL,
  correct_option TINYINT NOT NULL CHECK (correct_option >= 0 AND correct_option < 4),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de opções das questões
CREATE TABLE IF NOT EXISTS question_options (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  question_id BIGINT UNSIGNED NOT NULL,
  option_text TEXT NOT NULL,
  option_index TINYINT NOT NULL CHECK (option_index >= 0 AND option_index < 4),
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_question_option (question_id, option_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de tentativas de quiz
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  quiz_id BIGINT UNSIGNED NOT NULL,
  score INT NOT NULL,
  time_spent INT NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de respostas das tentativas
CREATE TABLE IF NOT EXISTS attempt_answers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  attempt_id BIGINT UNSIGNED NOT NULL,
  question_id BIGINT UNSIGNED NOT NULL,
  selected_option TINYINT NOT NULL CHECK (selected_option >= 0 AND selected_option < 4),
  FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Índices para melhorar performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_quizzes_subject ON quizzes(subject);
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_question_options_question_id ON question_options(question_id);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_attempt_answers_attempt_id ON attempt_answers(attempt_id);