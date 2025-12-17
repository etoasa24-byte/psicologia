/*
  # Psychology App Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `mood` (text) - Current mood status
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `psychology_questions`
      - `id` (uuid, primary key)
      - `category` (text) - Category like 'anxiety', 'depression', 'stress', 'self-esteem'
      - `question` (text) - The question text
      - `type` (text) - Type of question: 'scale', 'yes_no', 'multiple_choice'
      - `options` (jsonb) - Options for multiple choice questions
      - `order_num` (integer) - Display order
      - `created_at` (timestamptz)
    
    - `user_answers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `question_id` (uuid, references psychology_questions)
      - `answer` (text)
      - `score` (integer) - Numerical score if applicable
      - `created_at` (timestamptz)
    
    - `recommendations`
      - `id` (uuid, primary key)
      - `category` (text) - Related to question categories
      - `title` (text)
      - `description` (text)
      - `content` (text) - Detailed recommendation
      - `icon` (text) - Icon name for display
      - `created_at` (timestamptz)
    
    - `psychology_games`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text) - Type of game: 'breathing', 'meditation', 'cognitive', 'mindfulness'
      - `instructions` (text)
      - `difficulty` (text) - 'easy', 'medium', 'hard'
      - `created_at` (timestamptz)
    
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `game_id` (uuid, references psychology_games)
      - `completed` (boolean)
      - `score` (integer)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Public read access for questions, recommendations, and games

  3. Sample Data
    - Insert sample psychology questions
    - Insert recommendations
    - Insert psychology games
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  mood text DEFAULT 'neutral',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create psychology_questions table
CREATE TABLE IF NOT EXISTS psychology_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  question text NOT NULL,
  type text NOT NULL DEFAULT 'scale',
  options jsonb,
  order_num integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE psychology_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view questions"
  ON psychology_questions FOR SELECT
  TO authenticated
  USING (true);

-- Create user_answers table
CREATE TABLE IF NOT EXISTS user_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  question_id uuid REFERENCES psychology_questions(id) ON DELETE CASCADE NOT NULL,
  answer text NOT NULL,
  score integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own answers"
  ON user_answers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answers"
  ON user_answers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own answers"
  ON user_answers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  icon text DEFAULT 'heart',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view recommendations"
  ON recommendations FOR SELECT
  TO authenticated
  USING (true);

-- Create psychology_games table
CREATE TABLE IF NOT EXISTS psychology_games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  instructions text NOT NULL,
  difficulty text DEFAULT 'medium',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE psychology_games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view games"
  ON psychology_games FOR SELECT
  TO authenticated
  USING (true);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_id uuid REFERENCES psychology_games(id) ON DELETE CASCADE NOT NULL,
  completed boolean DEFAULT false,
  score integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert sample psychology questions
INSERT INTO psychology_questions (category, question, type, options, order_num) VALUES
  ('ansiedad', '¿Con qué frecuencia te sientes nervioso o ansioso?', 'scale', '{"min": 1, "max": 5, "labels": ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"]}', 1),
  ('ansiedad', '¿Te resulta difícil relajarte?', 'scale', '{"min": 1, "max": 5, "labels": ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"]}', 2),
  ('ansiedad', '¿Experimentas palpitaciones o ritmo cardíaco acelerado?', 'scale', '{"min": 1, "max": 5, "labels": ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"]}', 3),
  ('estres', '¿Te sientes abrumado por tus responsabilidades?', 'scale', '{"min": 1, "max": 5, "labels": ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"]}', 4),
  ('estres', '¿Tienes dificultad para concentrarte?', 'scale', '{"min": 1, "max": 5, "labels": ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"]}', 5),
  ('autoestima', '¿Te sientes bien contigo mismo?', 'scale', '{"min": 1, "max": 5, "labels": ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"]}', 6),
  ('autoestima', '¿Confías en tus habilidades?', 'scale', '{"min": 1, "max": 5, "labels": ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"]}', 7),
  ('bienestar', '¿Duermes lo suficiente y con buena calidad?', 'scale', '{"min": 1, "max": 5, "labels": ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"]}', 8),
  ('bienestar', '¿Te sientes satisfecho con tu vida social?', 'scale', '{"min": 1, "max": 5, "labels": ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"]}', 9),
  ('bienestar', '¿Realizas actividades que disfrutas regularmente?', 'scale', '{"min": 1, "max": 5, "labels": ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"]}', 10);

-- Insert recommendations
INSERT INTO recommendations (category, title, description, content, icon) VALUES
  ('ansiedad', 'Técnica de Respiración 4-7-8', 'Calma la ansiedad en minutos', 'Inhala por la nariz durante 4 segundos, mantén la respiración por 7 segundos, exhala por la boca durante 8 segundos. Repite 4 veces. Esta técnica activa el sistema nervioso parasimpático, promoviendo la relajación.', 'wind'),
  ('ansiedad', 'Practica el Grounding', 'Conéctate con el presente', 'Técnica 5-4-3-2-1: Identifica 5 cosas que puedes ver, 4 que puedes tocar, 3 que puedes oír, 2 que puedes oler, y 1 que puedes saborear. Te ayuda a volver al momento presente.', 'anchor'),
  ('estres', 'Establece Límites', 'Aprende a decir no', 'Es importante reconocer tus límites. No tienes que hacer todo. Prioriza las tareas importantes y delega cuando sea posible. Tu salud mental es primero.', 'shield'),
  ('estres', 'Toma Descansos Regulares', 'La productividad requiere pausas', 'Usa la técnica Pomodoro: trabaja 25 minutos, descansa 5. Cada 4 ciclos, toma un descanso más largo de 15-30 minutos. Tu cerebro necesita estos descansos para funcionar óptimamente.', 'coffee'),
  ('autoestima', 'Diario de Gratitud', 'Enfócate en lo positivo', 'Cada noche, escribe 3 cosas por las que estés agradecido y 3 logros del día, por pequeños que sean. Esto entrena tu cerebro para reconocer lo positivo.', 'book-heart'),
  ('autoestima', 'Desafía Pensamientos Negativos', 'Cuestiona tu crítico interno', 'Cuando tengas un pensamiento negativo sobre ti mismo, pregúntate: ¿Es realmente cierto? ¿Hay evidencia de lo contrario? ¿Qué le dirías a un amigo en esta situación?', 'message-circle'),
  ('bienestar', 'Rutina de Sueño', 'El descanso es fundamental', 'Establece una hora fija para dormir y despertar. Evita pantallas 1 hora antes de dormir. Crea un ambiente oscuro, fresco y silencioso. El sueño de calidad mejora todo.', 'moon'),
  ('bienestar', 'Ejercicio Regular', 'Mueve tu cuerpo', 'Al menos 30 minutos de actividad física moderada 5 días a la semana. No tiene que ser intenso: caminar, bailar, yoga. El ejercicio libera endorfinas naturales.', 'heart-pulse'),
  ('bienestar', 'Conexión Social', 'Las relaciones importan', 'Dedica tiempo de calidad con personas que te hacen sentir bien. Una llamada, un café, una conversación profunda. Las conexiones genuinas son esenciales para el bienestar.', 'users'),
  ('mindfulness', 'Meditación Diaria', 'Empieza con 5 minutos', 'Encuentra un lugar tranquilo, siéntate cómodamente, cierra los ojos y enfócate en tu respiración. Cuando tu mente divague, gentilmente regresa tu atención a la respiración.', 'brain');

-- Insert psychology games
INSERT INTO psychology_games (name, description, category, instructions, difficulty) VALUES
  ('Respiración Consciente', 'Ejercicio guiado de respiración para reducir ansiedad', 'breathing', 'Sigue el círculo visual: cuando crece, inhala lentamente. Cuando se contrae, exhala completamente. Repite durante 2-5 minutos para sentir los efectos calmantes.', 'easy'),
  ('Escaneo Corporal', 'Técnica de mindfulness para relajación profunda', 'meditation', 'Acuéstate cómodamente. Concéntrate en cada parte de tu cuerpo comenzando por los pies. Nota cualquier tensión y conscientemente relájala mientras avanzas hacia la cabeza.', 'medium'),
  ('Desafío Cognitivo', 'Identifica y transforma pensamientos negativos', 'cognitive', 'Lee el pensamiento negativo presentado. Identifica las distorsiones cognitivas presentes (catastrofización, pensamiento todo-o-nada, etc.). Luego reformúlalo de manera más equilibrada y realista.', 'medium'),
  ('Gratitud Diaria', 'Entrena tu mente para ver lo positivo', 'mindfulness', 'Lista 3 cosas por las que estés agradecido hoy. Pueden ser grandes o pequeñas. Intenta ser específico y nota cómo te hace sentir este ejercicio.', 'easy'),
  ('Visualización Guiada', 'Crea un espacio mental de calma', 'meditation', 'Imagina un lugar donde te sientas completamente seguro y relajado. Puede ser real o imaginario. Visualiza todos los detalles: colores, sonidos, olores, sensaciones. Visita este lugar mental cuando necesites paz.', 'medium'),
  ('Reestructuración Cognitiva', 'Aprende a pensar de manera más flexible', 'cognitive', 'Toma una situación estresante reciente. Identifica tus pensamientos automáticos. Busca evidencia a favor y en contra. Genera pensamientos alternativos más balanceados.', 'hard'),
  ('Atención Plena en Actividades', 'Practica mindfulness en tareas cotidianas', 'mindfulness', 'Elige una actividad rutinaria (comer, caminar, lavar platos). Hazla con total atención: nota cada sensación, movimiento, pensamiento. Sin juicio, solo observación.', 'easy'),
  ('Relajación Muscular Progresiva', 'Reduce tensión física y mental', 'breathing', 'Tensa cada grupo muscular durante 5 segundos, luego relaja durante 10 segundos. Comienza con los pies y avanza hacia arriba. Nota la diferencia entre tensión y relajación.', 'medium');
