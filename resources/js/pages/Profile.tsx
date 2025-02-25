// src/pages/Profile/index.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    User,
    Mail,
    Phone,
    Building,
    MapPin,
    Briefcase,
    Key,
    Shield,
    CheckCircle,
    XCircle,
    Save,
    RefreshCw,
    Camera,
    LockKeyhole,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { authStorage } from "../services/LocalStorage/AuthStorage";
import { userService } from "../services/user.service";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProfileFormData {
    username: string;
    email: string;
    display_name: string;
    given_name: string;
    surname: string;
    department?: string;
    title?: string;
    office_phone?: string;
    mobile_phone?: string;
    office_location?: string;
}

interface PasswordFormData {
    current_password: string;
    password: string;
    password_confirmation: string;
}

interface TwoFactorDialogState {
    isOpen: boolean;
    qrCode?: string;
    secret?: string;
    step: "enable" | "confirm" | "success";
}

const Profile = () => {
    const { toast } = useToast();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [roles, setRoles] = useState<string[]>([]);
    const [groups, setGroups] = useState<string[]>([]);
    const [twoFactorDialog, setTwoFactorDialog] =
        useState<TwoFactorDialogState>({
            isOpen: false,
            step: "enable",
        });
    const [confirmationCode, setConfirmationCode] = useState("");
    const [isConfirming2FA, setIsConfirming2FA] = useState(false);
    const [isDisabling2FA, setIsDisabling2FA] = useState(false);

    // Calculate password strength
    const [passwordStrength, setPasswordStrength] = useState(0);

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        setValue,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormData>();

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPassword,
        watch,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormData>();

    // Monitor password for strength calculation
    const watchPassword = watch("password", "");

    useEffect(() => {
        // Calculate password strength
        const calculatePasswordStrength = (password: string) => {
            if (!password) return 0;

            let strength = 0;

            // Length
            if (password.length >= 8) strength += 20;

            // Has lowercase
            if (/[a-z]/.test(password)) strength += 20;

            // Has uppercase
            if (/[A-Z]/.test(password)) strength += 20;

            // Has number
            if (/\d/.test(password)) strength += 20;

            // Has special char
            if (/[^A-Za-z0-9]/.test(password)) strength += 20;

            return strength;
        };

        setPasswordStrength(calculatePasswordStrength(watchPassword));
    }, [watchPassword]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await userService.getUserProfile();
                const userData = response.data.data.user;
                setUser(userData);

                // Extract roles and groups
                if (userData.roles) {
                    setRoles(userData.roles.map((role: any) => role.name));
                }
                if (userData.groups) {
                    setGroups(userData.groups.map((group: any) => group.name));
                }

                // Set form values
                Object.keys(userData).forEach((key) => {
                    if (
                        key in
                        {
                            username: "",
                            email: "",
                            display_name: "",
                            given_name: "",
                            surname: "",
                            department: "",
                            title: "",
                            office_phone: "",
                            mobile_phone: "",
                            office_location: "",
                        }
                    ) {
                        setValue(key as keyof ProfileFormData, userData[key]);
                    }
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast({
                    title: "Error",
                    description:
                        "Could not load profile data. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [setValue, toast]);

    const onProfileSubmit = async (data: ProfileFormData) => {
        try {
            setSaving(true);
            await userService.updateUserProfile(user.id, data);
            toast({
                title: "Profile Updated",
                description: "Your profile has been updated successfully.",
            });

            // Update local storage user data
            const updatedUser = { ...user, ...data };
            authStorage.setUser(updatedUser);
            setUser(updatedUser);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                title: "Update Failed",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const onPasswordSubmit = async (data: PasswordFormData) => {
        try {
            setChangingPassword(true);
            await userService.changePassword(user.id, data);
            toast({
                title: "Password Changed",
                description: "Your password has been changed successfully.",
            });
            resetPassword();
        } catch (error: any) {
            console.error("Error changing password:", error);
            toast({
                title: "Password Change Failed",
                description:
                    error.response?.data?.message ||
                    "Failed to change password. Please try again.",
                variant: "destructive",
            });
        } finally {
            setChangingPassword(false);
        }
    };

    const handleEnable2FA = async () => {
        try {
            const response = await userService.toggleTwoFactorAuth(true);
            setTwoFactorDialog({
                isOpen: true,
                qrCode: response.data.qr_code,
                secret: response.data.secret,
                step: "confirm",
            });
        } catch (error) {
            console.error("Error enabling 2FA:", error);
            toast({
                title: "Error",
                description: "Could not enable two-factor authentication.",
                variant: "destructive",
            });
        }
    };

    const handleConfirm2FA = async () => {
        try {
            setIsConfirming2FA(true);
            await userService.confirmTwoFactorAuth(confirmationCode);

            // Update user data
            const updatedUser = { ...user, two_factor_enabled: true };
            setUser(updatedUser);
            authStorage.setUser(updatedUser);

            setTwoFactorDialog({
                ...twoFactorDialog,
                step: "success",
            });

            toast({
                title: "Success",
                description: "Two-factor authentication has been enabled.",
            });
        } catch (error) {
            console.error("Error confirming 2FA:", error);
            toast({
                title: "Error",
                description: "Invalid verification code. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsConfirming2FA(false);
        }
    };

    const handleDisable2FA = async () => {
        try {
            setIsDisabling2FA(true);
            await userService.toggleTwoFactorAuth(false);

            // Update user data
            const updatedUser = { ...user, two_factor_enabled: false };
            setUser(updatedUser);
            authStorage.setUser(updatedUser);

            toast({
                title: "Success",
                description: "Two-factor authentication has been disabled.",
            });
        } catch (error) {
            console.error("Error disabling 2FA:", error);
            toast({
                title: "Error",
                description: "Could not disable two-factor authentication.",
                variant: "destructive",
            });
        } finally {
            setIsDisabling2FA(false);
        }
    };

    const getPasswordStrengthLabel = () => {
        if (passwordStrength === 0) return "";
        if (passwordStrength <= 40) return "Weak";
        if (passwordStrength <= 80) return "Medium";
        return "Strong";
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength === 0) return "bg-gray-200 dark:bg-gray-700";
        if (passwordStrength <= 40) return "bg-red-500";
        if (passwordStrength <= 80) return "bg-yellow-500";
        return "bg-green-500";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">User Profile</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Manage your account information and settings
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge
                        variant={user?.is_active ? "default" : "destructive"}
                        className="px-3 py-1"
                    >
                        {user?.is_active ? (
                            <>
                                <CheckCircle className="h-4 w-4 mr-1" /> Active
                            </>
                        ) : (
                            <>
                                <XCircle className="h-4 w-4 mr-1" /> Inactive
                            </>
                        )}
                    </Badge>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>
                            Your personal details and account information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="relative mb-6 group">
                            <Avatar className="h-32 w-32">
                                <AvatarImage src="" alt={user?.display_name} />
                                <AvatarFallback className="text-4xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                                    {user?.display_name
                                        ?.split(" ")
                                        .map((n: string) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-full bg-white text-gray-700"
                                >
                                    <Camera className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <h3 className="text-xl font-medium">
                            {user?.display_name}
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                            <Mail className="h-4 w-4" />
                            <p>{user?.email}</p>
                        </div>

                        <Separator className="my-6" />

                        <div className="w-full space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Roles
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {roles.map((role) => (
                                        <Badge key={role} variant="secondary">
                                            {role}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Groups
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {groups.map((group) => (
                                        <Badge key={group} variant="outline">
                                            {group}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            {user?.two_factor_enabled !== undefined && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                        Security
                                    </h4>
                                    <Badge
                                        variant="default"
                                        className={`px-3 py-1 ${
                                            user?.is_active
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                : ""
                                        }`}
                                    >
                                        {user?.is_active ? (
                                            <>
                                                <CheckCircle className="h-4 w-4 mr-1" />{" "}
                                                Active
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-4 w-4 mr-1" />{" "}
                                                Inactive
                                            </>
                                        )}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2">
                    <Tabs defaultValue="personal" className="w-full">
                        <TabsList className="mb-6 w-full">
                            <TabsTrigger value="personal" className="flex-1">
                                <User className="h-4 w-4 mr-2" />
                                Personal Information
                            </TabsTrigger>
                            <TabsTrigger value="security" className="flex-1">
                                <LockKeyhole className="h-4 w-4 mr-2" />
                                Security
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="personal">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Edit Profile</CardTitle>
                                    <CardDescription>
                                        Update your personal information
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handleSubmitProfile(
                                            onProfileSubmit
                                        )}
                                        className="space-y-6"
                                        id="profile-form"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="username">
                                                    Username
                                                </Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="username"
                                                        className="pl-10"
                                                        {...registerProfile(
                                                            "username",
                                                            {
                                                                required:
                                                                    "Username is required",
                                                            }
                                                        )}
                                                        disabled
                                                    />
                                                </div>
                                                {profileErrors.username && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            profileErrors
                                                                .username
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">
                                                    Email
                                                </Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        className="pl-10"
                                                        {...registerProfile(
                                                            "email",
                                                            {
                                                                required:
                                                                    "Email is required",
                                                                pattern: {
                                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                    message:
                                                                        "Invalid email address",
                                                                },
                                                            }
                                                        )}
                                                        disabled
                                                    />
                                                </div>
                                                {profileErrors.email && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            profileErrors.email
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="display_name">
                                                    Display Name
                                                </Label>
                                                <Input
                                                    id="display_name"
                                                    {...registerProfile(
                                                        "display_name",
                                                        {
                                                            required:
                                                                "Display name is required",
                                                        }
                                                    )}
                                                />
                                                {profileErrors.display_name && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            profileErrors
                                                                .display_name
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="given_name">
                                                    First Name
                                                </Label>
                                                <Input
                                                    id="given_name"
                                                    {...registerProfile(
                                                        "given_name",
                                                        {
                                                            required:
                                                                "First name is required",
                                                        }
                                                    )}
                                                />
                                                {profileErrors.given_name && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            profileErrors
                                                                .given_name
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="surname">
                                                    Last Name
                                                </Label>
                                                <Input
                                                    id="surname"
                                                    {...registerProfile(
                                                        "surname",
                                                        {
                                                            required:
                                                                "Last name is required",
                                                        }
                                                    )}
                                                />
                                                {profileErrors.surname && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            profileErrors
                                                                .surname.message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="department">
                                                    Department
                                                </Label>
                                                <div className="relative">
                                                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="department"
                                                        className="pl-10"
                                                        {...registerProfile(
                                                            "department"
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="title">
                                                    Job Title
                                                </Label>
                                                <div className="relative">
                                                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="title"
                                                        className="pl-10"
                                                        {...registerProfile(
                                                            "title"
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="office_phone">
                                                    Office Phone
                                                </Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="office_phone"
                                                        className="pl-10"
                                                        {...registerProfile(
                                                            "office_phone"
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="mobile_phone">
                                                    Mobile Phone
                                                </Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="mobile_phone"
                                                        className="pl-10"
                                                        {...registerProfile(
                                                            "mobile_phone"
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="office_location">
                                                    Office Location
                                                </Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="office_location"
                                                        className="pl-10"
                                                        {...registerProfile(
                                                            "office_location"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="submit"
                                        form="profile-form"
                                        className="w-full md:w-auto"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Change Password</CardTitle>
                                    <CardDescription>
                                        Update your password to keep your
                                        account secure
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handleSubmitPassword(
                                            onPasswordSubmit
                                        )}
                                        className="space-y-6"
                                        id="password-form"
                                    >
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="current_password">
                                                    Current Password
                                                </Label>
                                                <div className="relative">
                                                    <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="current_password"
                                                        type="password"
                                                        className="pl-10"
                                                        {...registerPassword(
                                                            "current_password",
                                                            {
                                                                required:
                                                                    "Current password is required",
                                                            }
                                                        )}
                                                    />
                                                </div>
                                                {passwordErrors.current_password && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            passwordErrors
                                                                .current_password
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password">
                                                    New Password
                                                </Label>
                                                <div className="relative">
                                                    <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        className="pl-10"
                                                        {...registerPassword(
                                                            "password",
                                                            {
                                                                required:
                                                                    "New password is required",
                                                                minLength: {
                                                                    value: 8,
                                                                    message:
                                                                        "Password must be at least 8 characters",
                                                                },
                                                                pattern: {
                                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                                                                    message:
                                                                        "Password must include uppercase, lowercase, number and special character",
                                                                },
                                                            }
                                                        )}
                                                    />
                                                </div>
                                                {passwordErrors.password && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            passwordErrors
                                                                .password
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {/* Password strength indicator */}
                                            {watchPassword && (
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span>
                                                            Password Strength
                                                        </span>
                                                        <span>
                                                            {getPasswordStrengthLabel()}
                                                        </span>
                                                    </div>
                                                    <Progress
                                                        value={passwordStrength}
                                                        className={getPasswordStrengthColor()}
                                                    />
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <Label htmlFor="password_confirmation">
                                                    Confirm New Password
                                                </Label>
                                                <div className="relative">
                                                    <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="password_confirmation"
                                                        type="password"
                                                        className="pl-10"
                                                        {...registerPassword(
                                                            "password_confirmation",
                                                            {
                                                                required:
                                                                    "Please confirm your password",
                                                                validate: (
                                                                    value,
                                                                    formValues
                                                                ) =>
                                                                    value ===
                                                                        formValues.password ||
                                                                    "Passwords do not match",
                                                            }
                                                        )}
                                                    />
                                                </div>
                                                {passwordErrors.password_confirmation && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            passwordErrors
                                                                .password_confirmation
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="submit"
                                        form="password-form"
                                        className="w-full md:w-auto"
                                        disabled={changingPassword}
                                    >
                                        {changingPassword ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Changing...
                                            </>
                                        ) : (
                                            <>
                                                <Key className="h-4 w-4 mr-2" />
                                                Change Password
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>

                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>
                                        Two-Factor Authentication
                                    </CardTitle>
                                    <CardDescription>
                                        Add an extra layer of security to your
                                        account
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                                                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">
                                                    Two-Factor Authentication
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {user?.two_factor_enabled
                                                        ? "Two-factor authentication is currently enabled"
                                                        : "Protect your account with two-factor authentication"}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant={
                                                user?.two_factor_enabled
                                                    ? "destructive"
                                                    : "default"
                                            }
                                            onClick={
                                                user?.two_factor_enabled
                                                    ? handleDisable2FA
                                                    : handleEnable2FA
                                            }
                                            disabled={isDisabling2FA}
                                        >
                                            {isDisabling2FA ? (
                                                <>
                                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                    Disabling...
                                                </>
                                            ) : user?.two_factor_enabled ? (
                                                "Disable"
                                            ) : (
                                                "Enable"
                                            )}
                                        </Button>
                                    </div>

                                    {/* Security recommendations */}
                                    <div className="mt-6">
                                        <Alert>
                                            <AlertDescription>
                                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                                    <li>
                                                        Use a strong, unique
                                                        password for your
                                                        account
                                                    </li>
                                                    <li>
                                                        Enable two-factor
                                                        authentication for
                                                        additional security
                                                    </li>
                                                    <li>
                                                        Never share your
                                                        password or verification
                                                        codes with anyone
                                                    </li>
                                                </ul>
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Two-Factor Authentication Dialog */}
            <Dialog
                open={twoFactorDialog.isOpen}
                onOpenChange={(open) => {
                    if (!open)
                        setTwoFactorDialog({ isOpen: false, step: "enable" });
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {twoFactorDialog.step === "confirm"
                                ? "Set Up Two-Factor Authentication"
                                : twoFactorDialog.step === "success"
                                ? "Two-Factor Authentication Enabled"
                                : "Two-Factor Authentication"}
                        </DialogTitle>
                        <DialogDescription>
                            {twoFactorDialog.step === "confirm"
                                ? "Scan the QR code below with your authenticator app"
                                : twoFactorDialog.step === "success"
                                ? "Your account is now protected with two-factor authentication"
                                : "Protect your account with two-factor authentication"}
                        </DialogDescription>
                    </DialogHeader>

                    {twoFactorDialog.step === "confirm" && (
                        <div className="space-y-4">
                            <div className="flex justify-center p-4 bg-white rounded-md">
                                {twoFactorDialog.qrCode && (
                                    <img
                                        src={twoFactorDialog.qrCode}
                                        alt="QR Code for two-factor authentication"
                                        className="w-48 h-48"
                                    />
                                )}
                            </div>

                            <div className="flex flex-col space-y-1 text-center">
                                <p className="text-xs text-gray-500">
                                    Manual setup code:
                                </p>
                                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-sm">
                                    {twoFactorDialog.secret}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="verification-code">
                                    Verification Code
                                </Label>
                                <Input
                                    id="verification-code"
                                    placeholder="Enter 6-digit code"
                                    value={confirmationCode}
                                    onChange={(e) =>
                                        setConfirmationCode(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {twoFactorDialog.step === "success" && (
                        <div className="flex flex-col items-center justify-center py-6 space-y-4">
                            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <p className="text-center">
                                You will now be asked for a verification code
                                when logging in.
                            </p>
                        </div>
                    )}

                    <DialogFooter className="sm:justify-between">
                        {twoFactorDialog.step === "confirm" ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setTwoFactorDialog({
                                            isOpen: false,
                                            step: "enable",
                                        })
                                    }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleConfirm2FA}
                                    disabled={
                                        confirmationCode.length !== 6 ||
                                        isConfirming2FA
                                    }
                                >
                                    {isConfirming2FA ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify & Enable"
                                    )}
                                </Button>
                            </>
                        ) : twoFactorDialog.step === "success" ? (
                            <Button
                                onClick={() =>
                                    setTwoFactorDialog({
                                        isOpen: false,
                                        step: "enable",
                                    })
                                }
                                className="w-full"
                            >
                                Close
                            </Button>
                        ) : null}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Profile;
