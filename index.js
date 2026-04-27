const http = require('http');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get('q');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (!q) return res.end("Ecris un mot !");

  try {
    // On utilise l'API Google avec le client 'gtx' et le paramètre 'rm' pour la phonétique
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=th&dt=rm&dt=t&q=${encodeURIComponent(q)}`;
    
    const response = await fetch(googleUrl);
    const data = await response.json();

    // On cherche la phonétique dans la réponse (généralement à l'index 1 du premier groupe)
    let phonetique = "";
    if (data && data[0] && data[0][1]) {
        phonetique = data[0][1][3] || data[0][0][1];
    }

    if (phonetique) {
      // On retire les accents bizarres pour que ce soit lisible sur Twitch
      const final = phonetique.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      res.end(final);
    } else {
      // Si vraiment Google boude, on donne le mot thaï brut au lieu d'une erreur
      res.end(data[0][0][0]);
    }

  } catch (err) {
    res.end("Service indisponible");
  }
});

server.listen(process.env.PORT || 3000);
