import { Expose } from "class-transformer/decorators";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ServerType } from "../schemas/server.schema";

export class CreateServerDto {
    @IsNotEmpty()
    readonly hostname: string;

    @IsNotEmpty()
    readonly ip: string;

    @IsNotEmpty()
    readonly password: string;

    @IsNumber()
    readonly port: number = 27015;

    @IsString()
    readonly type: ServerType = 'tf2';

    @Expose()
    get connectAddress(): string {
        return `rcon_address ${this.hostname}${this.port}; rcon_password ${this.password}`;
    }
}