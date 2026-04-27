const http = require('http');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get('q');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (!q) return res.end("Ecris un mot !");

  try {
    // On force la source en français (sl=fr) et la destination en thaï (tl=th)
    // Et on demande la phonétique (dt=rm)
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=th&dt=t&dt=rm&q=${encodeURIComponent(q)}`;
    
    const response = await fetch(googleUrl);
    const data = await response.json();

    // Logique pour trouver la phonétique dans le bazar de Google
    let phonetique = "";
    
    // Google place souvent la phonétique ici
    if (data[0] && data[0][1] && data[0][1][3]) {
        phonetique = data[0][1][3];
    } else if (data[0] && data[0][0] && data[0][0][1]) {
        phonetique = data[0][0][1];
    }

    if (phonetique) {
      // On nettoie les accents pour Twitch
      const final = phonetique.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      res.end(final);
    } else {
      // Si vraiment pas de phonétique, on donne la traduction thaï (สวัสดี)
      res.end(data[0][0][0]);
    }

  } catch (err) {
    res.end("Erreur");
  }
});

server.listen(process.env.PORT || 3000);
