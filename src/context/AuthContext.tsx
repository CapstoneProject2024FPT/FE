import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AuthContextProps {
  authUser: string | null;
  setAuthUser: React.Dispatch<React.SetStateAction<string | null>>;
}

interface AuthContextProviderProps {
  children: ReactNode;
}
export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [authUser, setAuthUser] = useState<string | null>(null);

  useEffect(() => {
    const loginInfoString = localStorage.getItem("loginInfo");
    const auth = loginInfoString ? JSON.parse(loginInfoString) : null;
    if (auth) {
      setAuthUser(auth.data.id);
    }
  }, [authUser]); // Empty depen

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
