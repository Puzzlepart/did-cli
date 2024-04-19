export function getDbNameFromConnectionString(connectionString: string) {
  return connectionString.split('@')[0].split('mongodb://')[1].split(':')[0];
}
