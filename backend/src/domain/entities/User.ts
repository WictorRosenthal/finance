export type UserRole = "admin" | "read-only";

export interface UserProps {
  id: string;
  email: string;
  passwordHash?: string;
  name: string;
  address?: string;
  phone?: string;
  avatarUrl?: string;
  oauthProvider?: string;
  oauthId?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.validate(props);
    this.props = { ...props };
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string | undefined {
    return this.props.passwordHash;
  }

  get name(): string {
    return this.props.name;
  }

  get address(): string | undefined {
    return this.props.address;
  }

  get phone(): string | undefined {
    return this.props.phone;
  }

  get avatarUrl(): string | undefined {
    return this.props.avatarUrl;
  }

  get oauthProvider(): string | undefined {
    return this.props.oauthProvider;
  }

  get oauthId(): string | undefined {
    return this.props.oauthId;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateName(name: string): void {
    if (!name || name.trim() === "") {
      throw new Error("Name cannot be empty");
    }
    this.props.name = name.trim();
    this.touch();
  }

  updatePasswordHash(hashedPassword: string): void {
    if (!hashedPassword) {
      throw new Error("Password hash cannot be empty");
    }
    this.props.passwordHash = hashedPassword;
    this.touch();
  }

  updateRole(role: UserRole): void {
    if (!role) {
      throw new Error("Invalid role");
    }
    this.props.role = role;
    this.touch();
  }

  updateProfile(profile: {
    name: string;
    email: string;
    address?: string;
    phone?: string;
    avatarUrl?: string;
  }): void {
    const name = profile.name.trim();
    const email = profile.email.trim();

    if (!name) {
      throw new Error("Name cannot be empty");
    }
    if (!email) {
      throw new Error("Email cannot be empty");
    }

    this.props.name = name;
    this.props.email = email;
    this.props.address = profile.address?.trim() || undefined;
    this.props.phone = profile.phone?.trim() || undefined;
    this.props.avatarUrl = profile.avatarUrl?.trim() || undefined;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  private validate(props: UserProps): void {
    if (!props.email || props.email.trim() === "") {
      throw new Error("Email is required");
    }
    if (!props.name || props.name.trim() === "") {
      throw new Error("Name is required");
    }
    if (!props.role) {
      throw new Error("Role is required");
    }
    if (!props.createdAt) {
      throw new Error("createdAt is required");
    }
    if (!props.updatedAt) {
      throw new Error("updatedAt is required");
    }
  }

  // Remove passwordHash (importante para API)
  toSafeObject(): Omit<UserProps, "passwordHash"> {
    const { passwordHash, ...safe } = this.props;
    return safe;
  }

  toPlainObject(): UserProps {
    return { ...this.props };
  }
}
