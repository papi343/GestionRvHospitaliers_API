import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { Roles_Key, Roles } from "../decorateurs/role.decorateur";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }


    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(Roles_Key, [context.getHandler(), context.getClass()]);
        if (!requiredRoles) return true;
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return requiredRoles.some((role) => user.role === role);
    }
}


