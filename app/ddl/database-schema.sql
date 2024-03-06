CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE member (
  "memberID" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "email" TEXT UNIQUE NOT NULL,
  "username" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL
);


CREATE TABLE profile (
    "memberID" UUID PRIMARY KEY,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "bio" TEXT,
    "pfpPath" TEXT, 
    FOREIGN KEY ("memberID") REFERENCES member("memberID")
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE security_question (
  "id" UUID PRIMARY KEY,
  "memberID" UUID NOT NULL,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  FOREIGN KEY ("memberID") REFERENCES member("memberID")
  	ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tag(
  "tagID" SERIAL PRIMARY KEY,
  "tagName" TEXT NOT NULL UNIQUE
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


CREATE TABLE chat(
  "chatID" SERIAL PRIMARY KEY,
  "memberID1" uuid NOT NULL,
  "memberID2" uuid NOT NULL,
  FOREIGN KEY ("memberID1") REFERENCES member("memberID")
    ON DELETE CASCADE ON UPDATE CASCADE,    
  FOREIGN KEY ("memberID2") REFERENCES member("memberID")
  	ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE request(
  "requestID" SERIAL PRIMARY KEY,
  "fromMemberID" uuid NOT NULL,
  "toMemberID" uuid NOT NULL,
  FOREIGN KEY ("fromMemberID") REFERENCES member("memberID")
    ON DELETE CASCADE ON UPDATE CASCADE,    
  FOREIGN KEY ("toMemberID") REFERENCES member("memberID")
  	ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE message(
  "messageID" SERIAL PRIMARY KEY,
  "chatID" int NOT NULL,
  "senderID" uuid NOT NULL,
  "message" TEXT NOT NULL,
  FOREIGN KEY ("chatID") REFERENCES chat("chatID")
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("senderID") REFERENCES member("memberID")
    ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE file(
  "fileID" SERIAL PRIMARY KEY,
  "messageID" int NOT NULL,
  "fileName" TEXT NOT NULL,
  FOREIGN KEY ("messageID") REFERENCES message("messageID")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE blocked_user(
  "blockID" SERIAL PRIMARY KEY,
  "blockerMemberID" uuid NOT NULL,
  "blockedMemberID" uuid NOT NULL,
  FOREIGN KEY ("blockerMemberID") REFERENCES member("memberID")
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("blockedMemberID") REFERENCES member("memberID")
    ON DELETE CASCADE ON UPDATE CASCADE 
);

