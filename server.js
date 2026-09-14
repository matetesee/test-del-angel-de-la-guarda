const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

// Sirve todos los archivos estaticos (js, css, img, favicon) tal cual estan
app.use(
  express.static(PUBLIC_DIR, {
    setHeaders: (res, filePath) => {
      // Los bundles de Vue tienen hash en el nombre -> se pueden cachear fuerte
      if (/\.[a-f0-9]{8}\.(js|css)$/.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  })
);

// La app es una SPA (Vue Router en modo "history"), asi que cualquier ruta
// que no matchee un archivo estatico devuelve el index.html para que el
// router del lado del cliente resuelva la pantalla correspondiente.
app.get("*", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Test del Angel de la Guarda escuchando en el puerto ${PORT}`);
});
