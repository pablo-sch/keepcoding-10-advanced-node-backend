export default function cleanEnvVar(value) {
  if (!value) return value;
  return value.replace(/^['"]|['"]$/g, "");
}
/* 
  For some strange reason sometimes .env credentials passes as a string,
  so I must remove the quotes if they exist.
*/
