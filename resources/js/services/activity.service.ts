import axiosInstance from "../config/axios.config";
import { API_ROUTES } from "../config/api.config";
import { Activity } from "../types/visitorPass";

export class ActivityService {
    static async getVisitorPassTimeline(
        visitorPassId: number
    ): Promise<Activity[]> {
        try {
            const response = await axiosInstance.get(
                API_ROUTES.VISITOR_PASSES.TIMELINE(visitorPassId)
            );
            return response.data.data;
        } catch (error) {
            console.error(
                `Error fetching timeline for visitor pass ${visitorPassId}:`,
                error
            );
            throw error;
        }
    }

    static async addComment(
        visitorPassId: number,
        comment: string
    ): Promise<Activity> {
        try {
            const response = await axiosInstance.post(
                API_ROUTES.VISITOR_PASSES.COMMENTS(visitorPassId),
                { comment }
            );
            return response.data.data;
        } catch (error) {
            console.error(
                `Error adding comment to visitor pass ${visitorPassId}:`,
                error
            );
            throw error;
        }
    }

    static async getAll(params: {
        type?: string;
        subject_type?: string;
        subject_id?: number;
        page?: number;
    }): Promise<{
        data: Activity[];
        meta: {
            current_page: number;
            last_page: number;
            total: number;
        };
    }> {
        try {
            const response = await axiosInstance.get(
                params.type
                    ? API_ROUTES.ACTIVITIES.FILTERS.BY_TYPE(params.type)
                    : params.subject_type && params.subject_id
                    ? API_ROUTES.ACTIVITIES.FILTERS.BY_SUBJECT(
                          params.subject_type,
                          params.subject_id
                      )
                    : API_ROUTES.ACTIVITIES.BASE,
                {
                    params: { page: params.page },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching activities:", error);
            throw error;
        }
    }
}
