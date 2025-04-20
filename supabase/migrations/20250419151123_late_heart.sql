/*
  # Initial schema for study planner

  1. New Tables
    - `class_sessions`: Stores class schedule information
    - `assignments`: Stores assignment details
    - `events`: Stores exam and CAT schedules

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since we're not implementing auth)
*/

-- Class Sessions Table
CREATE TABLE IF NOT EXISTS class_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course text NOT NULL,
  day text NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  location text NOT NULL,
  instructor text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  course text NOT NULL,
  due_date timestamptz NOT NULL,
  priority text NOT NULL,
  status text NOT NULL DEFAULT 'not-started',
  created_at timestamptz DEFAULT now()
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date timestamptz NOT NULL,
  type text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Public access" ON class_sessions FOR ALL USING (true);
CREATE POLICY "Public access" ON assignments FOR ALL USING (true);
CREATE POLICY "Public access" ON events FOR ALL USING (true);