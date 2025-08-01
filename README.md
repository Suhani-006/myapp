# 📱 infiScroll – Infinite Feed Recommendation Web App

**infiScroll** is a sleek, scroll-based content recommendation app designed to deliver an endless stream of personalized posts — including **Photos**. With smart onboarding, dynamic themes, and an intuitive UI, it's built for users who crave simplicity without sacrificing discovery.

🔗 **Live Demo**: [Try it on Vercel](https://infiscroll-git-master-krishas-projects-e9c3ea3f.vercel.app/login)

---

## 📖 Table of Contents

- [🎯 Objective](#objective)
- [✨ Key Features](#key-features)
- [🖼️ Screenshots](#screenshots)
- [🧠 Tech Stack](#tech-stack)
- [🛠️ How to Run Locally](#how-to-run-locally)
- [📂 Folder Structure](#folder-structure)
- [🧪 Challenges Faced](#challenges-faced)
- [📊 Analytics & Engagement Tracking](#analytics--engagement-tracking)
- [👥 Team](#team)
- [🚀 Project Submission](#project-submission)

---

<div id="objective"></div>
## 🎯 Objective

> To solve content fatigue by offering a recommendation-driven, clean, and infinite scroll experience tailored to individual interests — all in one beautiful UI.

---

<div id="key-features"></div>
## ✨ Key Features

- ♾️ **Infinite Feed** – Seamlessly loads more posts as you scroll.
- 🔍 **Smart Recommendations** – Posts based on selected interests (coming in final version).
- 🧠 **Category Tabs** – Filter content across: `Photos`.
- ❤️ **User Interaction** – Like, Save, Skip, and View Later functionality.
- 📱 **Onboarding & Preferences** – Personalized category selection during login.
- 🌗 **Theme Toggle** – Switch between **Light** and **Dark** mode.
- 📶 **Responsive Design** – Optimized for both desktop and mobile.

---

<div id="screenshots"></div>
## 🖼️ Screenshots

<table>
  <tr>
    <td><img src="https://user-images.githubusercontent.com/your-id/Screenshot_Explore_Light.png" width="200" alt="Explore - Light Mode"><br><b>Explore – Light Mode</b></td>
    <td><img src="https://user-images.githubusercontent.com/your-id/Screenshot_Explore_Dark.png" width="200" alt="Explore - Dark Mode"><br><b>Explore – Dark Mode</b></td>
    <td><img src="https://user-images.githubusercontent.com/your-id/Screenshot_Post_Expanded.png" width="200" alt="Post Detail View"><br><b>Post Detail View</b></td>
  </tr>
  <tr>
    <td><img src="https://user-images.githubusercontent.com/your-id/Screenshot_Recommended.png" width="200" alt="Recommended Feed"><br><b>Recommended Feed</b></td>
    <td><img src="https://user-images.githubusercontent.com/your-id/Screenshot_SportsFeed.png" width="200" alt="Category Scroll - Sports"><br><b>Category Scroll – Sports</b></td>
    <td><img src="https://user-images.githubusercontent.com/your-id/Screenshot_Explore_Tab_Navigation.png" width="200" alt="Bottom Navigation"><br><b>Bottom Navigation</b></td>
  </tr>
</table>

---

<div id="tech-stack"></div>
## 🧠 Tech Stack

| Layer          | Technologies              |
|----------------|---------------------------|
| Frontend       | React.js, Tailwind CSS    |
| Backend        | Node.js, Express.js       |
| Database       | Firebase Firestore        |
| Auth           | Firebase Google Sign-In   |
| Deployment     | Vercel (Frontend), Render (Backend) |

---

<div id="how-to-run-locally"></div>
## 🛠️ How to Run Locally

### 1. Install Dependencies
```bash
npm install

## 🛠️ How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase

Add your Firebase config to a `.env` file:

```env
VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_auth_domain
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_storage_bucket
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_app_id
```

### 3. Start the App
```bash
npm run dev
```

---
<div id= "folder-structure"></div>
## 📂 Folder Structure

```bash
infiScroll/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── hooks/
│   ├── App.jsx
│   └── main.jsx
├── .env
├── package.json
└── README.md
```

---

 🖼️ Screenshots

<table>
  <tr>
    <td align="center">
      <b>Login Page</b><br/>
      <img src="https://github.com/user/screenshots/raw/main/Screenshot%202025-08-01%20210118.png" width="250"/>
    </td>
    <td align="center">
      <b>Explore Feed - Light Mode</b><br/>
      <img src="https://github.com/user/screenshots/raw/main/Screenshot%202025-08-01%20210137.png" width="250"/>
    </td>
    <td align="center">
      <b>Explore Feed - Dark Mode</b><br/>
      <img src="https://github.com/user/screenshots/raw/main/Screenshot%202025-08-01%20210155.png" width="250"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>Explore Tab View</b><br/>
      <img src="https://github.com/user/screenshots/raw/main/Screenshot%202025-08-01%20210212.png" width="250"/>
    </td>
    <td align="center">
      <b>Recommended Sports Feed</b><br/>
      <img src="https://github.com/user/screenshots/raw/main/Screenshot%202025-08-01%20210240.png" width="250"/>
    </td>
    <td align="center">
      <b>Category Filter Feed</b><br/>
      <img src="https://github.com/user/screenshots/raw/main/Screenshot%202025-08-01%20210254.png" width="250"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>Single Post View</b><br/>
      <img src="https://github.com/user/screenshots/raw/main/Screenshot%202025-08-01%20210313.png" width="250"/>
    </td>
    <td align="center">
      <b>Explore Bottom Nav</b><br/>
      <img src="https://github.com/user/screenshots/raw/main/Screenshot%202025-08-01%20210339.png" width="250"/>
    </td>
  </tr>
</table>

---
<div id= "challenges-faced"></div>
 🧪 Challenges Faced

- Integrating Firebase Auth with persistent state  
- Conditional theme rendering across components  
- Designing mobile-first responsive cards  
- Managing scroll-based content rendering  
- Syncing "Liked" & "Saved" states with Firebase  

---
<div id= "team"></div>
 👥 Team

| Name         | Role        |
|--------------|-------------|
| Suhani       | Team Leader |
| Krisha       | Developer   |
| Rida         | Developer   |
| Shambhavi    | Developer   |
| Aayush Bhaiya| Mentor      |

---

## 🚀 Project Submission

> Built with ❤️ by **Team SD_009** for **IITI Summer of Code 2025**
