// Keep-alive endpoint для предотвращения cold start
// Вызывается через Vercel Cron каждые 5 минут
module.exports = async (req, res) => {
    // Просто возвращаем OK, чтобы функция не "засыпала"
    res.status(200).json({ 
        ok: true, 
        message: 'Bot is alive',
        timestamp: new Date().toISOString()
    });
};

