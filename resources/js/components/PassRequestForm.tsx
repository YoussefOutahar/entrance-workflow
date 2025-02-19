
import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "../hooks/use-toast";

interface PassRequest {
  fullName: string;
  idNumber: string;
  department: string;
  purpose: string;
}

export const PassRequestForm = () => {
  const [formData, setFormData] = useState<PassRequest>({
    fullName: "",
    idNumber: "",
    department: "",
    purpose: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to a backend
    toast({
      title: "Pass Request Submitted",
      description: "Your request has been sent for approval.",
    });
  };

  return (
    <Card className="w-full max-w-md p-6 animate-slideIn">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="transition-all duration-200 focus:ring-2"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="idNumber">ID Number</Label>
          <Input
            id="idNumber"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            className="transition-all duration-200 focus:ring-2"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="transition-all duration-200 focus:ring-2"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose of Visit</Label>
          <Input
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="transition-all duration-200 focus:ring-2"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full transition-all duration-200 hover:scale-[1.02]"
        >
          Submit Request
        </Button>
      </form>
    </Card>
  );
};
