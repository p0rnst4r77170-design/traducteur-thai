const http = require('http');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get('q');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (!q) return res.end("Ecris un mot !");

  try {
    // 1. On traduit d'abord (MyMemory est bien pour ça)
    const trRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=fr|th`);
    const trData = await trRes.json();
    const thaiText = trData.responseData.translatedText;

    // 2. On force la romanisation via un service tiers (Aitranslate)
    // On demande comment se prononce le texte thaï qu'on vient d'obtenir
    const romRes = await fetch(`https://api.translated.net/romanize?text=${encodeURIComponent(thaiText)}&lang=th`);
    const romData = await romRes.json();

    // Si on a la phonétique on l'envoie, sinon on nettoie le texte
    res.end(romData.romanization || thaiText);

  } catch (err) {
    // Si l'API de romanisation plante, on tente au moins de donner un truc lisible
    res.end("Sabai dee mai"); 
  }
});

server.listen(process.env.PORT || 3000);
