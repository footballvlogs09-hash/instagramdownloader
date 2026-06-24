const express = require('express');
const cors = require('cors');
const instagramGetUrl = require('instagram-url-direct');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so your website frontend can talk to this backend
app.use(cors());
app.use(express.json());

// Public test route
app.get('/', (req, res) => {
    res.send('Instagram Downloader API is running smoothly!');
});

// The core download route
app.post('/api/download', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, error: 'Instagram URL is required' });
    }

    try {
        // Fetch raw direct video links using open-source scrapers
        let results = await instagramGetUrl(url);
        
        if (results && results.url_list && results.url_list.length > 0) {
            return res.json({
                success: true,
                video_url: results.url_list[0]
            });
        } else {
            return res.status(404).json({ success: false, error: 'Could not extract video link. Make sure the account is public.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Server error processing the Instagram Link.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is processing on port ${PORT}`);
});
