import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => (
    <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
        <Input
            placeholder="Search by visitor name, ID, or unit..."
            className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-500"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);