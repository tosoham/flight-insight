export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Copyright */}
        <p className="text-sm mb-4">
          © 2025 Flight Insight. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 justify-center">

          <a href="#about" className="hover:text-white transition">About</a>
          <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
          <a 
            href="https://github.com/your-repo" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white transition"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
