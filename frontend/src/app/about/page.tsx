'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          About RunIt
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg leading-relaxed space-y-6"
        >
          <p>
            <strong>RunIt</strong> was built out of a deep frustration with switching between coding platforms, video calls, and file-sharing tools while trying to collaborate on code in real time.
          </p>

          <p>
            I'm <strong>devShadow</strong> — a developer passionate about building tools that simplify collaboration and empower teams. I believe coding should feel fluid, fun, and frictionless — and that’s exactly what RunIt is here to do.
          </p>

          <p>
            With RunIt, you can spin up a coding room instantly, write and execute code in multiple languages, get AI-assisted suggestions, and collaborate live — all in one place.
          </p>

          <p>
            Whether you're debugging with a friend, preparing for interviews, teaching a class, or running a remote code jam — RunIt is designed to be your reliable coding companion.
          </p>

          <p className="italic text-indigo-500 dark:text-indigo-400">
            “Code is more than syntax. It’s communication.” — devShadow
          </p>

          <p>
            Thank you for using RunIt. If you have suggestions, feedback, or just want to chat code — I’d love to hear from you!
          </p>

          <div className="pt-6 text-center">
            <Link
              href="/"
              className="inline-block px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition transform hover:scale-105"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
