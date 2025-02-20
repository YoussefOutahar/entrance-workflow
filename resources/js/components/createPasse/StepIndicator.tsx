interface StepIndicatorProps {
    steps: string[];
    currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
    return (
        <div className="flex justify-center">
            <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                    <div key={step} className="flex items-center">
                        <div className={`
                flex items-center justify-center w-8 h-8 rounded-full 
                ${index + 1 <= currentStep
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}
              `}>
                            {index + 1}
                        </div>
                        <span className="ml-2 text-sm font-medium hidden sm:block">
                            {step}
                        </span>
                        {index < steps.length - 1 && (
                            <div className={`
                  w-12 h-1 ml-4
                  ${index + 1 < currentStep
                                    ? 'bg-purple-600'
                                    : 'bg-gray-200 dark:bg-gray-700'}
                `} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};