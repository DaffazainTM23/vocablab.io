import { useState } from 'react';
import { Mail, Phone, MessageSquare, Send } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const whatsappMessage = `Hello VocabLab! 👋\n\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`;
    const whatsappUrl = `https://wa.me/628888280205?text=${encodeURIComponent(whatsappMessage)}`;

    const emailSubject = `VocabLab Inquiry - ${formData.subject}`;
    const emailBody = `Hello VocabLab Team,\n\nI hope this message finds you well.\n\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}\n\nBest regards,\n${formData.name}`;
    const emailUrl = `mailto:234110404072@mhs.uinsaizu.ac.id?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    window.open(whatsappUrl, '_blank');
    setTimeout(() => {
      window.open(emailUrl, '_blank');
    }, 500);

    setFormData({ name: '', email: '', subject: '', message: '' });

    alert('Your message has been sent via WhatsApp and Email!');
  };

  const sendViaWhatsApp = () => {
    const message = `Hello VocabLab! 👋\n\nName: ${formData.name}\nEmail: ${formData.email || 'Not provided'}\nSubject: ${formData.subject || 'General Inquiry'}\n\nMessage:\n${formData.message || 'I would like to know more about VocabLab.'}`;
    const url = `https://wa.me/628888280205?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const sendViaEmail = () => {
    const subject = `VocabLab Inquiry - ${formData.subject || 'General Inquiry'}`;
    const body = `Hello VocabLab Team,\n\nI hope this message finds you well.\n\nName: ${formData.name}\nEmail: ${formData.email || 'Not provided'}\nSubject: ${formData.subject || 'General Inquiry'}\n\nMessage:\n${formData.message || 'I would like to know more about VocabLab and its features.'}\n\nBest regards,\n${formData.name}`;
    const url = `mailto:234110404072@mhs.uinsaizu.ac.id?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Have questions or suggestions? Reach out to us using the form below
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <a
            href="https://wa.me/628888280205"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card-light p-6 text-center hover:scale-105 transition-transform"
          >
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 mb-4">
              <Phone className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              WhatsApp
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              Chat with us
            </p>
            <p className="text-primary-500 font-semibold">
              +62 888-8280-205
            </p>
          </a>

          <a
            href="mailto:234110404072@mhs.uinsaizu.ac.id"
            className="glass-card-light p-6 text-center hover:scale-105 transition-transform"
          >
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-4">
              <Mail className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Email
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              Send us an email
            </p>
            <p className="text-primary-500 font-semibold text-sm break-all">
              234110404072@mhs.uinsaizu.ac.id
            </p>
          </a>

          <div className="glass-card-light p-6 text-center">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
              <MessageSquare className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Response Time
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              We will respond within
            </p>
            <p className="text-primary-500 font-semibold">
              24 Hours
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="glass-card-light p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell us more..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={sendViaWhatsApp}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Phone size={20} />
                  Send via WhatsApp
                </button>

                <button
                  type="button"
                  onClick={sendViaEmail}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Mail size={20} />
                  Send via Email
                </button>

                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Submit Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
