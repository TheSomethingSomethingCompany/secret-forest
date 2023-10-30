CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE member (
  "memberID" UUID PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE,
  "username" text NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "isOrg" BOOLEAN DEFAULT FALSE
);



CREATE TABLE profile (
    "memberID" UUID PRIMARY KEY,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "bio" TEXT,
    FOREIGN KEY ("memberID") REFERENCES member("memberID")
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE security_question (
  "securityQuestionID" uuid PRIMARY KEY,
  "memberID" UUID NOT NULL,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  FOREIGN KEY ("memberID") REFERENCES member("memberID")
  	ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tag(
  "tagID" SERIAL PRIMARY KEY,
  "tagName" TEXT NOT NULL
);

CREATE TABLE user_tag(
  "memberID" UUID,
  "tagID" INT,
  PRIMARY KEY ("tagID", "memberID"),
  FOREIGN KEY ("memberID") REFERENCES member("memberID")
  	ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("tagID") REFERENCES tag("tagID")
  	ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE profile_picture (
    "memberID" uuid primary key,
    image bytea,
    foreign key ("memberID") references member("memberID")
    	on delete cascade on update cascade
);



CREATE VIEW
  usign AS
SELECT
  username,
  email,
  password
FROM
  member;