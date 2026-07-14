import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto/User.dto";
import { Public } from "./decorators/public.decorator";

@Controller("api")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // 🔓 Accessible without a token
  @Public()
  @Post("/login")
  loginUser(@Body() loginDto: LoginDto) {
    return this.authService.loginUser(loginDto);
  }
  // 🔓 Accessible without a token
  @Public()
  @Post("/register")
  registerUser(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }
}
