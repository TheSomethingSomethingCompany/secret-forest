CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE
  member (
    id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4 (),
    name text NOT NULL,
    username text NOT NULL UNIQUE,
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    isOrganization boolean DEFAULT false
  );

CREATE TABLE
  security_question (
    id uuid PRIMARY KEY,
    memberId uuid NOT NULL REFERENCES member (id),
    question text NOT NULL,
    answer text NOT NULL
  );

CREATE VIEW
  usign AS
SELECT
  username,
  email,
  password
FROM
  member;