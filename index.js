const http = require('http');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get('q');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (!q) return res.end("Ecris un mot !");

  try {
    // Nouvelle URL avec TOUS les paramètres de secours
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=th&dt=t&dt=rm&q=${encodeURIComponent(q)}`;
    
    const response = await fetch(googleUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await response.json();

    let phonetique = "";

    // On fouille partout dans la réponse de Google pour trouver la phonétique
    if (data && data[0]) {
      for (let i = 0; i < data[0].length; i++) {
        // La phonétique est souvent à l'index 3 ou 2 du bloc de traduction
        if (data[0][i][3]) {
          phonetique = data[0][i][3];
          break;
        } else if (data[0][i][2]) {
          phonetique = data[0][i][2];
        }
      }
    }

    if (phonetique) {
      // On nettoie les accents pour que ce soit lisible sur Twitch
      const final = phonetique.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      res.end(final);
    } else {
      // Si vraiment pas de phonétique, on donne le Thaï (mieux que rien !)
      res.end(data[0][0][0]);
    }

  } catch (err) {
    res.end("Erreur de service");
  }
});

server.listen(process.env.PORT || 3000);
