import { useState } from "react";
import { Card } from "../components/ui/card";
import { PassRequestForm } from "../components/createPasse/PassRequestForm";
import { PassPreview } from "../components/PassPreview";
import { StepIndicator } from "../components/createPasse/StepIndicator";
import { FileUploadSection } from "../components/createPasse/FileUploadSection";
import { VisitorPassFormData } from "../types/visitorPass";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { VisitorPassService } from "../services/visitorPass.service";
import { ChevronLeft, ChevronRight, FileText, Save } from "lucide-react";

interface ValidationErrors {
    [key: string]: string[];
}

const CreatePass = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Partial<VisitorPassFormData>>({
        duration_type: "full_day",
    });
    const [files, setFiles] = useState<FileList | null>(null);
    const [formErrors, setFormErrors] = useState<ValidationErrors>({});

    const handleFormUpdate = (data: Partial<VisitorPassFormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
        if (formErrors) {
            const updatedErrors = { ...formErrors };
            Object.keys(data).forEach((key) => {
                delete updatedErrors[key];
            });
            setFormErrors(updatedErrors);
        }
    };

    const canProceedToNextStep = (): boolean => {
        if (currentStep === 1) {
            const requiredFields = [
                "visitor_name",
                "id_number",
                "visited_person",
                "visit_date",
                "unit",
                "module",
                "visit_purpose",
                "category",
            ];

            const missingFields = requiredFields.filter(
                (field) => !formData[field as keyof VisitorPassFormData]
            );

            const hasAllRequiredFields = missingFields.length === 0;
            const hasDurationDays =
                formData.duration_type === "custom"
                    ? formData.duration_days && formData.duration_days <= 5
                    : true;

            return hasAllRequiredFields && hasDurationDays;
        }
        return true;
    };

    const handleSubmit = async () => {
        try {
            const response = await VisitorPassService.create(
                formData as VisitorPassFormData,
                files
            );
            toast({
                title: "Success",
                description: "Pass request submitted successfully.",
            });
            navigate(`/pass/${response.id}`);
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setFormErrors(error.response.data.errors);
                if (
                    Object.keys(error.response.data.errors).some((field) =>
                        field.startsWith("files")
                    )
                ) {
                    setCurrentStep(2);
                } else {
                    setCurrentStep(1);
                }
            }
            toast({
                title: "Error",
                description:
                    error.response?.data?.message ||
                    "Failed to submit pass request.",
                variant: "destructive",
            });
        }
    };

    const handleNextStep = () => {
        const canProceed = canProceedToNextStep();

        if (canProceed) {
            setCurrentStep((prev) => Math.min(3, prev + 1));
        } else {
            const missingFields = [
                "visitor_name",
                "id_number",
                "visited_person",
                "visit_date",
                "unit",
                "module",
                "visit_purpose",
                "category",
            ].filter((field) => !formData[field as keyof VisitorPassFormData]);

            toast({
                title: "Missing Information",
                description: `Please fill in all required fields`,
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                        Create New Pass
                    </h1>
                    <p className="text-muted-foreground">
                        Fill in the required information to request a new
                        visitor pass
                    </p>
                </div>

                <StepIndicator
                    currentStep={currentStep}
                    steps={[
                        "Basic Information",
                        "Supporting Documents",
                        "Review",
                    ]}
                />

                <div className="space-y-6">
                    <Card className="p-6">
                        {currentStep === 1 && (
                            <PassRequestForm
                                formData={formData}
                                onUpdate={handleFormUpdate}
                                errors={formErrors}
                            />
                        )}
                        {currentStep === 2 && (
                            <FileUploadSection
                                files={files}
                                onFilesChange={setFiles}
                                errors={formErrors}
                            />
                        )}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Review Your Request
                                </h3>
                                <PassPreview passData={formData} />
                                {files && files.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium mb-2">
                                            Attached Documents
                                        </h4>
                                        <div className="text-sm text-gray-500">
                                            {Array.from(files).map(
                                                (file, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                        <span>{file.name}</span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>

                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={() =>
                                setCurrentStep((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentStep === 1}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Previous
                        </Button>

                        {currentStep < 3 ? (
                            <Button
                                onClick={handleNextStep}
                                className="bg-gradient-to-r from-purple-600 to-blue-600"
                            >
                                Next
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                className="bg-gradient-to-r from-purple-600 to-blue-600"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Submit Request
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePass;
