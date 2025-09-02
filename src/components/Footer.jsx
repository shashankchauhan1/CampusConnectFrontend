// client/src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 mt-auto">
      <div className="container mx-auto px-6 py-4 text-center border-t border-gray-700">
        <p>&copy; {new Date().getFullYear()} Campus Connect. All Rights Reserved.</p>
        <p className="text-sm">Made with ❤️ for connecting students.</p>
      </div>
    </footer>
  );
};

export default Footer;