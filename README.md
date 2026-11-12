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

3. **Create the environment file:**

   The server loads `config/config.env`. Copy the example and fill it in:

   ```bash
   cp config/config.env.example config/config.env
   ```

   | Variable | Description |
   | --- | --- |
   | `PORT` | Port to listen on (default `4000`) |
   | `MONGO_URL` | MongoDB connection string |
   | `FRONTEND_URL` / `DASHBOARD_URL` | Exact origins of the patient site and admin dashboard (used for CORS and CSRF checks) |
   | `JWT_SECRET_KEY` | Long random secret used to sign tokens |
   | `JWT_EXPIRES` | Token lifetime, e.g. `7d` |
   | `COOKIE_EXPIRE` | Cookie lifetime in days, e.g. `7` |
   | `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials |
   | `NODE_ENV` | Set to `development` for local http; leave unset/`production` when deployed over https |

4. **Start the server:**

   ```bash
   npm run dev
   ```

5. **Deployment**

   ```bash
   npm start
   ```

# License
Licensed under the [MIT license](https://github.com/princeessjay/HMS_BACKEND_DEPLOYMENT/blob/main/LICENSE.md).

# Fun Fact
**Lines of code**: 4029 😆😆😆😆


