import { Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { StatusBadge } from "../StatusBadge";
import { VisitorPassTableItem } from "../../types/visitorPass";

interface PassCardProps {
    pass: VisitorPassTableItem;
}

export const PassCard = ({ pass }: PassCardProps) => (
    <Card className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-4">
                        <h3 className="text-lg font-semibold dark:text-gray-200">{pass.visitor_name}</h3>
                        <StatusBadge status={pass.status} />
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground dark:text-gray-400">
                        <span>ID: {pass.id_number}</span>
                        <span>Unit: {pass.unit}</span>
                        <span>Module: {pass.module}</span>
                        <span>Visit Date: {new Date(pass.visit_date).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm text-muted-foreground dark:text-gray-400 mt-2">
                        <span>Visiting: {pass.visited_person}</span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                    asChild
                >
                    <a href={`/pass/${pass.id}`}>
                        <Eye className="h-4 w-4" />
                        View Details
                    </a>
                </Button>
            </div>
        </CardContent>
    </Card>
);