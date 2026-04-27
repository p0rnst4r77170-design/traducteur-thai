const http = require('http');
const romanize = require('thai-romanization');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get('q');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (!q) return res.end("Ecris un mot !");

  try {
    // 1. On traduit en Thaï (MyMemory est gratuit et illimité)
    const trRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=fr|th`);
    const trData = await trRes.json();
    const thaiText = trData.responseData.translatedText;

    // 2. On transforme le Thaï en phonétique nous-mêmes
    const phonetique = romanize(thaiText);

    // 3. On nettoie les petits accents pour Twitch
    const final = phonetique.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    res.end(final);

  } catch (err) {
    res.end("Erreur");
  }
});

server.listen(process.env.PORT || 3000);
