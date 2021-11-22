import { getParameter } from './getParameter';

export default async () => ({
  SECRET_KEY: await getParameter('SECRET_KEY'),
  REDIS_HOST: await getParameter('REDIS_HOST'),
  REDIS_PORT: await getParameter('REDIS_PORT'),
  USERS_MICROSERVICE_GRPC: await getParameter('USERS_MICROSERVICE_GRPC'),
  GRPC_URL: await getParameter('GRPC_URL'),
});
