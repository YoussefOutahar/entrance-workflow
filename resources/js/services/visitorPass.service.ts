import axiosInstance from "../config/axios.config";
import { API_ROUTES } from "../config/api.config";
import {
    Activity,
    StatusUpdateData,
    VisitorPass,
    VisitorPassFormData,
    WorkflowAction,
} from "../types/visitorPass";

export class VisitorPassService {
    private static formatFormData(
        data: Partial<VisitorPassFormData>,
        files?: FileList
    ): FormData {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null && key !== "files") {
                formData.append(key, value.toString());
            }
        });

        if (files) {
            Array.from(files).forEach((file) => {
                formData.append("files[]", file);
            });
        }

        return formData;
    }

    static async getAll(page: number = 1): Promise<{
        data: VisitorPass[];
        meta: {
            current_page: number;
            last_page: number;
            total: number;
        };
    }> {
        try {
            const response = await axiosInstance.get(
                `${API_ROUTES.VISITOR_PASSES.BASE}?page=${page}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching visitor passes:", error);
            throw error;
        }
    }

    static async getById(id: number): Promise<VisitorPass> {
        try {
            const response = await axiosInstance.get(
                `${API_ROUTES.VISITOR_PASSES.BASE}/${id}`
            );
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching visitor pass ${id}:`, error);
            throw error;
        }
    }

    static async create(
        data: VisitorPassFormData,
        files?: FileList
    ): Promise<VisitorPass> {
        try {
            const formData = this.formatFormData(data, files);

            const response = await axiosInstance.post(
                API_ROUTES.VISITOR_PASSES.BASE,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data.data;
        } catch (error: any) {
            console.error("Error creating visitor pass:", {
                error: error,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
            });
            throw error;
        }
    }

    static async update(
        id: number,
        data: Partial<VisitorPassFormData>,
        files?: FileList
    ): Promise<VisitorPass> {
        try {
            const formData = this.formatFormData(data, files);
            formData.append("_method", "PUT");

            const response = await axiosInstance.post(
                `${API_ROUTES.VISITOR_PASSES.BASE}/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            console.error(`Error updating visitor pass ${id}:`, error);
            throw error;
        }
    }

    static async delete(id: number): Promise<void> {
        try {
            await axiosInstance.delete(
                `${API_ROUTES.VISITOR_PASSES.BASE}/${id}`
            );
        } catch (error) {
            console.error(`Error deleting visitor pass ${id}:`, error);
            throw error;
        }
    }

    static async addFiles(
        visitorPassId: number,
        files: FileList
    ): Promise<File[]> {
        try {
            const formData = new FormData();
            Array.from(files).forEach((file) => {
                formData.append("files[]", file);
            });

            const response = await axiosInstance.post(
                API_ROUTES.VISITOR_PASSES.ADD_FILES(visitorPassId),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data.files;
        } catch (error) {
            console.error(
                `Error adding files to visitor pass ${visitorPassId}:`,
                error
            );
            throw error;
        }
    }

    static async deleteFile(fileId: number): Promise<void> {
        try {
            await axiosInstance.delete(
                API_ROUTES.VISITOR_PASSES.DELETE_FILE(fileId)
            );
        } catch (error) {
            console.error(`Error deleting file ${fileId}:`, error);
            throw error;
        }
    }

    static async updateStatus(
        id: number,
        data: StatusUpdateData
    ): Promise<VisitorPass> {
        try {
            const response = await axiosInstance.post(
                API_ROUTES.VISITOR_PASSES.STATUS(id),
                data
            );
            return response.data.data;
        } catch (error) {
            console.error(
                `Error updating status for visitor pass ${id}:`,
                error
            );
            throw error;
        }
    }

    static async getAvailableActions(id: number): Promise<{
        current_status: string;
        available_actions: WorkflowAction[];
    }> {
        try {
            const response = await axiosInstance.get(
                API_ROUTES.VISITOR_PASSES.AVAILABLE_ACTIONS(id)
            );
            return response.data;
        } catch (error) {
            console.error(
                `Error fetching available actions for visitor pass ${id}:`,
                error
            );
            throw error;
        }
    }

    static async getWorkflowHistory(id: number): Promise<Activity[]> {
        try {
            const response = await axiosInstance.get(
                API_ROUTES.VISITOR_PASSES.WORKFLOW_HISTORY(id)
            );
            return response.data.history;
        } catch (error) {
            console.error(
                `Error fetching workflow history for visitor pass ${id}:`,
                error
            );
            throw error;
        }
    }
}
