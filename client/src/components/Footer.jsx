import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  const links = {
    "Platform": [
      { label: "Quiz Generator", path: "/quiz" },
      { label: "Doubt Resolution", path: "/doubt/create" },
      { label: "Mind Maps", path: "/mindmap" },
      { label: "YouTube Learning", path: "/chatbot" },
      { label: "Recommendations", path: "/recommendations" }
    ],
    "For Teachers": [
      { label: "Join as Teacher", path: "/signup" },
      { label: "Create Quiz", path: "/create-quiz" },
      { label: "Dashboard", path: "/teacher-dashboard" },
      { label: "Teaching Guide", path: "/guide" }
    ],
    "Resources": [
      { label: "Help Center", path: "/help" },
      { label: "Blog", path: "/blog" },
      { label: "Community", path: "/community" },
      { label: "API Documentation", path: "/docs" }
    ]
  };

  return (
    <footer className="bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#00FF9D]/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-[#00FF9D]" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00FF9D]">
                  QuickLearnAI
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering education through AI and expert teachers. Making learning accessible, interactive, and effective.
              </p>
              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { Icon: Github, href: "#" },
                  { Icon: Twitter, href: "#" },
                  { Icon: Linkedin, href: "#" },
                  { Icon: Instagram, href: "#" }
                ].map(({ Icon, href }, index) => (
                  <a
                    key={index}
                    href={href}
                    className="w-10 h-10 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-gray-400 hover:text-[#00FF9D] hover:border-[#00FF9D]/30 transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(links).map(([category, items]) => (
              <div key={category}>
                <h4 className="text-white font-semibold mb-6">{category}</h4>
                <ul className="space-y-4">
                  {items.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.path}
                        className="text-gray-400 hover:text-[#00FF9D] transition-colors duration-300 text-sm"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} QuickLearnAI. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-[#00FF9D] transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-[#00FF9D] transition-colors duration-300">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-gray-400 hover:text-[#00FF9D] transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;