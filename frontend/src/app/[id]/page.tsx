"use client";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { useParams } from "next/navigation";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { io } from "socket.io-client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AI from "@/components/AI";

const socket = io("");

const Page = () => {
  const params = useParams();
  const [values, setValues] = useState("");
  const [output, setOutput] = useState("");
  const [aiRes, setAiRes] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<number | null>(null);
  const [runProg, setRunProg] = useState(false);
  const editorRef = useRef(null);

  // Socket.IO setup
  useEffect(() => {
    if (params.id) {
      socket.emit("join_room", { roomId: params.id });

      socket.on("load_code", (code) => {
        if (code) setValues(code);
      });
    }

    return () => {
      if (params.id) {
        socket.emit("exit_room", { roomId: params.id });
      }
    };
  }, [params.id]);

  useEffect(() => {
    const handleNewMessage = (msg: string) => setValues(msg);
    socket.on("new_message", handleNewMessage);
    return () => socket.off("new_message", handleNewMessage);
  }, []);

  const debouncedEmit = useCallback(
    (val: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = window.setTimeout(() => {
        socket.emit("chatmessage", { roomId: params.id, message: val });
      }, 1000);
    },
    [params.id]
  );

  const handleChange = (value: string | undefined) => {
    const safeVal = value ?? "";
    setValues(safeVal);
    debouncedEmit(safeVal);
  };

  const handleRunEvent = async () => {
    setRunProg(true);
    setOutput(""); 
    if (!values) {
      toast.error("Please enter code before running");
      setRunProg(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        "",
        {
          source_code: values,
          language: selectedLanguage,
        }
      );
      const data = response.data;
      setOutput(
        data.stdout ||
          data.stderr ||
          data.compile_output ||
          "Unknown error occurred"
      );
    } catch (error) {
      setOutput("Execution failed. Please try again.");
      toast.error("Something went wrong!");
    } finally {
      setRunProg(false);
      setIsLoading(false);
    }
  };

  const handleHelp = async () => {
    if (!values) {
      toast.error("Please enter code before getting help");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        "",
        {
          message: values,
          language: selectedLanguage,
        }
      );
      setAiRes(response.data.aiResponse);
      setShowResponse(true);
    } catch {
      toast.error("AI help failed");
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLocal = () => {
    try {
      localStorage.setItem(`runit-code-${params.id}`, values);
      toast.success("Saved to local storage");
    } catch {
      toast.error("Local save failed");
    }
  };

  const saveToCloud = async () => {
    try {
      setIsLoading(true);
      await axios.post("", {
        roomId: params.id,
        code: values,
      });
      toast.success("Saved to cloud");
    } catch {
      toast.error("Cloud save failed");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  // Update your main component's return to use the new Navbar:
  return (
    <div
      className={`min-h-screen bg-[#0e0e0e] text-white flex flex-col ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      <Navbar
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        saveToLocal={saveToLocal}
        saveToCloud={saveToCloud}
        handleRunEvent={handleRunEvent}
        handleHelp={handleHelp}
        isLoading={isLoading}
        runProg={runProg}
      />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div
          className={`${isFullscreen ? "w-full" : "lg:w-2/3 w-full"} relative`}
        >
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <span className="bg-[#2d2d2d] text-xs text-gray-400 px-2 py-1 rounded">
              {selectedLanguage.toUpperCase()}
            </span>
            <button
              onClick={toggleFullscreen}
              className="btn-dark flex items-center gap-1 text-sm p-1 cursor-pointer"
            >
              {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
            </button>
          </div>
          <Editor
            height={
              isFullscreen ? "calc(100vh - 56px)" : "calc(100vh - 56px - 60px)"
            }
            value={values}
            onChange={handleChange}
            language={selectedLanguage}
            theme="vs-dark"
            defaultValue="// Add comments to get better suggestions"
            options={{
              fontSize: 14,
              lineHeight: 20,
              automaticLayout: true,
              renderLineHighlight: "gutter",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              padding: { top: 15 },
              wordWrap: "on",
              formatOnPaste: true,
              formatOnType: true,
              fontFamily: "Fira Code, Consolas, Monaco, monospace",
              suggest: {
                showWords: false,
                showSnippets: true,
              },
            }}
            onMount={handleEditorDidMount}
          />
        </div>

        {/* Output Panel */}
        {!isFullscreen && (
          <div className="lg:w-1/3 w-full border-l border-gray-800 bg-[#161616] flex flex-col">
            <div className="p-3 border-b border-gray-800 flex justify-between items-center">
              <h2 className="font-semibold text-yellow-400 flex items-center gap-1">
                Output
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setOutput("")}
                  className="cursor-pointer text-xs bg-[#2d2d2d] hover:bg-[#3d3d3d] px-2 py-1 rounded"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-[#0f0f0f]">
              <pre
                className={`whitespace-pre-wrap font-mono text-sm ${
                  output.toLowerCase().includes("error")
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full delay-75"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full delay-150"></div>
                    </div>
                  </div>
                ) : output ? (
                  output
                ) : (
                  <span className="text-gray-500">
                    // Output will appear here after execution
                  </span>
                )}
              </pre>
            </div>
          </div>
        )}
      </div>

      {showResponse && aiRes && (
        <AI message={aiRes} onClose={() => setShowResponse(false)} />
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

      {!isFullscreen && <Footer />}
    </div>
  );
};

export default Page;
