const path=require('node:path');
const fs=require('node:fs');
const os=require('node:os');
const localSecret=fs.readFileSync(path.join(os.homedir(),'.config/hospeda/local-jwt-secret'),'utf8').trim();
const root=__dirname;
module.exports={apps:[{name:'hospeda-local',cwd:root,script:path.join(root,'server/index.js'),instances:1,exec_mode:'fork',autorestart:true,max_restarts:10,min_uptime:'5s',restart_delay:2000,watch:false,env:{JWT_SECRET:localSecret,NODE_ENV:'production',API_PORT:'53130',API_HOST:'127.0.0.1',PUBLIC_API_URL:'http://localhost:53130/api',PUBLIC_WEB_URL:'http://localhost:53130',CLIENT_ORIGINS:'http://localhost:53130,http://127.0.0.1:53130',STORAGE_DIR:path.join(root,'uploads'),MP_PAYMENTS_ENABLED:'false'}}]};
