import jwt from 'jsonwebtoken';

export class JwtService {
  private readonly secret = process.env.JWT_SECRET || 'changeme';

  generateToken(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: '1h' });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.secret);
  }
}