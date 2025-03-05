// pages/PassDetails.tsx
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { PassPreview } from "../components/PassPreview";
import {
    Check,
    X,
    Download,
    Eye,
    ImageIcon,
    FileText,
    FileIcon,
    History,
    MessageSquare,
    Loader2,
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
import { WorkflowStatus } from "../components/WorkflowStatus";

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

    // Add loading states for different actions
    const [statusUpdateLoading, setStatusUpdateLoading] = useState<
        string | null
    >(null);
    const [commentLoading, setCommentLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadPass();
        loadActivities();
        loadAvailableActions();
    }, [id]);

    const loadPass = async () => {
        try {
            setLoading(true);
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
            const timelineData = await ActivityService.getVisitorPassTimeline(
                Number(id)
            );
            setActivities(timelineData);
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

    const refreshData = async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                loadPass(),
                loadActivities(),
                loadAvailableActions(),
            ]);
            toast({
                title: "Refreshed",
                description: "Pass data has been refreshed",
                duration: 2000,
            });
        } catch (error) {
            // Error already handled in individual load functions
        } finally {
            setRefreshing(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            setStatusUpdateLoading(newStatus);
            await VisitorPassService.updateStatus(Number(id), {
                status: newStatus as any,
                notes: statusNote,
            });

            const statusLabels: Record<string, string> = {
                awaiting: "Awaiting",
                pending_chef: "Pending Chef Approval",
                started: "Service des Permis Review",
                in_progress: "Ready for Final Approval",
                accepted: "Approved",
                declined: "Rejected",
            };

            toast({
                title: "Status Updated",
                description: `Pass status has been updated to ${
                    statusLabels[newStatus] || newStatus
                }.`,
            });

            setStatusNote("");
            await Promise.all([
                loadPass(),
                loadActivities(),
                loadAvailableActions(),
            ]);
        } catch (error) {
            handleError(error, "Failed to update status.");
        } finally {
            setStatusUpdateLoading(null);
        }
    };

    const handleAddComment = async () => {
        if (!comment.trim()) {
            toast({
                title: "Comment Required",
                description: "Please enter a comment before submitting.",
                variant: "destructive",
            });
            return;
        }

        try {
            setCommentLoading(true);
            await ActivityService.addComment(Number(id), comment);
            setComment("");
            await loadActivities();
            toast({
                title: "Comment Added",
                description: "Your comment has been added successfully.",
            });
        } catch (error) {
            handleError(error, "Failed to add comment.");
        } finally {
            setCommentLoading(false);
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
            <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
                <p className="text-gray-500">Loading pass details...</p>
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

    // Get a user-friendly description of the current status
    const getStatusDescription = (status: string) => {
        switch (status) {
            case "awaiting":
                return "This pass is awaiting submission to a department chef.";
            case "pending_chef":
                return "This pass is pending approval from the department chef.";
            case "started":
                return "This pass has been approved by a chef and is being reviewed by Service des Permis.";
            case "in_progress":
                return "This pass has been reviewed by Service des Permis and is ready for final approval by Barrière or Gendarmerie.";
            case "accepted":
                return "This pass has been fully approved by Barrière or Gendarmerie.";
            case "declined":
                return "This pass has been rejected.";
            default:
                return "";
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Pass Details</h1>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={refreshData}
                        disabled={refreshing}
                    >
                        {refreshing ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Refreshing...
                            </>
                        ) : (
                            "Refresh"
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => navigate("/passes")}
                    >
                        Back to List
                    </Button>
                    <SidebarTrigger />
                </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="details">Pass Details</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <div className="grid gap-8">
                        <PassPreview passData={pass} />

                        {/* Workflow Status Card */}
                        <Card className="shadow-lg dark:bg-gray-800">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <History className="h-5 w-5 text-purple-600" />
                                    <h3 className="text-lg font-semibold">
                                        Workflow Status
                                    </h3>
                                </div>
                                <WorkflowStatus currentStatus={pass.status} />
                                <p className="text-gray-600 dark:text-gray-300 mt-4">
                                    {getStatusDescription(pass.status)}
                                </p>
                                {pass.status === "declined" && (
                                    <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
                                        <X className="h-5 w-5" />
                                        <p>This pass has been rejected.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {pass.files && pass.files.length > 0 && (
                            <Card className="shadow-lg dark:bg-gray-800">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FileIcon className="h-5 w-5 text-purple-600" />
                                        <h3 className="text-lg font-semibold">
                                            Attached Files
                                        </h3>
                                    </div>
                                    <div className="grid gap-3">
                                        {pass.files.map((file) => (
                                            <div
                                                key={file.id}
                                                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {file.type.includes(
                                                        "image"
                                                    ) ? (
                                                        <ImageIcon className="h-5 w-5 text-blue-600" />
                                                    ) : (
                                                        <FileText className="h-5 w-5 text-amber-600" />
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-sm">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {(
                                                                file.size / 1024
                                                            ).toFixed(2)}{" "}
                                                            KB
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            window.open(
                                                                file.url,
                                                                "_blank"
                                                            );
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            const link =
                                                                document.createElement(
                                                                    "a"
                                                                );
                                                            link.href =
                                                                file.url;
                                                            link.download =
                                                                file.name;
                                                            link.click();
                                                        }}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
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
                                        <div className="flex flex-wrap gap-3">
                                            {actions.map((action) => {
                                                const newStatus =
                                                    action
                                                        .available_statuses[0];
                                                const isLoading =
                                                    statusUpdateLoading ===
                                                    newStatus;
                                                return (
                                                    <Button
                                                        key={action.action}
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                newStatus
                                                            )
                                                        }
                                                        variant={
                                                            action.action ===
                                                            "reject"
                                                                ? "destructive"
                                                                : action.action.includes(
                                                                      "approve"
                                                                  )
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                        disabled={
                                                            isLoading ||
                                                            !!statusUpdateLoading
                                                        }
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                Processing...
                                                            </>
                                                        ) : (
                                                            <>
                                                                {action.action ===
                                                                    "reject" && (
                                                                    <X className="h-4 w-4 mr-2" />
                                                                )}
                                                                {action.action.includes(
                                                                    "approve"
                                                                ) && (
                                                                    <Check className="h-4 w-4 mr-2" />
                                                                )}
                                                                {action.label}
                                                            </>
                                                        )}
                                                    </Button>
                                                );
                                            })}
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
                                        disabled={commentLoading}
                                    />
                                    <Button
                                        onClick={handleAddComment}
                                        disabled={
                                            commentLoading || !comment.trim()
                                        }
                                    >
                                        {commentLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Adding Comment...
                                            </>
                                        ) : (
                                            <>
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Add Comment
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">
                                        Timeline
                                    </h3>
                                    <div className="space-y-4">
                                        {activities.length > 0 ? (
                                            activities.map((activity) => (
                                                <div
                                                    key={activity.id}
                                                    className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                                >
                                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full h-fit">
                                                        {activity.type ===
                                                        "comment" ? (
                                                            <MessageSquare className="h-4 w-4 text-blue-600" />
                                                        ) : (
                                                            <History className="h-4 w-4 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <div className="space-y-1 flex-grow">
                                                        <p className="text-sm font-medium">
                                                            {activity.message}
                                                        </p>
                                                        <div className="flex items-center text-xs text-gray-500">
                                                            <span>
                                                                By{" "}
                                                                {
                                                                    activity
                                                                        .user
                                                                        .name
                                                                }
                                                            </span>
                                                            {activity.metadata
                                                                ?.user_group && (
                                                                <>
                                                                    <span className="mx-1">
                                                                        •
                                                                    </span>
                                                                    <span>
                                                                        {
                                                                            activity
                                                                                .metadata
                                                                                .user_group
                                                                        }
                                                                    </span>
                                                                </>
                                                            )}
                                                            <span className="mx-1">
                                                                •
                                                            </span>
                                                            <span>
                                                                {
                                                                    activity.formatted_date
                                                                }
                                                            </span>
                                                        </div>
                                                        {activity.type ===
                                                            "comment" &&
                                                        activity.metadata
                                                            ?.comment ? (
                                                            <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-600 rounded text-sm">
                                                                {
                                                                    activity
                                                                        .metadata
                                                                        .comment
                                                                }
                                                            </div>
                                                        ) : activity.metadata
                                                              ?.notes ? (
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded">
                                                                {
                                                                    activity
                                                                        .metadata
                                                                        .notes
                                                                }
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                                No activity recorded yet.
                                            </p>
                                        )}
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
