# 🗳️ Voting & Polling System

A secure, transparent, and flexible **voting platform** built with **Node.js, Express, Sequelize, and GraphQL**.
This project was inspired by a simple idea:
👉 *How can we make decision-making online as fair, accessible, and trustworthy as in real life?*

---

## 🚀 Features

* **🔐 Authentication & Authorization**

  * JWT-based login & signup.
  * Restricts voting to eligible users.

* **📊 Poll Creation & Management**

  * Create polls with multiple questions and options.
  * Assign expiry times (`expiresAt`) so polls close automatically.

* **🗳️ Secure Voting**

  * One user = one vote per question.
  * Prevents duplicate or late votes.

* **📈 Results & Analytics**

  * Aggregates votes by option and question.
  * Displays counts and percentages (like an election result).
  * Groups results per question for clarity.

* **⏱️ Poll Expiry Enforcement**

  * Votes are rejected after expiry.
  * Future-proof for scheduled jobs (cron) to auto-close polls.

* **🧩 Modular Design (Domain Driven)**

  * Repositories, services, and resolvers separated for maintainability.
  * Easily extendable (e.g., invitations, admin dashboards).

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express
* **API Layer:** GraphQL (Apollo Server)
* **Database ORM:** Sequelize (PostgreSQL/MySQL/SQLite supported)
* **Authentication:** JWT
* **Other Tools:** TypeScript, dotenv, nodemon

---

## 📂 Project Structure

```
src/
├── domain/
│   ├── entities/
│   └── repositories/
├── application/
│   └── services/
├── infrastructure/
│   ├── database/
│   │   └── models/
│   ├── repositories/
│   └── graphql/
│       ├── typeDefs/
│       └── resolvers/
├── interfaces/
│   └── graphql/
└── shared/

```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Samueliyiola/Votefair.git
cd Votefair
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
PORT=4000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=your_db
DATABASE_USER=your_user
DATABASE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

### 4. Run migrations & seed (if any)

```bash
npx sequelize-cli db:migrate
```

### 5. Start the server

```bash
npm run dev   # for development
npm run build && npm start   # for production
```

Server will run on 👉 **[http://localhost:4000/graphql](http://localhost:4000/graphql)**

---

## 📖 Example Queries

### 🔹 Create a Poll

```graphql
mutation {
  createPoll(input: {
    title: "School Election 2025",
    expiresAt: "2025-10-01T13:15:00Z",
    questions: [
      {
        text: "Who should be class president?",
        options: ["Alice", "Bob", "Charlie"]
      }
    ]
  }) {
    id
    title
    expiresAt
  }
}
```

### 🔹 Cast a Vote

```graphql
mutation {
  castVote(input: {
    pollId: "123",
    questionId: "456",
    optionId: "789"
  }) {
    id
    option {
      text
    }
  }
}
```

### 🔹 View Results

```graphql
query {
  pollResults(pollId: "123") {
    pollId
    title
    questions {
      text
      options {
        text
        voteCount
        percentage
      }
    }
  }
}
```

---

## 🧪 Testing

Run tests with:

```bash
npm test
```

---

## 🌟 Future Improvements

* **📡 Real-time results** with GraphQL Subscriptions / WebSockets.
* **📩 Invitations** (restrict poll access to invited users).
* **📱 Frontend UI** (React/Next.js).
* **📊 Admin Dashboard** for managing multiple polls.
* **🗄️ Caching & scaling** (Redis, load balancing).

---

## 🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first to discuss what you’d like to change.

---

## 📜 License

MIT License © 2025 Samuel Iyiola

