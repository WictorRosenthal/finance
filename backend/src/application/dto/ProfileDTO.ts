export interface ProfileDTO {
  id: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UpdateProfileDTO {
  name: string;
  email: string;
  address?: string;
  phone?: string;
  avatarUrl?: string;
}
