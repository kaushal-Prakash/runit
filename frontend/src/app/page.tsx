'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaMoon, FaSun, FaCode, FaUsers, FaRobot, FaLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const generateRoomId = () => Math.floor(100000 + Math.random() * 900000).toString();

  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-200">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 border-b border-slate-300 dark:border-slate-700">
        <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="text-2xl font-bold">
          RunIt
        </motion.div>
        <div className="flex items-center gap-4">
          <Link
            href={`/${generateRoomId()}`}
            className="px-6 py-2 rounded-md font-medium transition transform hover:scale-105 cursor-pointer bg-indigo-600 text-white hover:bg-indigo-500"
          >
            Start Coding
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <section className="max-w-4xl mx-auto text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold mb-6"
          >
            Code. Run. <span className="text-indigo-400">Collaborate.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-10 text-slate-700 dark:text-slate-300 tracking-wider"
          >
            The real-time coding platform with AI assistance for seamless collaboration
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              href={`/${generateRoomId()}`}
              className="px-8 py-3 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 font-medium transition transform hover:scale-105 cursor-pointer"
            >
              Get Started - It's Free
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 rounded-md border border-slate-400 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium transition transform hover:scale-105 cursor-pointer"
            >
              Learn More
            </Link>
          </motion.div>
        </section>

        {/* Code Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20 rounded-lg overflow-hidden shadow-lg bg-slate-800 dark:bg-slate-900"
        >
          <div className="p-4 flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="p-6 font-mono text-left text-slate-100">
            <p className="text-green-400">// Write and run code instantly</p>
            <p className="text-purple-400">function</p> <span className="text-blue-400">hello</span>() {'{'}
            <br />
            <span className="ml-4 text-red-400">console</span>.<span className="text-yellow-400">log</span>(<span className="text-green-300">'Hello from RunIt!'</span>);
            <br />
            {'}'}
            <br />
            <span className="text-blue-400">hello</span>();
          </div>
        </motion.div>

        {/* Features Section */}
        <section id="features" className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Use RunIt?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <FaCode className="text-3xl mb-4" />, title: "Real-time Execution", desc: "Run code instantly in 8+ languages with Judge0 integration" },
              { icon: <FaUsers className="text-3xl mb-4" />, title: "Live Collaboration", desc: "Code together with teammates in real-time" },
              { icon: <FaRobot className="text-3xl mb-4" />, title: "AI Assistance", desc: "Get smart suggestions powered by Gemini AI" },
              { icon: <FaLightbulb className="text-3xl mb-4" />, title: "Learning Tool", desc: "Perfect for teaching, interviews, and debugging" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg shadow-md hover:shadow-xl bg-white dark:bg-slate-800 transition cursor-pointer"
              >
                <div className="mb-4 text-indigo-500">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-lg bg-white dark:bg-slate-800 shadow-md"
          >
            <h2 className="text-2xl font-bold mb-4">Ready to Collaborate?</h2>
            <p className="text-lg mb-6 text-slate-500 dark:text-slate-300">
              Join thousands of developers who code together effortlessly
            </p>
            <Link
              href={`/room/${generateRoomId()}`}
              className="px-8 py-3 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 font-medium inline-block transition transform hover:scale-105 cursor-pointer"
            >
              Start Coding Now
            </Link>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-300 dark:border-slate-700">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} RunIt. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
