"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Editor } from "@monaco-editor/react";

const EditorPage = () => {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [fullscreen, setFullscreen] = useState(false);
  const [loadingRun, setLoadingRun] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiHelp, setAiHelp] = useState("");
  const [showAIHelp, setShowAIHelp] = useState(false);

  const debounceRef = useRef<number | null>(null);
  const editorRef = useRef<any>(null);

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

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    // Set initial code if it's already loaded
    if (code) {
      editor.setValue(code);
    }
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
      setLoadingRun(true);
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
      setLoadingRun(false);
    }
  };

  const getAIHelp = async () => {
    if (!code) return toast.error("Write code before asking help");
    try {
      setLoadingAI(true);
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
      setLoadingAI(false);
    }
  };

  const saveCloud = async () => {
    if (!code) return toast.error("Write code before saving to cloud"); 
    try {
      setLoadingRun(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}code/upload`, { 
        code : code, 
        room : id 
      });
      if (res.status === 200) {
        toast.success("Code saved to cloud successfully!");
      } else {
        toast.error("Failed to save code to cloud");
      }
    } catch (error) {
      toast.error("Error saving code to cloud");
      console.error("Save error:", error);
    } finally {
      setLoadingRun(false);
    }
  };

  const handleChange = (val: string | undefined) => {
  const value = val ?? "";
  setCode(value);
  if (debounceRef.current) clearTimeout(debounceRef.current);
  debounceRef.current = window.setTimeout(() => {
    // If you had socket.io functionality before, you would put it here
    // For example:
    // if (socketRef.current && id) {
    //   socketRef.current.emit("chatmessage", { roomId: id, message: value });
    // }
  }, 1000);
};

  return (
    <div className={`min-h-screen bg-gradient-to-tr from-[#0f172a] to-[#1e293b] text-white flex flex-col ${fullscreen ? "fixed inset-0 z-50" : ""}`}>
      <header className="p-4 bg-[#1f2937] flex justify-between items-center shadow-md">
        <select 
          className="bg-[#111827] text-white p-2 rounded" 
          value={language} 
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="cpp">cpp</option>
          <option value="cpp">c</option>
          <option value="python">python</option>
          <option value="java">java</option>
        </select>
        <div className="flex gap-2">
          <button 
            onClick={runCode} 
            disabled={loadingRun || loadingAI}
            className="bg-blue-600 cursor-pointer hover:bg-blue-700 px-3 py-1 rounded shadow disabled:opacity-50"
          >
            {loadingRun ? "Running..." : "Run"}
          </button>
          <button 
            onClick={getAIHelp} 
            disabled={loadingAI || loadingRun}
            className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 px-3 py-1 rounded shadow disabled:opacity-50"
          >
            {loadingAI ? "AI Thinking..." : "AI Help"}
          </button>
          <button 
            onClick={saveCloud} 
            disabled={loadingRun || loadingAI}
            className="bg-orange-500 cursor-pointer hover:bg-orange-700 px-3 py-1 rounded shadow disabled:opacity-50"
          >
            Save to cloud
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <Editor
            value={code}
            language={language}
            onChange={handleChange}
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
                {loadingRun ? "Running..." : output || "// Output will appear here."}
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