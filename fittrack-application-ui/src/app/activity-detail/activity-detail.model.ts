export interface ActivityDetail {
  activityId: string;
  activityType: 'RUNNING' | 'CYCLING' | 'YOGA' | 'SWIMMING' | string;
  creatdAt: string;
  id: string;
  improvements: string[];
  recommendation: string;
  safety: string[];
  suggestions: string[];
  userId: string;
}
