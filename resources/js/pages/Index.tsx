
import { PassRequestForm } from "@/components/PassRequestForm";
import { PassPreview } from "@/components/PassPreview";

const Index = () => {
  const samplePass = {
    fullName: "John Doe",
    idNumber: "ID123456",
    department: "IT Security",
    status: "pending" as const,
    validUntil: "2024-12-31",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Pass Management System</h1>
            <p className="text-muted-foreground">
              Submit your pass request and track its approval status
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Request New Pass</h2>
              <PassRequestForm />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Pass Preview</h2>
              <PassPreview passData={samplePass} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
