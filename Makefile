create:
	eb create production-small \
  --cname belosnezhie-cart-api-production-small \
  --single \
  --envvars DB_HOST=rss-store-database.cfscmiksichm.eu-central-1.rds.amazonaws.com,DB_PORT=5432,DB_USERNAME=postgres,DB_PASSWORD=qkFpeLMYbc8YBkJLT76Z,DB_NAME=rss_store_database
