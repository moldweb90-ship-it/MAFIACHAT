// Serve joomla-widget.js as static file
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    const filePath = path.join(process.cwd(), 'joomla-widget.js');
    
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.status(200).send(fileContent);
    } catch (error) {
        console.error('Error reading widget file:', error);
        res.status(404).send('// Widget file not found');
    }
};

