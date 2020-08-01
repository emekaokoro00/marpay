docker build -t registry.heroku.com/marpay/web .

heroku container:push web --app marpay

heroku container:release -a marpay web