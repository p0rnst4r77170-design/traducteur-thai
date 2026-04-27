const http = require('http');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get('q');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (!q) return res.end("Ecris un mot !");

  try {
    // Utilisation de l'API Google avec le paramètre 'dt=rm' pour la romanisation
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=th&dt=rm&dt=t&q=${encodeURIComponent(q)}`;
    
    const response = await fetch(googleUrl);
    const data = await response.json();

    // On récupère la phonétique (index 1 du premier bloc)
    let phonetique = "";
    if (data && data[0] && data[0][1]) {
        phonetique = data[0][1][3] || data[0][0][1];
    }

    if (phonetique) {
      // Nettoyage des accents pour Twitch
      const final = phonetique.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      res.end(final);
    } else {
      // Si échec phonétique, on donne au moins le thaï
      res.end(data[0][0][0]);
    }

  } catch (err) {
    res.end("Erreur de service");
  }
});

server.listen(process.env.PORT || 3000);
