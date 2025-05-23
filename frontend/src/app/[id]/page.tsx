// app/editor/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Editor } from "@monaco-editor/react";

const EditorPage = () => {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiHelp, setAiHelp] = useState("");
  const [showAIHelp, setShowAIHelp] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const debounceRef = useRef<number | null>(null);
  const editorRef = useRef<any>(null);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5000");
    return () => { 
      socketRef.current?.disconnect(); 
    };
  }, []);

  // Load initial code from DB
  useEffect(() => {
    const loadCode = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND}code/get/${id}`);
        if (res.data?.code) {
          setCode(res.data.code);
          // Set editor value if editor is already mounted
          if (editorRef.current) {
            editorRef.current.setValue(res.data.code);
          }
        }
      } catch (error) {
        console.error("Failed to load code:", error);
      }
    };
    loadCode();
  }, [id]);

  // Socket.IO room management
  useEffect(() => {
    if (!socketRef.current || !id) return;
    const socket = socketRef.current;
    
    socket.emit("join_room", { roomId: id });

    const handleCodeUpdate = (newCode: string) => {
      setCode(newCode);
      if (editorRef.current) {
        editorRef.current.setValue(newCode);
      }
    };

    socket.on("load_code", handleCodeUpdate);
    socket.on("new_message", handleCodeUpdate);

    return () => {
      socket.emit("exit_room", { roomId: id });
      socket.off("load_code", handleCodeUpdate);
      socket.off("new_message", handleCodeUpdate);
    };
  }, [id]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    // Set initial code if it's already loaded
    if (code) {
      editor.setValue(code);
    }
  };

  const handleChange = (val: string | undefined) => {
    const value = val ?? "";
    setCode(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      if (socketRef.current && id) {
        socketRef.current.emit("chatmessage", { roomId: id, message: value });
      }
    }, 1000);
  };

  const decodeBase64 = (encoded: string | null): string => {
    if (!encoded) return "";
    try {
      return atob(encoded);
    } catch {
      return encoded;
    }
  };

  const runCode = async () => {
    if (!code) return toast.error("Write code before running");
    try {
      setLoading(true);
      setOutput(""); // Clear previous output
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}code/run`, { 
        code, 
        language 
      });

      const decodedOutput = decodeBase64(res.data.stdout) ||
                          decodeBase64(res.data.stderr) ||
                          decodeBase64(res.data.compile_output) ||
                          "No output";

      setOutput(decodedOutput);
    } catch (error) {
      toast.error("Run failed");
      console.error("Execution error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAIHelp = async () => {
    if (!code) return toast.error("Write code before asking help");
    try {
      setLoading(true);
      setShowAIHelp(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}ai/get-hints`, { 
        code, 
        language 
      });
      setAiHelp(res.data.hints || res.data.aiResponse || "No suggestions available");
    } catch (error) {
      toast.error("AI failed to provide help");
      console.error("AI error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-tr from-[#0f172a] to-[#1e293b] text-white flex flex-col ${fullscreen ? "fixed inset-0 z-50" : ""}`}>
      <header className="p-4 bg-[#1f2937] flex justify-between items-center shadow-md">
        <select 
          className="bg-[#111827] text-white p-2 rounded" 
          value={language} 
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
        </select>
        <div className="flex gap-2">
          <button 
            onClick={runCode} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded shadow disabled:opacity-50"
          >
            {loading ? "Running..." : "Run"}
          </button>
          <button 
            onClick={getAIHelp} 
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded shadow disabled:opacity-50"
          >
            AI Help
          </button>
          <button 
            onClick={() => setFullscreen(!fullscreen)} 
            className="px-2 py-1 bg-gray-800 rounded hover:bg-gray-700"
          >
            {fullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <Editor
            onChange={handleChange}
            language={language}
            theme="vs-dark"
            height="100%"
            onMount={handleEditorDidMount}
            options={{
              fontSize: 14,
              lineHeight: 20,
              minimap: { enabled: false },
              padding: { top: 10 },
              wordWrap: "on",
              automaticLayout: true
            }}
          />
        </div>

        {!fullscreen && (
          <div className="w-1/3 bg-[#111827] p-4 overflow-auto border-l border-gray-700 flex flex-col">
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-2">Output</h2>
              <pre className="text-sm text-green-400 whitespace-pre-wrap bg-[#0d1117] p-2 rounded">
                {loading ? "Running..." : output || "// Output will appear here."}
              </pre>
            </div>
            
            {showAIHelp && (
              <div className="mt-4 border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold">AI Suggestions</h2>
                  <button 
                    onClick={() => setShowAIHelp(false)}
                    className="text-xs bg-gray-800 px-2 py-1 rounded hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
                <div className="text-sm text-yellow-300 whitespace-pre-wrap bg-[#0d1117] p-2 rounded">
                  {aiHelp}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" transition={Bounce} />
    </div>
  );
};

export default EditorPage;