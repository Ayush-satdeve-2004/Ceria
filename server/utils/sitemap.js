const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const generateSitemap = async () => {
  try {
    console.log('Connecting to MongoDB for Sitemap generation...');
    await mongoose.connect(process.env.MONGODB_URI);

    const products = await Product.find({}, '_id updatedAt');
    
    const baseUrl = 'https://ceria-evev.onrender.com'; // Core MERN client URL
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. Static Pages
    const staticPages = ['', '/products', '/about', '/contact', '/terms', '/privacy'];
    staticPages.forEach(route => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${route}</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n`;
      xml += `  </url>\n`;
    });

    // 2. Dynamic Product Pages
    products.forEach(prod => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/products/${prod._id}</loc>\n`;
      xml += `    <lastmod>${prod.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    // Ensure client public directory exists
    const publicDir = path.join(__dirname, '../../client/public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, xml, 'utf8');
    
    console.log(`Sitemap.xml generated successfully at: ${sitemapPath}`);
    process.exit(0);
  } catch (error) {
    console.error('Sitemap Generation Error:', error);
    process.exit(1);
  }
};

generateSitemap();
