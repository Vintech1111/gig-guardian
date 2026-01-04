import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { StepIndicator } from '@/components/flow/StepIndicator';
import { PlatformSelection } from '@/components/flow/PlatformSelection';
import { ServiceSelection } from '@/components/flow/ServiceSelection';
import { UserDetailsForm } from '@/components/flow/UserDetailsForm';
import { ProcessingAnimation } from '@/components/flow/ProcessingAnimation';
import { PricingSelection } from '@/components/flow/PricingSelection';
import { PaymentBridge } from '@/components/flow/PaymentBridge';
import { useFlow } from '@/contexts/FlowContext';

const Services = () => {
  const { state, setCurrentStep } = useFlow();
  const [showProcessing, setShowProcessing] = useState(false);

  const handleFormSubmit = () => {
    setShowProcessing(true);
  };

  const handleProcessingComplete = () => {
    setShowProcessing(false);
    setCurrentStep(4);
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <PlatformSelection />;
      case 2:
        return <ServiceSelection />;
      case 3:
        return <UserDetailsForm onSubmit={handleFormSubmit} />;
      case 4:
        return <PricingSelection />;
      case 5:
        return <PaymentBridge />;
      default:
        return <PlatformSelection />;
    }
  };

  if (showProcessing) {
    return <ProcessingAnimation onComplete={handleProcessingComplete} />;
  }

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <StepIndicator currentStep={state.currentStep} totalSteps={5} />
          <div className="mt-8">{renderStep()}</div>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
