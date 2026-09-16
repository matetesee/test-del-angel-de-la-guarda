const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

// Sirve todos los archivos estaticos (js, css, img, favicon) tal cual estan.
// Nota: los nombres de los bundles de Vue tienen hash, pero como el contenido
// se puede seguir actualizando (ej. traducciones) sin cambiar ese hash, NO se
// usa cache "immutable" de un anio: eso dejaria a los visitantes que ya
// cargaron el sitio antes atascados con una version vieja para siempre. Se usa
// un cache corto para que los cambios lleguen rapido a todos.
app.use(
  express.static(PUBLIC_DIR, {
    setHeaders: (res, filePath) => {
      if (/\.[a-f0-9]{8}\.(js|css)$/.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=300, must-revalidate");
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
