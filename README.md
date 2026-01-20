# PARA Web

PARA Web is a Personal Knowledge Management (PKM) application designed to help you organize your digital life using the **P.A.R.A.** method (Projects, Areas, Resources, Archives).

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (via Docker)
- **Authentication**: JWT (JSON Web Tokens) & bcrypt
- **Infrastructure**: Docker Compose

## Setup & Installation

### 1. Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) (v16+ recommended)

### 2. Start Database
Start the PostgreSQL container using Docker Compose:

```bash
docker-compose up -d
```

### 3. Backend Setup
Navigate to the Backend directory and install dependencies:

```bash
cd BE
npm install
```

### 4. Running the Server
Start the development server:

```bash
npm run dev
```
The server will start at `http://localhost:3000`.

## API Authentication

The API is secured using JWT. You must authenticate to access protected resources (like Folders).

### Authentication Flow
1.  **Register**: Send a `POST` request to `/api/auth/register` with `email` and `password`.
    - Response includes a `token`.
2.  **Access Resources**: Include the token in the `Authorization` header for subsequent requests.
    - Header Format: `Authorization: Bearer <your_token>`

## Project Structure

```
PARA_Web/
├── BE/                 # Backend Source Code (Express + TypeScript)
├── docker-compose.yml  # Database Service Configuration
└── README.md           # Project Documentation
```
