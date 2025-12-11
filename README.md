 **`README.md`** file for your **Exotic Paws and Claws** project.

# Exotic Paws and Claws 🐾

**A Comprehensive Web-Based Pet Care & Management Platform**

> **Student Name:** Joshua Mumo  
> **Course:** B.Sc. Software Development  
> **Institution:** KCA University

-----

## 📖 Project Overview

**Exotic Paws and Claws** is a centralized web application designed to digitize and simplify the pet ownership experience in Kenya. It addresses the fragmentation of the pet care industry by integrating health tracking, service booking, adoption, e-commerce, and community support into a single, cohesive ecosystem.

While catering to standard pets like dogs and cats, the platform specifically bridges the gap for **exotic pet owners** (birds, rabbits, hamsters) who often lack specialized resources.

-----

## ✨ Key Features

### 1\. 🏠 **User Dashboard**

  * **Central Hub:** Real-time overview of your pets and upcoming activities.
  * **Widgets:** "Daily Wisdom" pet tips and "Up Next" appointment reminders.
  * **Quick Actions:** One-click access to add pets or book services.

### 2\. 🐾 **Pet Management**

  * **Digital Profiles:** Create detailed profiles for multiple pets (Species, Breed, Age, Weight, Photo).
  * **Medical Status:** Toggle vaccination and spay/neuter status.
  * **Gallery View:** View all registered companions in a beautiful card grid.

### 3\. 📅 **Service Booking System**

  * **Service Catalog:** Browse premium services (Luxury Grooming, Vet Visits) and manual contracts (Kennel Construction, Transport).
  * **Smart Scheduling:** Book appointments for specific pets with preferred dates.
  * **Active Contracts:** Track the status of your requests (Pending → In Progress → Completed).

### 4\. 🏥 **Health & Wellness Center**

  * **Medical Timeline:** Visual history of vaccinations, vet visits, and weight logs.
  * **Vitals Dashboard:** Monitor age and weight changes.
  * **Quick Logging:** Easily add new health records via a modal interface.

### 5\. 🛒 **E-Commerce Shop (Kenya Edition)**

  * **Localized Pricing:** All products priced in **KES**.
  * **Smart Filtering:** Filter by category (Food, Toys, Accessories, Bundles).
  * **Cart System:** Add items to a slide-out cart and view total costs.

### 6\. 🏘️ **Community & Adoption**

  * **Adoption Portal:** Browse rescue pets with filters for Dogs, Cats, and Birds. Apply to adopt directly.
  * **Community Forum:** Discuss topics, ask for advice, and RSVP to local pet events (e.g., Nairobi Pet Expo).
  * **Volunteer Program:** Apply to join the mission as a volunteer.

### 7\. 🚨 **Emergency Resources**

  * **24/7 Contacts:** Direct tap-to-call buttons for KSPCA and emergency clinics in Nairobi/Mombasa.
  * **First Aid Guide:** Immediate steps for common emergencies (Poisoning, Heatstroke).

-----

## 🛠️ Technology Stack

  * **Frontend:**
      * **HTML5** (Semantic Structure)
      * **Tailwind CSS** (Styling & Responsiveness)
      * **Anime.js** (UI Animations)
      * **Splide.js** (Carousels/Sliders)
  * **Backend:**
      * **Node.js** (Runtime Environment)
      * **Express.js** (Web Framework)
      * **JWT (JSON Web Tokens)** (Authentication)
  * **Database:**
      * **MySQL** (Relational Database Management)

-----

## 🚀 Installation & Setup Guide

Follow these steps to get the project running on your local machine.

### **1. Prerequisites**

Ensure you have the following installed:

  * [Node.js](https://nodejs.org/) (v14 or higher)
  * [suspicious link removed]

### **2. Clone the Repository**

```bash
git clone https://github.com/your-username/exotic-paws.git
cd exotic-paws
```

### **3. Install Backend Dependencies**

The project relies on several Node.js packages. Install them using `npm`:

```bash
npm install
```

*(This installs express, mysql2, cors, bcryptjs, jsonwebtoken, etc.)*

### **4. Database Configuration**

1.  Open your MySQL Workbench or Command Line.
2.  Create the database:
    ```sql
    CREATE DATABASE exotic_paws_db;
    ```
3.  Run the following SQL script to create the required tables:

<!-- end list -->

```sql
USE exotic_paws_db;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pets Table
CREATE TABLE pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50),
    breed VARCHAR(100),
    age_years INT,
    weight DECIMAL(5,2),
    gender VARCHAR(20),
    color VARCHAR(50),
    location VARCHAR(100),
    photo_url TEXT,
    vaccinated BOOLEAN DEFAULT FALSE,
    spayed BOOLEAN DEFAULT FALSE,
    medical_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Service Bookings
CREATE TABLE service_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_type ENUM('Premium', 'Contract') NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    pet_name VARCHAR(100) DEFAULT 'General',
    preferred_date DATE,
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Health Records
CREATE TABLE health_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id INT NOT NULL,
    record_type ENUM('Vaccination', 'Weight', 'Vet Visit', 'Medication', 'Condition') NOT NULL,
    title VARCHAR(100) NOT NULL,
    value VARCHAR(100),
    date_recorded DATE NOT NULL,
    next_due_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);
```

4.  **Update Database Credentials:**
    Open `server.js` (or your database configuration file) and update the connection details:
    ```javascript
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',      // Your MySQL username
        password: 'password', // Your MySQL password
        database: 'exotic_paws_db'
    });
    ```

### **5. Run the Application**

Start the backend server:

```bash
npm start
```

*You should see: "Server running on port 3000..."*

### **6. Access the App**

Open your browser and navigate to:
**`http://localhost:3000`**

*(Note: Ensure you start at `login.html` or `index.html` to authenticate first)*

-----

## 📂 Project Structure

```
exotic-paws/
├── backend/
│   ├── routes/
│   │   ├── auth.js         # Login/Register Logic
│   │   ├── pets.js         # Pet CRUD operations
│   │   ├── services.js     # Booking logic
│   │   └── health.js       # Medical records logic
│   └── config/
│       └── db.js           # Database connection
├── frontend/
│   ├── css/                # Custom styles (if any beyond Tailwind)
│   ├── images/             # Pet and product images
│   ├── js/
│   │   ├── database.js     # API fetch wrapper
│   │   └── main.js         # Shared UI logic
│   ├── home.html           # Dashboard
│   ├── services.html       # Booking Page
│   ├── health.html         # Health Tracker
│   ├── adoption.html       # Adoption Center
│   ├── shop.html           # E-Commerce
│   ├── community.html      # Forum & Events
│   ├── emergency.html      # 24/7 Contacts
│   ├── add-pet-enhanced.html
│   └── viewpet.html
├── server.js               # Main Entry Point
├── package.json            # Dependencies
└── README.md               # Documentation
```

-----

## 📸 Screenshots

| Dashboard | Services |
| :---: | :---: |
|  |  |

| Health Tracker | Pet Shop |
| :---: | :---: |
|  |  |

-----

## 📝 License

This project is created for academic purposes at **KCA University**.
© 2025 Joshua Mumo. All Rights Reserved.
