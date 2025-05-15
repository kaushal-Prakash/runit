import React from "react";

function Footer() {
  return (
    <footer className="py-8 border-t border-slate-300 dark:border-slate-700">
      <div className="container mx-auto px-6 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} RunIt. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
