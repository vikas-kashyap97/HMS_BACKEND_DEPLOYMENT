# ZeeCare Medical Institute - Backend

This repository contains the backend code for the **ZeeCare Medical Institute** project. The backend handles API requests, manages data, and ensures secure and efficient communication between the frontend applications and the database.

## Features

- **User Authentication & Authorization**: Secure login and registration for patients and admins using JWT.
- **Appointment Management**: API endpoints for creating, viewing, and managing patient appointments.
- **Message Handling**: Endpoints for sending and retrieving patient messages.
- **Doctor Management**: APIs for managing doctor profiles and their information.
- **Cloudinary Integration**: Efficient image storage and retrieval for doctor profiles.
- **Secure Data Storage**: Using MongoDB to securely store and manage all data.

## Technologies Used

- **Node.js**: Runtime environment for executing JavaScript on the server.
- **Express.js**: Framework for building the API and handling server-side logic.
- **MongoDB**: NoSQL database for managing and storing data.
- **Mongoose**: ODM for MongoDB, providing schema-based solutions.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **bcrypt**: For encrypting user passwords.
- **Cloudinary**: For managing and storing images.
- **dotenv**: For environment variable management.
- **Validator**: For validating data before processing.

## Getting Started

### Prerequisites

- Node.js and npm/yarn installed on your local machine.
- MongoDB instance or cluster for database management.
- Cloudinary account for managing images (optional but recommended).

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/princeessjay/HMS_BACKEND_DEPLOYMENT.git
   
   cd HMS_BACKEND_DEPLOYMENT
   
2. **Install dependencies:**

   ```bash
   npm install

3. **Create a .env file:**

   ```bash
   PORT=4000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

4. **Start the server:**

   ```bash
   npm run dev
   
4. **Deployment**

   ```bash
   npm run build

# License
Licensed under the [MIT license](https://github.com/princeessjay/HMS_DASHBOARD/blob/main/LICENSE.md).
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.


