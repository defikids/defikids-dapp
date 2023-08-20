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

export const steps = [
  {
    title: "Step 1",
    description: "Saving your avatar on IPFS",
  },
  { title: "Step 2", description: "Approve Wallet Transaction" },
  { title: "Step 3", description: "Processing Transaction" },
];

export const RegisterChildStepper = ({
  activeStep,
}: {
  activeStep: number;
}) => {
  return (
    <Stepper size="lg" index={activeStep} orientation="vertical">
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
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
