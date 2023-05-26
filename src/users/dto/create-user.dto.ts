export class CreateUserDto {
  readonly email: string;
  readonly password: string;
  readonly fullname: string;
  readonly avatarUrl?: string;
}
