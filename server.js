const http = require('http');
// On utilise 'require' car Render tourne sous un Node standard
const romanize = require('thai-romanization');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get('q');

  // On définit l'encodage pour éviter les caractères bizarres
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (!q) {
    return res.end("Ecris un mot dans l'URL !");
  }

  try {
    // 1. On récupère la traduction brute (le texte thaï)
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=th&dt=t&q=${encodeURIComponent(q)}`;
    const response = await fetch(googleUrl);
    const data = await response.json();
    
    if (!data || !data[0] || !data[0][0]) {
        return res.end("Erreur Google");
    }

    const texteThai = data[0][0][0];

    // 2. On transforme le thaï en phonétique locale
    const phonetique = romanize(texteThai);

    // 3. On envoie le résultat final
    res.end(phonetique || texteThai);

  } catch (err) {
    console.error(err);
    res.end("Erreur interne du serveur");
  }
});

// Port dynamique pour Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur prêt sur le port ${PORT}`);
});
