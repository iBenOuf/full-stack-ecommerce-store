const mongoose = require('mongoose');
require('dotenv').config();
const Page = require('./models/page.model');

async function verify() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const pages = await Page.find({}, 'pageSlug');
    console.log('Current slugs in DB:');
    pages.forEach(p => console.log('- ' + p.pageSlug));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
verify();
