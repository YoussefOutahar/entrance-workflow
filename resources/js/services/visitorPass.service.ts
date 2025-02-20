import axiosInstance from "../config/AxiosConfig";
import { VisitorPass, VisitorPassFormData } from "../types/visitorPass";

export class VisitorPassService {
    private static formatFormData(data: Partial<VisitorPassFormData>, files?: FileList): FormData {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && key !== 'files') {
                formData.append(key, value.toString());
            }
        });

        if (files) {
            Array.from(files).forEach((file) => {
                formData.append('files[]', file);
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
            const response = await axiosInstance.get(`/auth/visitor-passes?page=${page}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching visitor passes:', error);
            throw error;
        }
    }

    static async getById(id: number): Promise<VisitorPass> {
        try {
            const response = await axiosInstance.get(`/auth/visitor-passes/${id}`);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching visitor pass ${id}:`, error);
            throw error;
        }
    }

    static async create(data: VisitorPassFormData, files?: FileList): Promise<VisitorPass> {
        try {
            const formData = new FormData();
            
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });
    
            // Debug files
            console.log('Files to upload:', files);
            
            if (files) {
                Array.from(files).forEach((file, index) => {
                    console.log(`Adding file ${index}:`, file.name, file.type, file.size);
                    formData.append(`files[]`, file);
                });
            }
    
            // Add this to see the complete request
            const response = await axiosInstance.post('/auth/visitor-passes', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                // Add this to see the complete request
                onUploadProgress: (progressEvent) => {
                    console.log('Upload Progress:', progressEvent);
                }
            });
            return response.data.data;
        } catch (error: any) {
            // Enhanced error logging
            console.error('Error creating visitor pass:', {
                error: error,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });
            throw error;
        }
    }

    static async update(id: number, data: Partial<VisitorPassFormData>, files?: FileList): Promise<VisitorPass> {
        try {
            const formData = this.formatFormData(data as any, files);
            formData.append('_method', 'PUT');

            const response = await axiosInstance.post(`/auth/visitor-passes/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.data;
        } catch (error) {
            console.error(`Error updating visitor pass ${id}:`, error);
            throw error;
        }
    }

    static async delete(id: number): Promise<void> {
        try {
            await axiosInstance.delete(`/auth/visitor-passes/${id}`);
        } catch (error) {
            console.error(`Error deleting visitor pass ${id}:`, error);
            throw error;
        }
    }

    static async addFiles(visitorPassId: number, files: FileList): Promise<File[]> {
        try {
            const formData = new FormData();
            Array.from(files).forEach((file) => {
                formData.append('files[]', file);
            });

            const response = await axiosInstance.post(
                `/auth/visitor-passes/${visitorPassId}/files`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.files;
        } catch (error) {
            console.error(`Error adding files to visitor pass ${visitorPassId}:`, error);
            throw error;
        }
    }

    static async deleteFile(fileId: number): Promise<void> {
        try {
            await axiosInstance.delete(`/auth/files/${fileId}`);
        } catch (error) {
            console.error(`Error deleting file ${fileId}:`, error);
            throw error;
        }
    }
}