CREATE TABLE member (
  "email" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "password" text NOT NULL,
  "isOrganization" bool DEFAULT false
);

CREATE TABLE "security_question" (
  "id" uuid PRIMARY KEY,
  "memberEmail" text NOT NULL,
  "question" text NOT NULL,
  "answer" text NOT NULL
);

ALTER TABLE "security_question" ADD FOREIGN KEY ("memberEmail") REFERENCES "member" ("email");