import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) : number | null => {
    const req = ctx.switchToHttp().getRequest();
    return req.user?.id ? Number(req.user.id) : null;
  }
);