# TheSomethingSomethingCompany
The purpose of our system is to provide professionals a platform to connect, communicate and share media. This includes text messages, documents, images & videos. Our system prioritizes the security of the data and privacy of the user. Optionally, our app also provides users with the option to blur the contents of uploaded videos to hide the identities of people in those videos to protect their privacy.

## Tech Stack
The following tech stack was chosen due to our need for adaptability, optimization, SEO optimization and security:
### Front-End Technologies
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
### Back-End Technologies
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
### Version Control
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
### Database & Database Management Systems
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
### Hosting
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) 
### Package Managers
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)

# Pre-Requisites
Before you can install our app, you must have the following pre-requisites:

| Services       | Version  |
|----------------|----------|
| Node.js        | > 21.6.2 |
| NPM            | > 10.5.0 |
| Docker Desktop | > 4.28.0 |
| aws-cli        | > 2.0.0  |
| Python         | > 3.11   |
| Git            | > 2.39.3 |

# Installation
The **recommend** way to install our system is to use the steps below:

1. Clone the Repository 

```bash
git clone https://github.com/COSC-499-W2023/year-long-project-team-10.git
```

2. Navigate into `year-long-project-team-10/app/`. Install system dependencies:

```bash
npm install
```
3. Open Docker. Start the docker containers using a terminal of your choosing:

```bash
docker-compose up [-d]
```

4. The system will be live @ `localhost:3000`

5. Lets Setup Supabase. Go to https://supabase.com/ and create an account. Then create a new Oranization and then under that organization Create a new project. Give this project a name and password. Remember this password as it will be important in the future. Once the project has been setup, go to SQL Editor in the left menu. Here copy and paste the database schema found under DDL in out project Root direcory. This will initialize the database. Next, create a file called .env.local in the Root of the project. Here create 5 variables called PASS_HASH, HOST, PORT, DATABASE, USER and DBPASSWORD. Initialize PASS_HASH to a strong key. This will be used to encrypt your passwords. Going back to Supabase, go to Project Settings in the left menu and select Database. Here initialize the values of the aforementioned vairables to the values of the same name on the right. Finally, create an .env file in the root of the website. Here create a variable named DATABASE_URL and set its value to the connection string found in the same page as above replacing the missing value in the string as needed. The database has now been setup and conencted!

# Direct AWS hosted website access
http://499-new-lb-420614602.ca-central-1.elb.amazonaws.com/
