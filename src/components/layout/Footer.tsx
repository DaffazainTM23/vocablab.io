import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://res.cloudinary.com/df0razmlr/image/upload/v1759380215/VocabLab_h2t5nh.png"
                alt="VocabLab Logo"
                className="h-10 w-10"
              />
              <span className="text-xl font-bold">
                VocabLab<span className="gradient-text">.io</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              An interactive English vocabulary learning platform for 7th-grade students.
              Learn with audio pronunciation, example sentences, and engaging games.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/topics" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Topics
                </Link>
              </li>
              <li>
                <Link to="/games" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Games
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Developer</h3>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm font-medium">
                Vanza Serliana Arianto
              </p>
              <a
                href="mailto:234110404072@mhs.uinsaizu.ac.id"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Mail size={16} />
                234110404072@mhs.uinsaizu.ac.id
              </a>
              <a
                href="https://wa.me/628888280205"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Phone size={16} />
                +62 888-8280-205
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Campus</h3>
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-300">
                UIN Prof. K.H. Saifuddin Zuhri
              </p>
              <div className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>
                  Jl. A. Yani No.40A, Purwanegara, Purwokerto Utara, Banyumas, Jawa Tengah 53126
                </span>
              </div>
              <a
                href="mailto:okpp@uinsaizu.ac.id"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Mail size={16} />
                okpp@uinsaizu.ac.id
              </a>
              <a
                href="tel:+622816356 24"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Phone size={16} />
                (0281) 635624
              </a>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.3849744147847!2d109.23618931477659!3d-7.417561994632857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e655c4b5bb7f5af%3A0x93b4ecf95d564b5e!2sUIN%20Prof.%20K.H.%20Saifuddin%20Zuhri%20Purwokerto!5e1!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid"
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-xl"
          ></iframe>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} VocabLab.io. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            Made with <Heart size={16} className="text-red-500 fill-red-500" /> by Vanza Serliana Arianto
          </p>
        </div>
      </div>
    </footer>
  );
}
