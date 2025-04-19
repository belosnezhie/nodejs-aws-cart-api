docker_test:
	docker run -e DATABASE_HOST=rss-store-database.cfscmiksichm.eu-central-1.rds.amazonaws.com \
	           -e DATABASE_PORT=5432 \
	           -e DATABASE_USERNAME=postgres \
	           -e DATABASE_PASSWORD=qkFpeLMYbc8YBkJLT76Z \
	           -e DATABASE_NAME=rss_store_database \
	           -p 4000:4000 \
	           test
