// pages/PassDetails.tsx
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { PassPreview } from "../components/PassPreview";
import {
    Check,
    X,
    User,
    Clock,
    Building2,
    IdCard,
    Users,
    Calendar,
    Download,
    Eye,
    ImageIcon,
    FileText,
    FileIcon,
    History,
    MessageSquare,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { SidebarTrigger } from "../components/ui/sidebar";
import { Card, CardContent } from "../components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { VisitorPassService } from "../services/visitorPass.service";
import { ActivityService } from "../services/activity.service";
import { VisitorPass, Activity, WorkflowAction } from "../types/visitorPass";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";

const PassDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [pass, setPass] = useState<VisitorPass | null>(null);
    const [loading, setLoading] = useState(true);
    const [actions, setActions] = useState<WorkflowAction[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [comment, setComment] = useState("");
    const [statusNote, setStatusNote] = useState("");

    useEffect(() => {
        loadPass();
        loadActivities();
        loadAvailableActions();
    }, [id]);

    const loadPass = async () => {
        try {
            const passData = await VisitorPassService.getById(Number(id));
            setPass(passData);
        } catch (error) {
            handleError(error, "Failed to load pass details.");
        } finally {
            setLoading(false);
        }
    };

    const loadActivities = async () => {
        try {
            const history = await VisitorPassService.getWorkflowHistory(
                Number(id)
            );
            setActivities(history);
        } catch (error) {
            handleError(error, "Failed to load activities.");
        }
    };

    const loadAvailableActions = async () => {
        try {
            const response = await VisitorPassService.getAvailableActions(
                Number(id)
            );
            setActions(response.available_actions);
        } catch (error) {
            handleError(error, "Failed to load available actions.");
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            await VisitorPassService.updateStatus(Number(id), {
                status: newStatus as any,
                notes: statusNote,
            });

            toast({
                title: "Status Updated",
                description: `Pass status has been updated to ${newStatus}.`,
            });

            setStatusNote("");
            loadPass();
            loadActivities();
            loadAvailableActions();
        } catch (error) {
            handleError(error, "Failed to update status.");
        }
    };

    const handleAddComment = async () => {
        try {
            await ActivityService.addComment(Number(id), comment);
            setComment("");
            loadActivities();
            toast({
                title: "Comment Added",
                description: "Your comment has been added successfully.",
            });
        } catch (error) {
            handleError(error, "Failed to add comment.");
        }
    };

    const handleError = (error: any, defaultMessage: string) => {
        console.error(error);
        toast({
            title: "Error",
            description: error.response?.data?.message || defaultMessage,
            variant: "destructive",
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!pass) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-muted-foreground">Pass not found.</p>
                <Button className="mt-4" onClick={() => navigate("/passes")}>
                    Back to Passes
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header section remains the same */}

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="details">Pass Details</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <div className="grid gap-8">
                        <PassPreview passData={pass} />

                        {pass.files && pass.files.length > 0 && (
                            <Card className="shadow-lg dark:bg-gray-800">
                                {/* Files section remains the same */}
                            </Card>
                        )}

                        {actions.length > 0 && (
                            <Card className="shadow-lg dark:bg-gray-800">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Available Actions
                                    </h3>
                                    <div className="space-y-4">
                                        <Textarea
                                            placeholder="Add notes about this status change..."
                                            value={statusNote}
                                            onChange={(e) =>
                                                setStatusNote(e.target.value)
                                            }
                                            className="mb-4"
                                        />
                                        <div className="flex gap-3">
                                            {actions.map((action) => (
                                                <Button
                                                    key={action.action}
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            action
                                                                .available_statuses[0]
                                                        )
                                                    }
                                                    variant={
                                                        action.action ===
                                                        "reject"
                                                            ? "destructive"
                                                            : "default"
                                                    }
                                                >
                                                    {action.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="timeline">
                    <Card className="shadow-lg dark:bg-gray-800">
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">
                                        Add Comment
                                    </h3>
                                    <Textarea
                                        placeholder="Add a comment..."
                                        value={comment}
                                        onChange={(e) =>
                                            setComment(e.target.value)
                                        }
                                    />
                                    <Button onClick={handleAddComment}>
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Add Comment
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">
                                        Timeline
                                    </h3>
                                    <div className="space-y-4">
                                        {activities.map((activity) => (
                                            <div
                                                key={activity.id}
                                                className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                            >
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full h-fit">
                                                    <History className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium">
                                                        {activity.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        By {activity.user.name}{" "}
                                                        •{" "}
                                                        {
                                                            activity.formatted_date
                                                        }
                                                    </p>
                                                    {activity.metadata
                                                        .notes && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                                            {
                                                                activity
                                                                    .metadata
                                                                    .notes
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PassDetails;
