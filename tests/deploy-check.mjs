import assert from'node:assert/strict';import{spawnSync}from'node:child_process';
const base={...process.env,DATABASE_URL:'postgresql://example.invalid/hospeda',JWT_SECRET:'a'.repeat(40),CLIENT_ORIGINS:'https://hospeda.example',PUBLIC_API_URL:'https://api.hospeda.example/api',PUBLIC_WEB_URL:'https://hospeda.example',VITE_API_BASE_URL:'https://api.hospeda.example/api',MP_PAYMENTS_ENABLED:'false'};
const run=env=>spawnSync(process.execPath,['scripts/check-deploy.mjs'],{env:{...base,...env},encoding:'utf8'});
assert.equal(run({}).status,0);console.log('PASS complete HTTPS deployment configuration');
assert.notEqual(run({VITE_API_BASE_URL:'http://localhost:53128/api'}).status,0);assert.notEqual(run({CLIENT_ORIGINS:'https://wrong.example'}).status,0);console.log('PASS inconsistent API URL and CORS rejected');
assert.notEqual(run({MP_PAYMENTS_ENABLED:'true'}).status,0);assert.notEqual(run({JWT_SECRET:'short'}).status,0);console.log('PASS premature payment activation and weak secret rejected');console.log('RESULT 3 passed 0 failed');
