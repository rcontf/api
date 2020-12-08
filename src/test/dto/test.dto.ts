import { IsNotEmpty } from 'class-validator';

export class CreateTestDto {
  @IsNotEmpty()
  readonly name: string;
}
