const { createApp } = require('./app');

const app = createApp();
const PORT = process.env.PORT || 4000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
