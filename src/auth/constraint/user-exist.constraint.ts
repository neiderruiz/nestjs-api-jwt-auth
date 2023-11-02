import { Injectable } from "@nestjs/common";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { UserService } from "src/user/user.service";


@ValidatorConstraint({ name: 'UserExistConstraint', async: true })
@Injectable()
export class UserExistConstraint implements ValidatorConstraintInterface {

    constructor(
        private readonly userService: UserService
    ) { }

    async validate(email: any, args: ValidationArguments) {
        const user = await this.userService.findByEmail(email);
        return !user;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return "El correo $value ya está en uso"
    }
}