export const Footer = () => {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <footer className="py-2 text-center text-gray-600 bg-white border-t border-lavender-200">
          <p>&copy; 2025 CDP SDK. All rights reserved.</p>
          <p>
            By using this app, you agree to the{' '}
            <a
              href="https://www.coinbase.com/legal/cloud/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Terms of Service
            </a>
          </p>
          <p>
            <a
              href="https://www.coinbase.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Privacy Policy
            </a>
          </p>
        </footer>
      </div>
    );
  };