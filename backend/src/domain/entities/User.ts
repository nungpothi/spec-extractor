import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export type UserRole = 'ADMIN' | 'VISITOR';

export class User {
  public readonly id: string;
  public readonly phone: string;
  public readonly email: string;
  public readonly passwordHash: string;
  public readonly role: UserRole;
  public readonly createdAt: Date;
  public readonly updatedAt?: Date;

  constructor(
    id: string,
    phone: string,
    email: string,
    passwordHash: string,
    role: UserRole,
    createdAt: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.phone = phone;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async create(
    phone: string,
    email: string,
    password: string,
    role: UserRole = 'VISITOR'
  ): Promise<User> {
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);
    const createdAt = new Date();

    return new User(id, phone, email, passwordHash, role, createdAt);
  }

  public async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  public isValid(): boolean {
    return !!(
      this.id &&
      this.phone &&
      this.email &&
      this.passwordHash &&
      this.role &&
      this.createdAt &&
      this.isValidEmail() &&
      this.isValidPhone()
    );
  }

  public isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  public getPublicProfile(): Omit<User, 'passwordHash'> {
    const { passwordHash, ...publicProfile } = this;
    return publicProfile;
  }

  private isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  private isValidPhone(): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(this.phone);
  }
}