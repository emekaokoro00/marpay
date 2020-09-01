docker build -t registry.heroku.com/marpay-server/web .

# heroku container:push web --app marpay-server
heroku container:push web worker --recursive --app marpay-server

# heroku container:release -a marpay-server web
heroku container:release -a marpay-server web worker