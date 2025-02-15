export interface User {
    id: string;
    email: string;
    name?: string;
    createdAt: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData extends LoginCredentials {
    email: string;
    name?: string;
    password: string;
  }
  
  export interface ApiError {
    message: string;
    statusCode?: number;
  }

  export interface Balance {
    total: number;
    currencies: CurrencyBalance[];
  }
  
  export interface CurrencyBalance {
    currency: string;
    amount: number;
    rate: number;
  }
  
  export interface Transaction {
    id: string;
    amount: number;
    currency: string;
    type: 'deposit' | 'withdrawal' | 'transfer';
    date: string;
    description: string;
  }