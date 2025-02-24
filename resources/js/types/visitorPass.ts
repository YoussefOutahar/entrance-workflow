export interface VisitorPass {
    id: number;
    visit_date: string;
    visited_person: string;
    unit: string;
    module: string;
    visit_purpose: string;
    duration_type: "full_day" | "custom";
    duration_days: number | null;
    visitor_name: string;
    id_number: string;
    organization?: string;
    category: "S-T" | "Ch" | "E";
    status: "awaiting" | "declined" | "started" | "in_progress" | "accepted";
    status_changed_at: string | null;
    approved_by?: number;
    hierarchy_approval: boolean;
    spp_approval: boolean;
    files?: File[];
    activities?: Activity[];
    latest_activity?: Activity;
    created_by: number;
    created_at: string;
    updated_at: string;
}

export interface File {
    id: number;
    visitor_pass_id: number;
    name: string;
    path: string;
    type: string;
    size: number;
    url: string;
    uploaded_by: number;
    created_at: string;
    updated_at: string;
}

export interface Activity {
    id: number;
    type: string;
    user: {
        id: number;
        name: string;
        username: string;
    };
    metadata: {
        old_status?: string;
        new_status?: string;
        notes?: string;
        file_name?: string;
        file_size?: number;
        file_type?: string;
        comment?: string;
        timestamp: string;
    };
    message: string;
    created_at: string;
    formatted_date: string;
}

export interface VisitorPassFormData {
    visit_date: string;
    visited_person: string;
    unit: string;
    module: string;
    visit_purpose: string;
    duration_type: "full_day" | "custom";
    duration_days?: number;
    visitor_name: string;
    id_number: string;
    organization?: string;
    category: "S-T" | "Ch" | "E";
    files?: File[];
}
export interface VisitorPassTableItem {
    id: number;
    visited_person: string;
    visitor_name: string;
    id_number: string;
    unit: string;
    module: string;
    visit_purpose: string;
    duration_type: "full_day" | "custom";
    duration_days: number | null;
    status: "pending" | "approved" | "rejected";
    visit_date: string;
    created_at: string;
}

export interface StatusUpdateData {
    status: "awaiting" | "declined" | "started" | "in_progress" | "accepted";
    notes?: string;
}

export interface WorkflowAction {
    action: string;
    available_statuses: string[];
    label: string;
}
