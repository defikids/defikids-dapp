import {
  Box,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Spinner,
} from "@chakra-ui/react";
import { StepperContext } from "@/data-schema/enums";

export const steps = (context: StepperContext) => {
  if (context === StepperContext.AVATAR) {
    return [
      {
        title: "Saving your avatar on IPFS",
      },
    ];
  }

  if (context === StepperContext.PERMIT) {
    return [
      {
        title: "Step 1: Signing Permit Approval",
        description: "Permit DefiKids to spend USDC",
      },
      { title: "Step 2:", description: "Approve Wallet Transaction" },
      {
        title: "Step 3: Processing Transaction",
        description: "Processing Transaction",
      },
    ];
  }

  if (context === StepperContext.DEFAULT) {
    return [
      { title: "Step 1", description: "Approve Wallet Transaction" },
      { title: "Step 2", description: "Processing Transaction" },
    ];
  }

  return [];
};

export const TransactionStepper = ({
  activeStep,
  context,
}: {
  activeStep: number;
  context: StepperContext;
}) => {
  return (
    <Stepper size="lg" index={activeStep} orientation="vertical">
      {steps(context).map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete=""
              active={
                <Spinner speed=".9s" emptyColor="gray.200" color="blue.500" />
              }
            />
          </StepIndicator>

          <Box flexShrink="0">
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
};
