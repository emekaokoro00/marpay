ng build --prod

docker build -t registry.heroku.com/marpay-client/web .

heroku container:push web --app marpay-client

heroku container:release -a marpay-client web