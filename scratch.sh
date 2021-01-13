npx sequelize-cli \
  model:generate \
  --name Message \
  --attributes content:text,recipient:string,sender:string

npx sequelize-cli db:migrate --env production

npx sequelize-cli \
  migration:create \
  --name add_read_column