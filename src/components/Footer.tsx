import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-lg flex items-center justify-center">AI</div>
            <span className="text-xl font-bold">AI Rehab PH</span>
          </div>
          <p className="text-gray-400 mb-4 max-w-md">Advanced AI-powered rehab connecting patients with healthcare professionals.</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <div className="space-y-2">
            <a className="block text-gray-400 hover:text-white" href="/assessment">Assessment Tool</a>
            <a className="block text-gray-400 hover:text-white" href="/exercises">Exercise Library</a>
            <a className="block text-gray-400 hover:text-white" href="/consultation">Book Consultation</a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <div className="space-y-2">
            <a className="block text-gray-400 hover:text-white">Help Center</a>
            <a className="block text-gray-400 hover:text-white">Contact Support</a>
            <a className="block text-gray-400 hover:text-white">Privacy Policy</a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>© 2025 AI Rehab PH. All rights reserved.</p>
      </div>
    </footer>
  );
}
