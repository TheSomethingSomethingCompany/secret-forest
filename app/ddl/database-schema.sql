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
  "id" SERIAL PRIMARY KEY,
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

/* SAMPLE DATA */

INSERT INTO member ("memberID" , email, username, password) 
VALUES ('071a7c3d-f38b-4be6-a39e-03b18985ca95', 'satanshumishra@outlook.com', 'SatanshuMishra', '4c462c1f8e97385b1a74aec6066339c7ea96828fa7fe5c0a2d828c9b60eb8b05');

INSERT into profile ("memberID", name, country, address, bio, "pfpPath") values ('071a7c3d-f38b-4be6-a39e-03b18985ca95', 'Satanshu Mishra', 'Canada', 'Somthing St.', 'I am the Satanshu ;)!', '17.svg');

insert into tag ("tagID", "tagName") values (1, 'Engineer');

insert into user_tag ("memberID", "tagID") values ('071a7c3d-f38b-4be6-a39e-03b18985ca95', 1);

INSERT INTO member ("memberID" , email, username, password) 
VALUES ('26b786ac-0489-4504-bd49-d8cf150c0548', 'katewilson@email.com', 'KateWilson', '4c462c1f8e97385b1a74aec6066339c7ea96828fa7fe5c0a2d828c9b60eb8b05');

INSERT into profile ("memberID", name, country, address, bio, "pfpPath") values ('26b786ac-0489-4504-bd49-d8cf150c0548', 'Kate Wilson', 'Canada', 'Another Somthing St.', 'Weee', '16.svg');

insert into user_tag ("memberID", "tagID") values ('26b786ac-0489-4504-bd49-d8cf150c0548', 1);

insert into chat ("chatID", "memberID1", "memberID2") values (1, '071a7c3d-f38b-4be6-a39e-03b18985ca95', '26b786ac-0489-4504-bd49-d8cf150c0548');

insert into message ("messageID", "chatID", "senderID", message) values (1, 1, '071a7c3d-f38b-4be6-a39e-03b18985ca95', 'Hey Kate! How is it going?');
insert into message ("messageID", "chatID", "senderID", message) values (2, 1, '26b786ac-0489-4504-bd49-d8cf150c0548', 'Hey!!! Its going greaT! Hbu?');


