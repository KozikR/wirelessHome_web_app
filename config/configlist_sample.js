var settings = {
  port: process.env.PORT || 80,
  view_engine: "jade",
  adminPass: "xxxxxxx",
  adminEmail: "xxxxxxx@xxx.xxx",
  db_name : "db_name",
  db_user : "db_user",
  db_pass : "db_pass",
  db_options : {
    dialect : "mysql",
    host : "localhost",
    port : "3306",
    charset  : 'utf8',
    dialectOptions: {
      socketPath: '/var/run/mysqld/mysqld.sock',
      supportBigNumbers: true,
      bigNumberStrings: true
    },
  },
  redis_host : '127.0.0.1',
  redis_port : 6379,
  redis_pass : ''
};
module.exports = settings;