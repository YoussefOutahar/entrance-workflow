export interface VisitorPass {
    id: number;
    visit_date: string;
    visited_person: string;
    unit: string;
    module: string;
    visit_purpose: string;
    duration_type: 'full_day' | 'custom';
    duration_days: number | null;
    visitor_name: string;
    id_number: string;
    organization?: string;
    category: 'S-T' | 'Ch' | 'E';
    status: string;
    approved_by?: string;
    hierarchy_approval: boolean;
    spp_approval: boolean;
    files?: File[];
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
    created_at: string;
    updated_at: string;
}

export interface VisitorPassFormData {
    visit_date: string;
    visited_person: string;
    unit: string;
    module: string;
    visit_purpose: string;
    duration_type: 'full_day' | 'custom';
    duration_days?: number;
    visitor_name: string;
    id_number: string;
    organization?: string;
    category: 'S-T' | 'Ch' | 'E';
    files?: File[];
    status?: 'pending' | 'approved' | 'rejected';
}

export interface VisitorPassTableItem {
    id: number;
    visited_person: string;
    visitor_name: string;
    id_number: string;
    unit: string;
    module: string;
    visit_purpose: string;
    duration_type: 'full_day' | 'custom';
    duration_days: number | null;
    status: 'pending' | 'approved' | 'rejected';
    visit_date: string;
    created_at: string;
}