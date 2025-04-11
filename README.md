# 🧠 Tool-Aware AI Assistant with Bun, TypeORM, SQLite, and Ollama

This is a local-first AI assistant prototype powered by **Bun**, **SQLite**, **TypeORM**, and **Ollama** running **Mistral** or **LLaMA 3.1** models. The assistant can simulate tool use by calling backend functions in natural language and receiving the results.

## ✨ Features

- 📦 Bun runtime with blazing fast startup
- 🗃️ SQLite database using TypeORM
- 🧪 Faker-based seed data with employees and departments
- 🤖 Ollama LLM interface with support for tool-style prompts
- 🛠️ Tools exposed:
    - `get_employee_by_name(name)`
    - `get_employee_by_email(email)`
    - `get_employee_manager(employeeId)`
- 🧵 Interactive CLI loop with natural language queries
- 🔁 Supports multi-turn tool chaining (AI asks for name → gets ID → gets manager)

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd <project>
bun install
```

### 2. Create `.env` file

```env
MODEL_NAME=llama3.1:8b
OLLAMA_URL=http://192.168.10.2:11434
LOG_LEVEL=info
```

### 3. Run Database Seed

```bash
bun run seed
```

This populates 100 employees and 10 departments, each with a manager and 10 staff.

### 4. Run the AI Assistant

```bash
bun run chat
```

Start chatting:
```
You: who is Jane Doe's manager?
🤖 Jane Doe reports to John Smith.
```

---

## 🧠 How It Works

The LLM receives a system prompt explaining how to respond using tool-style syntax. For example:
```
get_employee_by_name("Jane Doe")
```

Your app intercepts this, runs the function, and feeds the result back to the LLM to complete the answer.

The loop continues until the LLM returns a natural language message.

---

## 🗂 Project Structure

```
├── README.md
├── bun.lockb
├── db
│   └── dbv1.sqlite
├── package.json
├── .env
├── tsconfig.json
├── src
│   ├── config.ts
│   ├── data-source.ts
│   ├── entity
│   │   ├── DepartmentEntity.ts
│   │   └── EmployeeEntity.ts
│   ├── index.ts            # Main CLI assistant loop
│   ├── logger.ts           # Pino logger instance
│   ├── ollamaClient.ts     # Wrapper for Ollama chat calls
│   ├── seed.ts             # Seeder for fake employee data
│   └── tools.ts            # Tool function definitions
```

---

## 🔧 Config

```ts
// src/config.ts
const config = {
  model: {
    name: String(Bun.env.MODEL_NAME ?? "llama3.1:8b")
  },
  urls: {
    ollama: String(Bun.env.OLLAMA_URL || "http://192.168.10.2:11434"),
  },
  logger: {
    level: String(Bun.env.LOG_LEVEL || "info")
  },
};
export default config;
```

---

## 🧪 Example Prompts

```
hello
can I get Valentina Walsh's email?
who is her manager?
```

---

## ✅ Todos / Next Steps

- [ ] Add get_staff_by_manager(employeeId)
- [ ] Enable OpenAPI or HTTP version of the tools
- [ ] Support streaming responses from Ollama
- [ ] Export conversation history

---

## 📜 License

MIT

