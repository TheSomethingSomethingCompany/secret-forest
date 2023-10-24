CREATE TABLE member (
  "memberID" uuid PRIMARY KEY
  "email" text UNIQUE,
  "name" text NOT NULL,
  "password" text NOT NULL,
  "isOrganization" bool DEFAULT false
);

CREATE TABLE profile (
    "memberID" uuid PRIMARY KEY,
    "name" text NOT NULL,
    "country" text NOT NULL,
    "address" text NOT NULL,
    "occupationTags" text[],
    "bio" text,
    FOREIGN KEY ("memberID") REFERENCES member("memberID")
        ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE "security_question" (
  "id" uuid PRIMARY KEY,
  "memberEmail" text NOT NULL,
  "question" text NOT NULL,
  "answer" text NOT NULL
);

ALTER TABLE "security_question" ADD FOREIGN KEY ("memberEmail") REFERENCES "member" ("email");