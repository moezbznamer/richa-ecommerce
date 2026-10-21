import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

function imageFolderPlugin(): Plugin {
  return {
    name: "serve-image-folder",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url.startsWith("/image/") || req.url.startsWith("/src/image/"))) {
          const rawFilename = req.url.replace(/^\/(src\/)?image\//, "").split("?")[0];
          const decodedFilename = decodeURIComponent(rawFilename);

          const candidatePaths = [
            path.resolve(__dirname, "public/image", decodedFilename),
            path.resolve(__dirname, "src/image", decodedFilename),
            path.resolve(__dirname, "src/assets", decodedFilename),
          ];

          for (const filePath of candidatePaths) {
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath).toLowerCase();
              const mimeMap: Record<string, string> = {
                ".jfif": "image/jpeg",
                ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg",
                ".png": "image/png",
                ".webp": "image/webp",
                ".svg": "image/svg+xml",
                ".gif": "image/gif",
              };
              res.setHeader("Content-Type", mimeMap[ext] || "application/octet-stream");
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          }
        }
        next();
      });
    },
    closeBundle() {
      // Ensure all images in src/image are copied into dist/image on build
      const srcImgDir = path.resolve(__dirname, "src/image");
      const distImgDir = path.resolve(__dirname, "dist/image");
      if (fs.existsSync(srcImgDir)) {
        if (!fs.existsSync(distImgDir)) {
          fs.mkdirSync(distImgDir, { recursive: true });
        }
        const files = fs.readdirSync(srcImgDir);
        for (const file of files) {
          const srcFile = path.join(srcImgDir, file);
          const distFile = path.join(distImgDir, file);
          if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, distFile);
          }
        }
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    imageFolderPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
