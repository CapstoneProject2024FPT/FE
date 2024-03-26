import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextProps {
  authUser: string | null;
  setAuthUser: React.Dispatch<React.SetStateAction<string | null>>;
}

interface AuthContextProviderProps {
  children: ReactNode;
}
interface tokenApi {
  id: string;
  exp: Date;
  iat: Date;
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
    const auth = JSON.parse(localStorage.getItem("LoginInfo") || "null");
    if (auth) {
      const authen = jwtDecode<tokenApi>(auth.token);

      setAuthUser(authen.id);
    }
  }, [authUser]); // Empty depen

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
