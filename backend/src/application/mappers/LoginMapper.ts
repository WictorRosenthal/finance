// LoginMapper converte entre a entidade do banco (users) e a entidade de domínio (User)
import { User } from '../../domain/entities/User';
import { UserDTO } from '../dto/UserDTO';

export class LoginMapper {
  static toDTO(user: User): UserDTO {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      passwordHash: user.passwordHash,
    };
  }

  static toDomain(userDTO: UserDTO): User {
    return new User({
      id: userDTO.id,
      email: userDTO.email,
      name: userDTO.name,
      role: userDTO.role as User['role'],
      createdAt: userDTO.createdAt,
      updatedAt: userDTO.updatedAt,
    });
  }
}

