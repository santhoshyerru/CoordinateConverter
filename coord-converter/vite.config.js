import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function autoVersionPlugin() {
  return {
    name: "auto-version",
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (fileName.endsWith(".js") || fileName.endsWith(".css")) {
          const file = bundle[fileName];
          const stats = fs.statSync(file.facadeModuleId);
          const timestamp = stats.mtimeMs;
          const newFileName = fileName.replace(
            /\.(js|css)$/,
            `.${timestamp}.$1`
          );
          file.fileName = newFileName;
          this.emitFile({ ...file, fileName: newFileName });
          delete bundle[fileName];
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), autoVersionPlugin()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
  },
});
