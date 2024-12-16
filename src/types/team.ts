export interface Profile {
  uuid: string;
  email: string;
  full_name: string;
}

export interface TeamMember {
  uuid: string;
  user: Profile;
  is_owner: boolean;
}

export interface Team {
  uuid: string;
  name: string;
  created_at: string;
  updated_at: string;
}