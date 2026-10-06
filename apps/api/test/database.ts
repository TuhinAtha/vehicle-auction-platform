import { DataSource } from 'typeorm'

function getConnection() {
  try {
    process.loadEnvFile(new URL('../../../.env', import.meta.url))
  } catch {
    console.warn('No .env file found, using default connection settings')
  }
  const { env } = process
  return {
    host: env.DB_HOST ?? 'localhost',
    port: Number(env.DB_PORT ?? 5432),
    user: env.POSTGRES_USER ?? 'user',
    password: env.POSTGRES_PASSWORD ?? 'password',
    database: env.POSTGRES_DB ?? 'db',
  }
}

async function ensureDatabase(
  connection: ReturnType<typeof getConnection>,
  name: string,
) {
  const dataSource = await new DataSource({
    type: 'postgres',
    host: connection.host,
    port: connection.port,
    username: connection.user,
    password: connection.password,
    database: connection.database,
  }).initialize()
  try {
    const existing: unknown[] = await dataSource.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [name],
    )
    if (existing.length === 0) {
      await dataSource.query(`CREATE DATABASE "${name}"`)
    }
  } finally {
    await dataSource.destroy()
  }
}

export async function prepareTestDatabase() {
  const connection = getConnection()
  const database = `${connection.database}_test`
  await ensureDatabase(connection, database)
  return { ...connection, database }
}
