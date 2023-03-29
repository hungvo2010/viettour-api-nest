export class CreateUserDto {
  readonly email: string;
  readonly fullname: string;
  readonly password: string;
  readonly avatarUrl?: string;
}
