import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserDetails {
  fullName: string;
  email: string;
  accountDetails: string;
  location: string;
}

interface FlowState {
  currentStep: number;
  selectedPlatform: string | null;
  selectedService: string | null;
  userDetails: UserDetails | null;
}

interface FlowContextType {
  state: FlowState;
  setCurrentStep: (step: number) => void;
  selectPlatform: (platformId: string) => void;
  selectService: (serviceId: string) => void;
  setUserDetails: (details: UserDetails) => void;
  resetFlow: () => void;
}

const initialState: FlowState = {
  currentStep: 1,
  selectedPlatform: null,
  selectedService: null,
  userDetails: null,
};

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FlowState>(initialState);

  const setCurrentStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const selectPlatform = (platformId: string) => {
    setState(prev => ({ ...prev, selectedPlatform: platformId, currentStep: 2 }));
  };

  const selectService = (serviceId: string) => {
    setState(prev => ({ ...prev, selectedService: serviceId, currentStep: 3 }));
  };

  const setUserDetails = (details: UserDetails) => {
    setState(prev => ({ ...prev, userDetails: details }));
  };

  const resetFlow = () => {
    setState(initialState);
  };

  return (
    <FlowContext.Provider
      value={{
        state,
        setCurrentStep,
        selectPlatform,
        selectService,
        setUserDetails,
        resetFlow,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export function useFlow() {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
}
