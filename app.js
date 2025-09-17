// fetch url and get local issuer certificates
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5501;

app.get('/stream', async (req, res) => {
    const songUrl = req.query.url;

    if (!songUrl) {
        return res.status(400).send('Missing URL parameter');
    }

    try {
        const response = await fetch(songUrl);

        if (!response.ok) {
            return res.status(response.status).send(`Error fetching song: ${response.statusText}`);
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Length", response.headers.get("content-length") || "0");
        res.setHeader('Content-Range', `bytes 0-${response.headers.get("content-length") || "0" - 1}/${response.headers.get("content-length") || "0"}`);
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('Accept-Ranges', 'bytes');

        // Set content type if available, otherwise let the browser infer
        const contentType = response.headers.get('content-type');
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        response.body.pipe(res);

        response.body.on('error', (err) => {
            console.error('Error piping response:', err);
            res.status(500).send('Error streaming song');
        });

    } catch (error) {
        console.error('Error streaming song:', error);
        res.status(500).send('Error streaming song');
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Usage: http://localhost:${port}/stream?url=<SONG_URL>`);
});