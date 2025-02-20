// pages/PassDetails.tsx
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { PassPreview } from "../components/PassPreview";
import { Check, X, User, Clock, Building2, IdCard, Users, Calendar, Download, Eye, ImageIcon, FileText, FileIcon } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { SidebarTrigger } from "../components/ui/sidebar";
import { Card, CardContent } from "../components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { VisitorPassService } from "../services/visitorPass.service";
import { VisitorPass } from "../types/visitorPass";

const PassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pass, setPass] = useState<VisitorPass | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPass();
  }, [id]);

  const loadPass = async () => {
    try {
      const passData = await VisitorPassService.getById(Number(id));
      console.log(passData);
      setPass(passData);
    } catch (error) {
      console.error('Error loading pass:', error);
      toast({
        title: "Error",
        description: "Failed to load pass details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    try {
      await VisitorPassService.update(Number(id), { status: 'approved' });
      toast({
        title: "Pass Validated",
        description: "The access pass has been approved successfully."
      });
      loadPass();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate pass.",
        variant: "destructive"
      });
    }
  };

  const handleDecline = async () => {
    try {
      await VisitorPassService.update(Number(id), { status: 'rejected' });
      toast({
        title: "Pass Declined",
        description: "The access pass has been declined."
      });
      loadPass();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline pass.",
        variant: "destructive"
      });
    }
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
        <Button className="mt-4" onClick={() => navigate('/passes')}>
          Back to Passes
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
            Pass Details
          </h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Review and manage access pass request
          </p>
        </div>
        <SidebarTrigger>
          <User className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </SidebarTrigger>
      </div>

      <div className="grid gap-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Access Pass Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <IdCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">ID Number</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-200">{pass.id_number}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Unit</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-200">{pass.unit}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Duration</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-200">
                    {pass.duration_type === 'full_day' ? 'Full Day' : `${pass.duration_days} days`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                  <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Visit Date</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-200">
                    {new Date(pass.visit_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                  <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Visited Person</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-200">{pass.visited_person}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {pass.files && pass.files.length > 0 && (
          <Card className="shadow-lg dark:bg-gray-800">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Attached Files
              </h3>
              <div className="grid gap-4">
                {pass.files.map((file: any) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        {file.type?.includes('image') ? (
                          <ImageIcon className="h-5 w-5 text-blue-600" />
                        ) : file.type?.includes('pdf') ? (
                          <FileText className="h-5 w-5 text-red-600" />
                        ) : (
                          <FileIcon className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {file.type?.includes('image') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/storage/${file.path}`, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={`/storage/${file.path}`}
                          download={file.name}
                          className="flex items-center"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <PassPreview passData={pass} />
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            variant="outline"
            className="bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border-2 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-colors px-6 py-2"
            onClick={handleDecline}
            disabled={pass.status !== 'pending'}
          >
            <X className="mr-2 h-5 w-5" />
            Decline Pass
          </Button>
          <Button
            className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600 text-white transition-colors px-6 py-2"
            onClick={handleValidate}
            disabled={pass.status !== 'pending'}
          >
            <Check className="mr-2 h-5 w-5" />
            Validate Pass
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PassDetails;