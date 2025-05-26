export interface Job {
  id?: number;
  customer_name: string;
  quote_number?: string | null;
  activity_type: 'Cut & Prep' | 'Fab' | 'Delivery' | 'Other';
  hours_required: number;
  color_code: string;
  status?: string;
  original_start_date_request?: string | null;
  sort_order?: number;
}

export interface JobAllocation {
  id?: number;
  job_id: number;
  allocation_date: string;
  allocated_hours: number;
}

export interface StaffAssignment {
  default_daily_capacity: number | string;
  day_capacity_override?: number | string | null;
}
