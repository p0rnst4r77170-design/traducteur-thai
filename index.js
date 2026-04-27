const http = require('http');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get('q');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (!q) return res.end("Attente de texte...");

  try {
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=th&dt=rm&q=${encodeURIComponent(q)}`;
    const response = await fetch(googleUrl);
    const data = await response.json();

    // On cherche la phonétique dans la structure de Google
    let phonetique = "";
    if (data && data[0] && data[0][0] && data[0][0][1]) {
        phonetique = data[0][0][1];
    }

    if (phonetique) {
      // Nettoyage pour Twitch
      const final = phonetique.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      res.end(final);
    } else {
      res.end("Traduction indisponible");
    }
  } catch (err) {
    res.end("Erreur de connexion");
  }
});

server.listen(process.env.PORT || 3000);
