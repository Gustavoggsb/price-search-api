import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

export default function ProductsTest() {
  describe('ProductsController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    const product = {
      name: 'Product',
      weight: 3.1,
      imageUrl: 'http://productImage-1.jpg',
    };

    const newProduct = {
      name: 'New Product',
      weight: 2.75,
      imageUrl: 'http://productImage-2.jpg',
    };

    let productId;

    it('POST /products', async () => {
      const res = await request(app.getHttpServer())
        .post('/products')
        .send(product)
        .expect(201);

      expect(res.body.name).toEqual(product.name);
      expect(res.body.weight).toEqual(product.weight);
      expect(res.body.imageUrl).toEqual(product.imageUrl);

      productId = res.body._id;
    });

    it('GET /products', async () => {
      const res = await request(app.getHttpServer())
        .get(`/products`)
        .expect(200);

      expect(res.body[0].name).toEqual(product.name);
      expect(res.body[0].weight).toEqual(product.weight);
      expect(res.body[0].imageUrl).toEqual(product.imageUrl);
      expect(res.body[0]._id).toEqual(productId);
      expect(res.body).toHaveLength(1);
    });

    it('GET /products/:id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200);

      expect(res.body.name).toEqual(product.name);
      expect(res.body.weight).toEqual(product.weight);
      expect(res.body.imageUrl).toEqual(product.imageUrl);
      expect(res.body._id).toEqual(productId);
    });

    it('PUT /products/:id', async () => {
      const res = await request(app.getHttpServer())
        .put(`/products/${productId}`)
        .send(newProduct)
        .expect(200);

      expect(res.body.name).toEqual(newProduct.name);
      expect(res.body.weight).toEqual(newProduct.weight);
      expect(res.body.imageUrl).toEqual(newProduct.imageUrl);
      expect(res.body._id).toEqual(productId);
    });

    it('DELETE /products/:id', async () => {
      await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .expect(200);
    });
  });
}
