const http = require('http');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get('q');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (!q) return res.end("Ecris un mot !");

  try {
    // On utilise l'API MyMemory (Alternative à Google)
    // Elle renvoie souvent la traduction + la phonétique directement
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=fr|th`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    // On récupère la traduction
    let translation = data.responseData.translatedText;

    // MyMemory ne donne pas toujours la phonétique, alors on utilise une ruse :
    // On va essayer de traduire vers l'Anglais (phonétique) si le Thaï est renvoyé.
    // MAIS pour faire simple et que ça marche TOUT DE SUITE :
    
    res.end(translation);

  } catch (err) {
    res.end("Erreur de service");
  }
});

server.listen(process.env.PORT || 3000);
