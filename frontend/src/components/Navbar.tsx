"use client";
import { FaRegSave, FaCloudUploadAlt, FaPlay, FaCode, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";

interface NavbarProps {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  saveToLocal: () => void;
  saveToCloud: () => void;
  handleRunEvent: () => void;
  handleHelp: () => void;
  isLoading: boolean;
  runProg: boolean;
}

const Navbar = ({
  selectedLanguage,
  setSelectedLanguage,
  saveToLocal,
  saveToCloud,
  handleRunEvent,
  handleHelp,
  isLoading,
  runProg,
}: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="p-4 bg-[#1a1a1a] border-b border-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <FaCode className="text-yellow-400 text-xl" />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
            RunIt
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="cursor-pointer bg-[#2d2d2d] text-white border border-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
          >
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="js">JavaScript</option>
            <option value="python">Python</option>
          </select>

          <NavButton className="cursor-pointer" onClick={saveToLocal} disabled={isLoading}>
            <FaRegSave /> Save
          </NavButton>
          <NavButton className="cursor-pointer" onClick={saveToCloud} disabled={isLoading}>
            <FaCloudUploadAlt /> Cloud
          </NavButton>
          <NavButton 
            onClick={handleRunEvent} 
            disabled={runProg || isLoading}
            className={`bg-green-700 hover:bg-green-600 ${(runProg || isLoading) ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <FaPlay /> {runProg ? "Running..." : "Run"}
          </NavButton>
          <NavButton  onClick={handleHelp} disabled={isLoading} className="cursor-pointer bg-blue-700 hover:bg-blue-600">
            <FaWandMagicSparkles /> AI
          </NavButton>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden text-gray-400 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-2">
          <div className="flex flex-col space-y-2">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-[#2d2d2d] text-white border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
            >
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="js">JavaScript</option>
              <option value="python">Python</option>
            </select>

            <MobileNavButton onClick={saveToLocal} disabled={isLoading}>
              <FaRegSave className="cursor-pointer" /> Save to Local
            </MobileNavButton>
            <MobileNavButton onClick={saveToCloud} disabled={isLoading}>
              <FaCloudUploadAlt className="cursor-pointer" /> Save to Cloud
            </MobileNavButton>
            <MobileNavButton 
              onClick={handleRunEvent} 
              disabled={runProg || isLoading}
              className={`bg-green-700 hover:bg-green-600 ${(runProg || isLoading) ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <FaPlay /> {runProg ? "Running..." : "Run Code"}
            </MobileNavButton>
            <MobileNavButton onClick={handleHelp} disabled={isLoading} className="bg-blue-700 hover:bg-blue-600">
              <FaWandMagicSparkles /> AI
            </MobileNavButton>
          </div>
        </div>
      )}
    </nav>
  );
};

// Reusable NavButton component
const NavButton = ({ children, className = "", ...props }: any) => (
  <button
    className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Mobile-specific NavButton
const MobileNavButton = ({ children, className = "", ...props }: any) => (
  <button
    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white transition-colors w-full text-left ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Navbar;