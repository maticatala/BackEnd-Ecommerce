import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, Query, ParseFilePipe, UseGuards, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import * as path from "path";
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';

import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/auth/interfaces';
import { ProductEntity } from './entities/product.entity';
import { QueryProductDto } from './dto/query-product.dto';
import { UserEntity } from 'src/users/entities/user.entity';


  const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null,Date.now() + '_' +  file.originalname);
  },
});

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  
  @Get()
  searchProductByQueryParams(@Query(new ValidationPipe()) query : QueryProductDto)  {
    return this.productsService.searchProductByQueryParams(query);
  }
  
  @Get('all')
  findAll()  {
    return this.productsService.findAll();
  }
  
  @Get("getFile")
  getFile(@Res() res: Response, @Query('fileName') fileName: string) {
    res.sendFile(path.join(__dirname, "../../../uploads/" + fileName));
  }
  

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
  

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage }))
  create(@Body() createProductDto: CreateProductDto, @UploadedFile() file, @CurrentUser() currentUser: UserEntity): Promise<ProductEntity> {
    return this.productsService.create(createProductDto, file, currentUser);
  } 
  
  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', { storage }))
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFile(new ParseFilePipe({ fileIsRequired: false })) file?) {
    return this.productsService.update(+id, updateProductDto, file);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Patch('delete/:id')
  delete(@Param('id') id: string) {
    return this.productsService.delete(+id);
  }
}
