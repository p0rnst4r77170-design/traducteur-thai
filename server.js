const http = require('http');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get('q');

  if (!q) {
    res.end("Ecris un mot !");
    return;
  }

  try {
    // On utilise l'API la plus stable
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=th&dt=rm&dt=t&q=${encodeURIComponent(q)}`;
    
    const response = await fetch(googleUrl);
    const data = await response.json();

    // On cherche la phonétique dans la structure exacte de Google
    let phonetique = "";
    
    if (data && data[0]) {
      // Google place la phonétique dans le premier bloc, à l'index 3 ou 2
      for (let i = 0; i < data[0].length; i++) {
        if (data[0][i][3]) {
          phonetique = data[0][i][3];
          break;
        }
      }
    }

    // Si on a trouvé la phonétique, on l'envoie sans les accents bizarres
    if (phonetique) {
      const propre = phonetique.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      res.end(propre);
    } else {
      // Si Google fait encore de la résistance, on donne le mot Thaï par défaut
      res.end(data[0][0][0]);
    }

  } catch (err) {
    res.end("Probleme de connexion");
  }
});

server.listen(process.env.PORT || 3000);
