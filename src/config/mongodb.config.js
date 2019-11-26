module.exports = {
  test: {
    url: 'mongodb://localhost:27017/clashstats_test'
  },
  development: {
    url: 'mongodb://localhost:27017/clashstats'
  },
  production: {
    url: `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@clashstats-main-ep9ez.azure.mongodb.net/clashstats?retryWrites=true&w=majority`
  }
}