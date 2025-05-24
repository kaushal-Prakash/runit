
# **Project Name: RunIt**  

**Description:**  

**RunIt** is a collaborative code execution platform that allows developers to write, edit, and **instantly run code** in a sandboxed environment. With real-time collaboration, seamless AI assistance (Gemini), and cloud/local save options, RunIt makes coding interactive and efficient.  

Key highlights:  
- **Edit code** in a feature-rich Monaco Editor (the same editor powering VS Code).  
- **Execute code securely** via Judge0 API with support for multiple languages.  
- **Save & share** snippets locally or in the cloud.  

Perfect for debugging, learning, or pair programming!  

---

## **✨ Key Features**  

✅ **Monaco Editor Integration** – A powerful, syntax-highlighted editor with IntelliSense (autocompletion).  
✅ **Judge0 Code Execution** – Run code in 50+ languages securely.  
✅ **Real-time Collaboration** – Live editing with multiple users (Socket.io).  
✅ **AI-Powered Assistance (Gemini)** – Get debugging help, code explanations, and suggestions.  
✅ **Save & Share** – Store snippets locally or in the cloud (Firebase/MongoDB).  
✅ **Easy Sharing** – Share via link with public/private access control.  

---

## **🚀 Installation**  

### **Prerequisites:**  
- Node.js ≥ 16  
- MongoDB (for cloud storage) **OR** Firebase (alternative)  
- Judge0 API key (for code execution)  
- Gemini API key (for AI features)  

### **Setup Steps:**  

1. **Clone the repo:**  
   ```bash
   git clone https://github.com/your-username/RunIt.git
   cd RunIt
   ```

2. **Install dependencies:**  
   ```bash
   npm install
   ```

3. **Set up environment variables** (`.env`):  
   ```env
   JUDGE0_API_KEY=your_judge0_key
   GEMINI_API_KEY=your_gemini_key
   MONGODB_URI=your_mongo_uri  # (Optional for cloud saves)
   ```

4. **Run the app:**  
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to start coding!  

---

## **🔧 Tech Stack**  

| Category       | Technologies Used |
|---------------|-------------------|
| **Frontend**  | Next.js, Monaco Editor, Tailwind CSS |
| **Backend**   | Node.js, Express |
| **Code Execution** | Judge0 API (sandboxed) |
| **AI**        | Gemini API (debugging/generation) |
| **Database**  | MongoDB / Firebase (for cloud saves) |

---

## **📜 License**  
MIT © 2024 [Your Name]. See [LICENSE](LICENSE) for details.  


