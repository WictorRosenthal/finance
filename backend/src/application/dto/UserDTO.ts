export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  passwordHash: string;
}
// O UserDTO é usado para transferir dados do usuário entre as camadas da aplicação, especialmente durante o login e autenticação. Ele inclui o hash da senha para validação, mas não deve ser exposto em respostas de API.
