-- db/schema.sql

-- 1. Tabla de cursos
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Tabla de inscripciones (enrollments)
CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 3. Tabla de calificaciones (grades)
CREATE TABLE IF NOT EXISTS grades (
  id SERIAL PRIMARY KEY,
  enrollment_id INTEGER NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  score NUMERIC(5,2) CHECK (score BETWEEN 0 AND 100),
  graded_at TIMESTAMP DEFAULT NOW()
);
