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
import { TableMemberService } from './table-member.service';
import { CreateTableMemberDto } from './dto/create-table-member.dto';
import { UpdateTableMemberDto } from './dto/update-table-member.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Table Members')
@Controller('table-members')
export class TableMemberController {
  constructor(private readonly tableMemberService: TableMemberService) {}

  @HttpPost()
  @ApiOperation({ summary: 'Registrar un nuevo miembro de mesa' })
  @ApiResponse({
    status: 201,
    description: 'Miembro de mesa creado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario o mesa de votación no encontrados',
  })
  @ApiResponse({
    status: 409,
    description:
      'El usuario ya está registrado como miembro de mesa (userId único)',
  })
  create(
    @Body() createTableMemberDto: CreateTableMemberDto,
  ): Promise<ServiceResponse<any>> {
    return this.tableMemberService.create(createTableMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los miembros de mesa' })
  @ApiResponse({
    status: 200,
    description: 'Listado de miembros de mesa obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.tableMemberService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un miembro de mesa por ID' })
  @ApiResponse({
    status: 200,
    description: 'Miembro de mesa obtenido correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Miembro de mesa no encontrado',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.tableMemberService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un miembro de mesa' })
  @ApiResponse({
    status: 200,
    description: 'Miembro de mesa actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description:
      'Miembro de mesa, usuario o mesa de votación no encontrados',
  })
  @ApiResponse({
    status: 409,
    description:
      'Ya existe otro miembro de mesa con ese userId (único)',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTableMemberDto: UpdateTableMemberDto,
  ): Promise<ServiceResponse<any>> {
    return this.tableMemberService.update(id, updateTableMemberDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un miembro de mesa' })
  @ApiResponse({
    status: 200,
    description: 'Miembro de mesa eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Miembro de mesa no encontrado',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.tableMemberService.remove(id);
  }
}
