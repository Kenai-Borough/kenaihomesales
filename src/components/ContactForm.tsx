import { useState } from 'react';
import { siteConfig } from '../lib/config';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to a backend
    alert('Thank you for your inquiry! We will contact you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div id="contact" className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Contact Us
        </h2>
        
        <div className="mb-8 text-center">
          <p className="text-gray-600 mb-4">
            Ready to find your perfect property or have questions? Get in touch with us!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-lg">
            <a href={`tel:${siteConfig.phone}`} className="text-alaska-blue hover:text-alaska-blue-light">
              📞 {siteConfig.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="text-alaska-blue hover:text-alaska-blue-light">
              ✉️ {siteConfig.email}
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alaska-blue focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alaska-blue focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alaska-blue focus:border-transparent"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alaska-blue focus:border-transparent"
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="w-full bg-alaska-blue text-white py-3 rounded-lg font-semibold hover:bg-alaska-blue-light transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
