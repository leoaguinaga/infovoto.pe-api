import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterEmailDto } from './dto/register-email.dto';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpPost()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado correctamente',
  })
  create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ServiceResponse<any>> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Listado de usuarios obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario obtenido correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ServiceResponse<any>> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.userService.remove(id);
  }

  @Public()
  @HttpPost('register-email')
  @ApiOperation({ 
    summary: 'Registrar email para votante pre-registrado',
    description: 'Permite a un votante registrado en el sistema asociar su correo electrónico y recibir un token de activación'
  })
  @ApiResponse({
    status: 200,
    description: 'Correo registrado y token de activación enviado',
  })
  @ApiResponse({
    status: 404,
    description: 'Votante no encontrado con ese número de documento',
  })
  @ApiResponse({
    status: 409,
    description: 'El votante ya tiene email registrado o el email ya está en uso',
  })
  registerEmail(
    @Body() registerEmailDto: RegisterEmailDto,
  ): Promise<ServiceResponse<any>> {
    return this.userService.registerEmail(registerEmailDto);
  }

  @Public()
  @HttpPost('activate-account')
  @ApiOperation({ 
    summary: 'Activar cuenta con token',
    description: 'Activa la cuenta del usuario usando el token recibido por email y establece la contraseña'
  })
  @ApiResponse({
    status: 200,
    description: 'Cuenta activada correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido, expirado o cuenta ya activada',
  })
  activateAccount(
    @Body() activateAccountDto: ActivateAccountDto,
  ): Promise<ServiceResponse<any>> {
    return this.userService.activateAccount(activateAccountDto);
  }

  @Public()
  @HttpPost('resend-activation/:email')
  @ApiOperation({ 
    summary: 'Reenviar token de activación',
    description: 'Reenvía un nuevo token de activación al correo electrónico especificado'
  })
  @ApiResponse({
    status: 200,
    description: 'Nuevo token de activación enviado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'La cuenta ya está activada',
  })
  resendActivationToken(
    @Param('email') email: string,
  ): Promise<ServiceResponse<any>> {
    return this.userService.resendActivationToken(email);
  }
}
