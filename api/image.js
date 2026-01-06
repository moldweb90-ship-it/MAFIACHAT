// API endpoint для отдачи изображений
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    const imageName = req.query.name || 'Eiva.jpg';
    const imagePath = path.join(__dirname, '..', 'public', imageName);
    
    try {
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            const ext = path.extname(imageName).toLowerCase();
            
            let contentType = 'image/jpeg';
            if (ext === '.png') contentType = 'image/png';
            if (ext === '.gif') contentType = 'image/gif';
            if (ext === '.webp') contentType = 'image/webp';
            
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            res.send(imageBuffer);
        } else {
            res.status(404).send('Image not found');
        }
    } catch (error) {
        console.error('Error serving image:', error);
        res.status(500).send('Error serving image');
    }
};

