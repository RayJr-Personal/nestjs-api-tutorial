import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// Experienced an issue where class validators wouldn't work
// even after making the validation pipes global
// Ran npm run build (issue with dist folder)

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
