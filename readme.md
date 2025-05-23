# Partisia Trivia

A full-stack trivia game that leverages the **MPC (Multi-Party Computation)** infrastructure of the **Partisia Blockchain**. This project includes:

- 🧠 A **Zero-Knowledge (ZK) smart contract** written in **Rust**
- 🛠 A **NestJS API server**
- 💻 A **React frontend** built with **Vite**

> **Note:** Docker is required to run the MongoDB database used by the API.

---

## 🧩 Game Flow

1. Users connect to the frontend via the **Parti Wallet extension**.
2. They can **create** a new game or **join** an existing one.
3. Players **answer trivia questions** through the interface.
4. Answers are **privately stored** using MPC nodes on the Partisia Blockchain.
5. Once the game ends, the host finalizes the game, triggering score computation and **on-chain leaderboard publication**.

---

## 🚀 Getting Started

### ✅ Prerequisites

Make sure the following tools are installed:

- Java
- Node.js
- Yarn
- Docker
- Partisia CLI

---

## 📦 Project Structure & Setup

### 1. Smart Contract

- To run smart contract tests:

```bash
./java-run-tests.sh
```

- To build the contract:

```bash
cd rust
cargo partisia-contract build --release
```

🗂 **Build Output:**  
Located in `target/wasm32-unknown-unknown/release/`

📤 **Deployment:**  
Use the [Partisia Testnet Explorer](https://browser.testnet.partisiablockchain.com/contracts/deploy)  
Upload the `trivia.abi` and `trivia.zkwa` files for deployment.

### 2. API Server

```bash
cd api
yarn install
```

- Copy `.env.example` to `.env` and configure the values (you may use example values for testing).
- To run in development mode:

```bash
yarn start:dev
```

- To run in production mode:

```bash
yarn build
yarn migrate       # Run initial database migrations
yarn start:prod
```

Ensure you have deployed a contract to set in the `contractAddress` record within the mongodb settings collection. The other values should be sufficient for testnet purposes but can easily be changed if you want to run on mainnet.

🔧 **MongoDB Setup:**

- Start MongoDB via Docker (see below).
- Note: The API expects MongoDB to run on port `27010`. Adjust your `.env` file accordingly.

---

### 3. Frontend

```bash
cd frontend
yarn install
```

- Copy `.env.example` to `.env` and update values as needed.
- To start the frontend in development:

```bash
yarn dev
```

- To build for production:

```bash
yarn build
cp -R dist/* /var/www/trivia-fe  # Or your preferred hosting path
```

---

## 🐳 MongoDB with Docker

Start MongoDB:

```bash
docker compose up -d
```

Stop MongoDB:

```bash
docker compose down
```

> **Note:** MongoDB runs on port `27010` by default in this setup. Be sure your `.env` connection string reflects this.

---
