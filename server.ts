import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import sharp from "sharp";

const app = express();
const PORT = 3000;

const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper to detect platform
function detectPlatform(url: string): "tiktok" | "instagram" | "youtube" | "other" {
  const lower = (url || "").toLowerCase();
  if (lower.includes("tiktok.com") || lower.includes("douyin.com")) return "tiktok";
  if (lower.includes("instagram.com") || lower.includes("instagr.am")) return "instagram";
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
  return "other";
}

// API Endpoint for Video Extraction via Cobalt
app.post("/api/download", async (req: Request, res: Response): Promise<any> => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await fetch('https://api.cobalt.tools/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        videoQuality: '1080',
        downloadMode: 'auto'
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch video stream' });
  }
});

// Proxy Download route to force real attachment streaming (avoids CORS and browser new-tab playback issues)
app.get("/api/proxy-download", async (req: Request, res: Response) => {
  const fileUrl = req.query.url as string;
  const filename = (req.query.filename as string) || "video.mp4";

  if (!fileUrl) {
    return res.status(400).send("Missing file URL");
  }

  try {
    const upstream = await fetch(fileUrl);
    if (!upstream.ok) {
      return res.redirect(fileUrl);
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader("Content-Type", contentType);

    const arrayBuffer = await upstream.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return res.send(buffer);
  } catch (err) {
    console.error("Proxy streaming error:", err);
    return res.redirect(fileUrl);
  }
});

app.post("/api/convert-image", upload.single("image"), async (req: Request, res: Response): Promise<any> => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No image file provided." });
  }

  try {
    const webpBuffer = await sharp(req.file.buffer)
      .webp({ quality: 85 })
      .toBuffer();

    const originalName = req.file.originalname.replace(/\.[^/.]+$/, "");
    
    res.setHeader("Content-Disposition", `attachment; filename="${originalName}.webp"`);
    res.setHeader("Content-Type", "image/webp");
    return res.send(webpBuffer);
  } catch (error: any) {
    console.error("Image conversion error:", error);
    return res.status(500).json({ success: false, error: "Failed to convert image." });
  }
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Downloader & Utility Hub Server running at http://localhost:${PORT}`);
  });
}

// In standard environments start the server, in Vercel just export the app
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  startServer();
}

export default app;
