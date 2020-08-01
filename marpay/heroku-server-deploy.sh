docker build -t registry.heroku.com/marpay-server/web .

heroku container:push web --app marpay-server

heroku container:release -a marpay-server web