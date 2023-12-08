import { createContext, useContext, useState, useEffect } from 'react';
import { InlineCheckout } from "tonder-sdk-test";

const TonderContext = createContext();

export const useTonder = () => {
  return useContext(TonderContext);
};

export const TonderProvider = ({ children }) => {
  const [tonderInstance, setTonderInstance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const apiKey = import.meta.env.VITE_TONDER_API_KEY;
        const inlineCheckout = new InlineCheckout({
          apiKey: apiKey,
          returnUrl: window.location.href,
          renderPaymentButton: true,
        });
        setTonderInstance(inlineCheckout);
      } catch (error) {
        console.error("Error initializing Tonder:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return null
  }

  return (
    <TonderContext.Provider value={tonderInstance}>
      {children}
    </TonderContext.Provider>
  );
};

