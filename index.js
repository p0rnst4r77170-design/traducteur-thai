const http = require('http');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get('q');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (!q) return res.end("Ecris un mot !");

  try {
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=th&dt=t&dt=rm&q=${encodeURIComponent(q)}`;
    
    const response = await fetch(googleUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await response.json();

    let phonetique = "";
    if (data && data[0]) {
      for (let i = 0; i < data[0].length; i++) {
        if (data[0][i][3]) {
          phonetique = data[0][i][3];
          break;
        } else if (data[0][i][2]) {
          phonetique = data[0][i][2];
        }
      }
    }

    const final = phonetique 
      ? phonetique.normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
      : data[0][0][0];

    res.end(final);

  } catch (err) {
    res.end("Erreur de service");
  }
});

// IMPORTANT : On force l'ecoute sur 0.0.0.0 pour Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur pret sur le port ${PORT}`);
});
