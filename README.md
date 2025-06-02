# 🌱 CleanCity - Environmental Reporting App

> Report. Manage. Act. A cleaner city starts here. 💚

---

## 📱 Overview

**CleanCity** is a mobile application built with **React Native** and **Expo Router**, allowing citizens to report urban and environmental issues in real-time and enabling authorities and admins to manage them effectively.

---

## ✨ Features

### 👤 User Functionality
- 📸 Report incidents (upload image, location, category)
- 📊 Track personal report history
- 🔄 Password reset flow
- 🌿 Eco-facts slider on Home screen
- ⚙️ Profile & settings management

### 🛡️ Admin Functionality
- 📋 View all reported issues
- ✅ Change status: `OPEN → IN_PROGRESS → RESOLVED`
- 👥 View & manage all users
- 🔐 Reset passwords or delete user accounts

### 🚨 Organ View (Poliție / Salubritate / Pompieri)
- 🔍 View filtered reports
- 🔄 Change issue status
- 🗺️ Visual markers on city map

---

## 📸 Screenshots

| Home with Eco Tips | Report Flow | Admin Dashboard |
|--------------------|-------------|-----------------|
| ![Home](./assets/screens/home.png) | ![Report](./assets/screens/report.png) | ![Admin](./assets/screens/admin.png) |

---

## 🛠️ Tech Stack

| Layer          | Tech                                           |
|----------------|------------------------------------------------|
| **Frontend**   | React Native + Expo Router                     |
| **Backend**    | Java Spring Boot + PostgreSQL                  |
| **Storage**    | SecureStore (Expo), AsyncStorage               |
| **Auth**       | JWT-based, Spring Security                     |
| **UI**         | Linear Gradient, Ionicons, Custom Cards        |

git