#  TechPrep – Mock Interview Preparation Platform

TechPrep is a web-based interview preparation platform that helps students and job seekers practice real interview scenarios with personalized questions, video/text responses, and structured performance feedback.

Built using React, TypeScript, and Supabase, TechPrep simulates real interview environments and helps users improve confidence, communication, and technical readiness.



##  Project Overview

TechPrep allows users to:

- Create role-based mock interviews  
- Answer questions via video or text  
- Track performance with analytics and reports  
- Resume interview sessions  
- Get structured feedback to improve skills  

The platform focuses on accessibility, personalization, and real-time practice to make interview preparation effective and scalable.



##  Features

- Secure authentication using Supabase Auth  
- Personalized interview questions based on skills and experience  
- Video and text response recording  
- Performance analysis dashboard  
- Interview reports with score breakdown  
- Interview history and progress tracking  
- Responsive and user-friendly UI  
- Scalable backend with Supabase  



##  Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router DOM
- Recharts

### Backend
- Supabase (Backend-as-a-Service)
- PostgreSQL
- Supabase Auth
- Supabase Edge Functions
- Supabase Storage

##  Architecture
- React frontend handles UI and interview flow
- Supabase backend manages:
  - Authentication
  - PostgreSQL database
  - Storage (video responses)
  - Edge functions
##  How It Works

1. User signs up / logs in  
2. Creates interview profile (role, skills, experience)  
3. System generates interview questions  
4. User records responses (video/text)  
5. Responses stored in Supabase database  
6. Performance report generated  

##  Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- npm / pnpm / bun
- Supabase account

#### 1. Clone the repository

```bash
git clone https://github.com/Srujana-rao/TechPrep.git
cd TechPrep
```
#### 2. Install dependencies
```bash
npm install
```
#### 3. Configure environment variables
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
#### 4. Run development server
```bash
npm run dev
```
The app will run at:
```bash
http://localhost:5173
```

##  Screenshots
### Landing Page
<img width="1919" height="694" alt="Screenshot 2026-02-09 100916" src="https://github.com/user-attachments/assets/ff23f46a-5158-469a-8e24-57d224ddd9ba" />

### Dashboard
<img width="1919" height="919" alt="Screenshot 2026-02-09 101200" src="https://github.com/user-attachments/assets/f3fbb8e1-746f-4df6-a3a0-e337d5abb044" />

### Interview Session
<img width="1919" height="922" alt="Screenshot 2026-02-09 101355" src="https://github.com/user-attachments/assets/de418b2f-c340-408a-bfcf-f06ca79e9e7b" />
<img width="1919" height="925" alt="Screenshot 2026-02-09 101431" src="https://github.com/user-attachments/assets/2b30bf0e-66af-43b2-ae42-dc059bb8e323" />

### Performance Report
<img width="1919" height="926" alt="Screenshot 2026-02-09 101322" src="https://github.com/user-attachments/assets/a31aa6a0-36e2-4c1e-90b5-aba79b64a208" />


