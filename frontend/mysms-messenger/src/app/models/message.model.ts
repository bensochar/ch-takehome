export interface Message {
  _id: string;
  content: string;
  from_number: string;
  to_number: string;
  status: string;
  twilio_sid?: string;
  twilio_status?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}
