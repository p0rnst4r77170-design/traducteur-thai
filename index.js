const http = require('http');
const troman = require('troman');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get('q');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (!q) return res.end("Ecris un mot !");

  try {
    // 1. Traduction en Thaï
    const trRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=fr|th`);
    const trData = await trRes.json();
    const thaiText = trData.responseData.translatedText;

    // 2. Transformation en phonétique (Romanisation)
    // On utilise troman.romanize()
    const phonetique = troman.romanize(thaiText);

    // 3. Nettoyage simple des accents pour Twitch
    const final = phonetique.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    res.end(final);

  } catch (err) {
    res.end("Erreur");
  }
});

server.listen(process.env.PORT || 3000);
