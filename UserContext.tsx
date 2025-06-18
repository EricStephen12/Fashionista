import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define user roles
export type UserRole = 'customer' | 'designer' | 'admin';

// Define verification status
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

// Define designer profile type
interface DesignerProfile {
  brandName?: string;
  bio?: string;
  specialization?: string;
  yearsExperience?: string;
  portfolioImages?: string[];
  taxIdNumber?: string;
  taxIdType?: 'ssn' | 'tin';
  governmentIdType?: 'national_id' | 'passport' | 'drivers_license';
  governmentIdImage?: string;
  verificationStatus: VerificationStatus;
  submissionDate?: Date;
}

// Define user object type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  // Designer specific fields
  brandName?: string;
  bio?: string;
  verificationStatus?: VerificationStatus;
  verificationDate?: Date;
  verificationNotes?: string;
  // Admin assigned fields
  featured?: boolean;
  designerTier?: 'standard' | 'premium' | 'exclusive';
  // Customer specific fields
  shippingAddresses?: Array<any>;
  paymentMethods?: Array<any>;
  designerProfile?: DesignerProfile;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoggedIn: boolean;
  logout: () => void;
  isDesigner: boolean;
  isVerifiedDesigner: boolean;
  isPendingVerification: boolean;
  isRejectedVerification: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const logout = () => {
    console.log('[UserContext] Logging out...');
    setUser(null);
  };
  
  const isLoggedIn = user !== null;
  const isDesigner = user?.role === 'designer';
  const isVerifiedDesigner = isDesigner && user?.verificationStatus === 'verified';
  const isPendingVerification = isDesigner && user?.verificationStatus === 'pending';
  const isRejectedVerification = isDesigner && user?.verificationStatus === 'rejected';
  
  return (
    <UserContext.Provider 
      value={{ 
        user, 
        setUser, 
        isLoggedIn, 
        logout, 
        isDesigner, 
        isVerifiedDesigner,
        isPendingVerification,
        isRejectedVerification
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 