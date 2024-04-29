import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersProducts } from './entities/orders-product.entity';
import { Shipping } from './entities/shipping.entity';
import { Order } from './entities/order.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Order, OrdersProducts, Shipping]),
    ProductsModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
