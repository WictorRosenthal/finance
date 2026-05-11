
export interface UserProps {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'read-only';
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private readonly props: UserProps;

  constructor(props: UserProps) {
    this.validate(props);
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get username(): string {
    return this.props.username;
  }

  get password(): string {
    return this.props.password;
  }

  get role(): string {
    return this.props.role;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateUsername(username: string): void {
    if (!username || username.trim() === '') {
      throw new Error('Username cannot be empty');
    }

    this.props.username = username.trim();
    this.touch();
  }

  updatePassword(hashedPassword: string): void {
    if (!hashedPassword) {
      throw new Error('Password cannot be empty');
    }

    this.props.password = hashedPassword;
    this.touch();
  }

  updateRole(role: 'admin' | 'read-only'): void {
    if (!role) {
      throw new Error('Invalid role');
    }

    this.props.role = role;
    this.touch();
  }


  private touch(): void {
    this.props.updatedAt = new Date();
  }

  private validate(props: UserProps): void {
    if (!props.username || props.username.trim() === '') {
      throw new Error('Username is required');
    }

    if (!props.password) {
      throw new Error('Password is required');
    }

    if (!props.role) {
      throw new Error('Role is required');
    }
  }

  // Remove senha (importante para API)
  toSafeObject(): Omit<UserProps, 'password'> {
    const { password, ...safe } = this.props;
    return safe;
  }

  toPlainObject(): UserProps {
    return { ...this.props };
  }
}
