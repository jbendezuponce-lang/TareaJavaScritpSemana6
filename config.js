// Carga las variables de .env con la función nativa de Node (>= 20.12), sin dotenv.
// Si no existe .env se usan las variables de entorno del sistema.
try {
  process.loadEnvFile();
} catch (err) {
  if (err.code !== 'ENOENT') throw err;
}
