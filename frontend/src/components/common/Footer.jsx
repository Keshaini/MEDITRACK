import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 pt-12 pb-6 px-6 md:px-20 mt-20 transition-colors duration-300">
      {/* Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 border-b border-gray-700 dark:border-gray-800 pb-10">
        
        {/* Column 1 - Brand and Socials */}
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-sky-500 bg-clip-text text-transparent mb-4">
            MediTrack
          </h2>
          <p className="text-sm leading-relaxed mb-6">
            Smart Health Tracker connecting patients and doctors to monitor health, share feedback, and visualize progress effortlessly.
          </p>
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook" className="hover:text-teal-400 transition">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-teal-400 transition">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-teal-400 transition">
              <FaInstagram />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-teal-400 transition">
              <FaLinkedinIn />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-teal-400 transition">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Column 2 - Products */}
        <div>
          <h3 className="text-lg font-semibold text-white dark:text-gray-100 mb-4">Products</h3>
          <ul className="space-y-2">
            <li><a href="/features/ai-assistant" className="hover:text-teal-400 transition">AI Assistant</a></li>
            <li><a href="/features/image-analyzer" className="hover:text-teal-400 transition">Image Analyzer</a></li>
            <li><a href="/features/health-insights" className="hover:text-teal-400 transition">Health Insights</a></li>
            <li><a href="/features/reports" className="hover:text-teal-400 transition">Reports Dashboard</a></li>
          </ul>
        </div>

        {/* Column 3 - Resources */}
        <div>
          <h3 className="text-lg font-semibold text-white dark:text-gray-100 mb-4">Resources</h3>
          <ul className="space-y-2">
            <li><a href="/pricing" className="hover:text-teal-400 transition">Pricing</a></li>
            <li><a href="/faq" className="hover:text-teal-400 transition">FAQ</a></li>
            <li><a href="/support" className="hover:text-teal-400 transition">Help Center</a></li>
            <li><a href="/docs" className="hover:text-teal-400 transition">API Docs</a></li>
          </ul>
        </div>

        {/* Column 4 - Company */}
        <div>
          <h3 className="text-lg font-semibold text-white dark:text-gray-100 mb-4">Company</h3>
          <ul className="space-y-2">
            <li><a href="/about" className="hover:text-teal-400 transition">About Us</a></li>
            <li><a href="/careers" className="hover:text-teal-400 transition">Careers</a></li>
            <li><a href="/contact" className="hover:text-teal-400 transition">Contact</a></li>
            <li><a href="/blog" className="hover:text-teal-400 transition">Blog</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 text-sm text-gray-500 dark:text-gray-500">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="text-teal-400 font-semibold">MediTrack</span>. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-3 md:mt-0">
          <a href="/privacy" className="hover:text-teal-400 transition">Privacy Policy</a>
          <a href="/terms" className="hover:text-teal-400 transition">Terms</a>
          <a href="/cookies" className="hover:text-teal-400 transition">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
