import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface StatusFilterProps {
    value: string;
    onChange: (value: string) => void;
}

export const StatusFilter = ({ value, onChange }: StatusFilterProps) => (
    <div className="w-full sm:w-48">
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all" className="dark:text-gray-300 dark:hover:bg-gray-700">All Statuses</SelectItem>
                <SelectItem value="pending" className="dark:text-gray-300 dark:hover:bg-gray-700">Pending</SelectItem>
                <SelectItem value="approved" className="dark:text-gray-300 dark:hover:bg-gray-700">Approved</SelectItem>
                <SelectItem value="rejected" className="dark:text-gray-300 dark:hover:bg-gray-700">Rejected</SelectItem>
            </SelectContent>
        </Select>
    </div>
);