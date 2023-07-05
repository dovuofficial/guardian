import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import process from 'process';
import express from 'express';
import fileUpload from 'express-fileupload';
import hpp from 'hpp';
import { JwtModule } from '@nestjs/jwt';
import { AnalyticsApi } from '@api/analytics';
import { MetricsApi } from '@api/metrics';

const JSON_REQUEST_LIMIT = process.env.JSON_REQUEST_LIMIT || '1mb';
const RAW_REQUEST_LIMIT = process.env.RAW_REQUEST_LIMIT || '1gb';

@Module({
    imports: [
        ClientsModule.register([{
            name: 'GUARDIANS',
            transport: Transport.NATS,
            options: {
                name: `${process.env.SERVICE_CHANNEL}`,
                servers: [
                    `nats://${process.env.MQ_ADDRESS}:4222`
                ]
            }
        }]),
        JwtModule.register({
            global: true,
            secret: '123123123123123123',
            signOptions: { expiresIn: '60s' },
        }),
    ],
    controllers: [
        AnalyticsApi,
        MetricsApi
    ],
    providers: [
    ]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(express.json({
            limit: JSON_REQUEST_LIMIT
        })).forRoutes('*');
        consumer.apply(express.raw({
            inflate: true,
            limit: RAW_REQUEST_LIMIT,
            type: 'binary/octet-stream'
        })).forRoutes('*');
        consumer.apply(fileUpload()).forRoutes('*');
        consumer.apply(hpp()).forRoutes('*');
    }
}
