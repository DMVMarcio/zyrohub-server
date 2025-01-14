import ansicolor from 'ansicolor';
import { pathToFileURL } from 'node:url';
import { config, Terminal } from '@zyrohub/toolkit';

import fastify, { FastifyInstance } from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import { bootstrap } from 'fastify-decorators';

import { BaseModule } from '../Base';

import { RedisModule } from '../Redis';
import { TasksModule } from '../Tasks';

import { ServerError } from './models';

import { fastifySocket } from './plugins';

export class ServerModuleBase extends BaseModule {
	dependencies = [RedisModule, TasksModule];

	server?: FastifyInstance;

	initHandlers() {
		if (!this.server) return;

		this.server.setNotFoundHandler((request, reply) => {
			reply.status(404).send({
				success: false,
				code: 'NOT_FOUND',
				data: {}
			});
		});

		this.server.setErrorHandler((error, request, reply) => {
			if (error instanceof ServerError) return reply.status(error.status).send(error.toJSON());

			Terminal.error('SERVER', [error]);
			if (error.code === 'FST_ERR_VALIDATION')
				return reply.status(400).send({
					success: false,
					code: 'VALIDATION_ERROR',
					data: { message: error.message }
				});

			reply.status(500).send({
				success: false,
				code: error.code,
				data: {}
			});
		});
	}

	async init() {
		this.server = fastify({
			logger: false
		});

		this.server
			.register(fastifyCors, config.server.cors)
			.register(fastifyHelmet, {})
			.register(bootstrap, {
				directory: new URL('../../router/routes', pathToFileURL(__filename).href),
				mask: /\.route\./
			})
			.register(fastifySocket);

		this.initHandlers();

		this.server.listen({
			...(process.env.MODE === 'development' && { host: '0.0.0.0' }),
			port: config.server.port
		});

		Terminal.info('SERVER', `Successfully initialized on port: ${ansicolor.cyan(config.server.port)}`);
	}
}

export const ServerModule = new ServerModuleBase();
