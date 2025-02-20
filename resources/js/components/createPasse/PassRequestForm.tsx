// components/PassRequestForm.tsx
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { VisitorPassFormData } from "../../types/visitorPass";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface PassRequestFormProps {
  formData: Partial<VisitorPassFormData>;
  onUpdate: (data: Partial<VisitorPassFormData>) => void;
  errors: {
    [key: string]: string[];
  };
}

interface ValidationErrors {
  [key: string]: string;
}

export const PassRequestForm = ({ formData, onUpdate, errors: serverErrors }: PassRequestFormProps) => {
  const [date, setDate] = useState<Date>();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (name: string, value: any) => {
    const newErrors: ValidationErrors = { ...errors };
    
    switch (name) {
      case 'visit_date':
        if (!value) {
          newErrors.visit_date = 'Visit date is required';
        }
        break;

      case 'visited_person':
      case 'unit':
      case 'module':
      case 'visitor_name':
      case 'id_number':
      case 'visit_purpose':
        if (!value || value.trim() === '') {
          newErrors[name] = `${name.replace('_', ' ').charAt(0).toUpperCase() + name.slice(1)} is required`;
        }
        break;

      case 'duration_days':
        if (formData.duration_type === 'custom') {
          if (!value) {
            newErrors.duration_days = 'Duration days is required for custom duration';
          } else if (value > 5) {
            newErrors.duration_days = 'Duration days must not exceed 5 days';
          }
        }
        break;

      case 'category':
        if (!value) {
          newErrors.category = 'Category is required';
        } else if (!['S-T', 'Ch', 'E'].includes(value)) {
          newErrors.category = 'Invalid category selected';
        }
        break;

      default:
        break;
    }

    if (!newErrors[name]) {
      delete newErrors[name];
    }

    setErrors(newErrors);
  };

  const handleFieldChange = (name: string, value: any) => {
    onUpdate({ [name]: value });
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      handleFieldChange('visit_date', format(date, 'yyyy-MM-dd'));
    }
  };

  const handleBlur = (name: string) => {
    setTouched({ ...touched, [name]: true });
    validateField(name, formData[name as keyof VisitorPassFormData]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="visitor_name">Visitor Name *</Label>
          <Input
            id="visitor_name"
            value={formData.visitor_name || ''}
            onChange={(e) => handleFieldChange('visitor_name', e.target.value)}
            onBlur={() => handleBlur('visitor_name')}
            placeholder="Enter visitor name"
            className={
              (errors.visitor_name || serverErrors?.visitor_name) && touched.visitor_name 
                ? 'border-red-500' 
                : ''
            }
          />
          {(errors.visitor_name || serverErrors?.visitor_name?.[0]) && touched.visitor_name && (
            <p className="text-sm text-red-500">
              {errors.visitor_name || serverErrors.visitor_name[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="id_number">ID Number *</Label>
          <Input
            id="id_number"
            value={formData.id_number || ''}
            onChange={(e) => handleFieldChange('id_number', e.target.value)}
            onBlur={() => handleBlur('id_number')}
            placeholder="Enter ID number"
            className={
              (errors.id_number || serverErrors?.id_number) && touched.id_number 
                ? 'border-red-500' 
                : ''
            }
          />
          {(errors.id_number || serverErrors?.id_number?.[0]) && touched.id_number && (
            <p className="text-sm text-red-500">
              {errors.id_number || serverErrors.id_number[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="visited_person">Person to Visit *</Label>
          <Input
            id="visited_person"
            value={formData.visited_person || ''}
            onChange={(e) => handleFieldChange('visited_person', e.target.value)}
            onBlur={() => handleBlur('visited_person')}
            placeholder="Enter person to visit"
            className={
              (errors.visited_person || serverErrors?.visited_person) && touched.visited_person 
                ? 'border-red-500' 
                : ''
            }
          />
          {(errors.visited_person || serverErrors?.visited_person?.[0]) && touched.visited_person && (
            <p className="text-sm text-red-500">
              {errors.visited_person || serverErrors.visited_person[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="visit_date">Visit Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  (errors.visit_date || serverErrors?.visit_date) && touched.visit_date 
                    ? 'border-red-500' 
                    : ''
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {(errors.visit_date || serverErrors?.visit_date?.[0]) && touched.visit_date && (
            <p className="text-sm text-red-500">
              {errors.visit_date || serverErrors.visit_date[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit *</Label>
          <Input
            id="unit"
            value={formData.unit || ''}
            onChange={(e) => handleFieldChange('unit', e.target.value)}
            onBlur={() => handleBlur('unit')}
            placeholder="Enter unit"
            className={
              (errors.unit || serverErrors?.unit) && touched.unit 
                ? 'border-red-500' 
                : ''
            }
          />
          {(errors.unit || serverErrors?.unit?.[0]) && touched.unit && (
            <p className="text-sm text-red-500">
              {errors.unit || serverErrors.unit[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="module">Module *</Label>
          <Input
            id="module"
            value={formData.module || ''}
            onChange={(e) => handleFieldChange('module', e.target.value)}
            onBlur={() => handleBlur('module')}
            placeholder="Enter module"
            className={
              (errors.module || serverErrors?.module) && touched.module 
                ? 'border-red-500' 
                : ''
            }
          />
          {(errors.module || serverErrors?.module?.[0]) && touched.module && (
            <p className="text-sm text-red-500">
              {errors.module || serverErrors.module[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleFieldChange('category', value)}
          >
            <SelectTrigger 
              className={
                (errors.category || serverErrors?.category) && touched.category 
                  ? 'border-red-500' 
                  : ''
              }
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="S-T">S-T</SelectItem>
              <SelectItem value="Ch">Ch</SelectItem>
              <SelectItem value="E">E</SelectItem>
            </SelectContent>
          </Select>
          {(errors.category || serverErrors?.category?.[0]) && touched.category && (
            <p className="text-sm text-red-500">
              {errors.category || serverErrors.category[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration_type">Duration Type *</Label>
          <Select
            value={formData.duration_type}
            onValueChange={(value: 'full_day' | 'custom') => handleFieldChange('duration_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_day">Full Day</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.duration_type === 'custom' && (
          <div className="space-y-2">
            <Label htmlFor="duration_days">Number of Days *</Label>
            <Input
              id="duration_days"
              type="number"
              min="1"
              max="5"
              value={formData.duration_days || ''}
              onChange={(e) => handleFieldChange('duration_days', parseInt(e.target.value))}
              onBlur={() => handleBlur('duration_days')}
              placeholder="Enter number of days (max 5)"
              className={
                (errors.duration_days || serverErrors?.duration_days) && touched.duration_days 
                  ? 'border-red-500' 
                  : ''
              }
            />
            {(errors.duration_days || serverErrors?.duration_days?.[0]) && touched.duration_days && (
              <p className="text-sm text-red-500">
                {errors.duration_days || serverErrors.duration_days[0]}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2 col-span-2">
          <Label htmlFor="visit_purpose">Visit Purpose *</Label>
          <textarea
            id="visit_purpose"
            className={`w-full min-h-[100px] p-3 rounded-md border border-input bg-background ${
              (errors.visit_purpose || serverErrors?.visit_purpose) && touched.visit_purpose 
                ? 'border-red-500' 
                : ''
            }`}
            value={formData.visit_purpose || ''}
            onChange={(e) => handleFieldChange('visit_purpose', e.target.value)}
            onBlur={() => handleBlur('visit_purpose')}
            placeholder="Enter visit purpose"
          />
          {(errors.visit_purpose || serverErrors?.visit_purpose?.[0]) && touched.visit_purpose && (
            <p className="text-sm text-red-500">
              {errors.visit_purpose || serverErrors.visit_purpose[0]}
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500">* Required fields</p>
    </div>
  );
};