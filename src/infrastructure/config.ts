import { getParameter } from './getParameter';

export default async () => ({
  SECRET_KEY: await getParameter('SECRET_KEY'),
  REDIS_HOST: await getParameter('REDIS_HOST'),
  REDIS_PORT: await getParameter('REDIS_PORT'),
});
