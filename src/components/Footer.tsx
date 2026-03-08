export const Footer = () => {
  return (
    <footer className="py-6 mt-auto border-t border-gray-100 bg-white/50">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Backlog. All rights reserved.
        </p>
        <p className="text-xs text-gray-300 mt-1">
          Designed with ❤️ using React & Tailwind
        </p>
      </div>
    </footer>
  );
};
