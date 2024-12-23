import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
