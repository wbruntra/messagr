npx sequelize-cli \
  model:generate \
  --name Message \
  --attributes content:text,recipient:string,sender:string

npx sequelize-cli db:migrate --env production