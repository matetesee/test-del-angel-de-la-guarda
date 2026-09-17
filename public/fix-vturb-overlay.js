/*
 * Parche de compatibilidad: el reproductor de video (VTurb/Converteai) trae
 * su propio boton "Comprar agora" y una imagen promocional en portugues,
 * configurados de forma remota en su panel (no en este sitio). Como no hay
 * acceso a esa cuenta, este script detecta esos elementos apenas aparecen
 * (incluso dentro de Shadow DOM) y los corrige/oculta automaticamente.
 *
 * Debe cargarse ANTES que el script del reproductor (smartplayer.min.js)
 * para poder interceptar el Shadow DOM que crea.
 */
(function () {
  "use strict";

  function fixButtonText(el) {
    if (el.children && el.children.length > 0) return;
    var text = el.textContent;
    if (!text) return;
    var trimmed = text.trim();
    if (/^comprar\s+agora$/i.test(trimmed)) {
      el.textContent = trimmed.replace(/agora/i, "ahora");
    }
  }

  function hideAngelBanner(el) {
    if (el.tagName !== "IMG") return;
    var alt = (el.getAttribute("alt") || "").toLowerCase();
    if (alt.indexOf("anjo da guarda") !== -1 || alt.indexOf("conecter") !== -1) {
      var wrapper = (el.closest && el.closest("a")) || el;
      wrapper.style.setProperty("display", "none", "important");
    }
  }

  function scanTextNodesForBanner(root) {
    try {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      var node;
      while ((node = walker.nextNode())) {
        if (/clique aqui para se conecter/i.test(node.textContent || "")) {
          var el = node.parentElement;
          var hops = 0;
          while (el && hops < 5 && el.tagName !== "A" && el.tagName !== "IMG") {
            el = el.parentElement;
            hops++;
          }
          if (el) el.style.setProperty("display", "none", "important");
        }
      }
    } catch (e) {
      /* noop */
    }
  }

  function scan(root) {
    if (!root || !root.querySelectorAll) return;
    var all = root.querySelectorAll("*");
    for (var i = 0; i < all.length; i++) {
      fixButtonText(all[i]);
      hideAngelBanner(all[i]);
    }
    scanTextNodesForBanner(root);
  }

  function observe(root) {
    scan(root);
    try {
      var observer = new MutationObserver(function () {
        scan(root);
      });
      observer.observe(root, { childList: true, subtree: true, characterData: true });
    } catch (e) {
      /* noop */
    }
  }

  // Interceptar attachShadow para poder observar el Shadow DOM que crea
  // el reproductor (VTurb suele renderizar su UI ahi adentro).
  if (Element.prototype.attachShadow) {
    var originalAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (init) {
      var root = originalAttachShadow.call(this, init);
      observe(root);
      return root;
    };
  }

  // Tambien observar el documento normal por si el reproductor no usa Shadow DOM.
  if (document.body) {
    observe(document.body);
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      observe(document.body);
    });
  }
})();
