'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-gold mb-4">SB INFRA PROJECTS</h3>
            <p className="text-gray-400">
              Building excellence through innovation and quality craftsmanship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="text-gray-400 hover:text-gold transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#process" className="text-gray-400 hover:text-gold transition-colors">
                  Our Process
                </a>
              </li>
              <li>
                <a href="#projects" className="text-gray-400 hover:text-gold transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-gold transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-gold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@sbinfra.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Construction Ave</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} SB Infra Projects. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
