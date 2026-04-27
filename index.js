const http = require('http');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get('q');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (!q) return res.end("Ajoute ?q=tonmot");

  try {
    // On utilise l'URL qui simule exactement un navigateur mobile
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=th&dt=rm&dt=t&q=${encodeURIComponent(q)}`;
    
    const response = await fetch(googleUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await response.json();

    // On va chercher la phonétique (souvent à l'index 3 ou 2 du premier tableau)
    let resultat = "";
    if (data && data[0]) {
      for (let i = 0; i < data[0].length; i++) {
        if (data[0][i][3]) {
          resultat = data[0][i][3];
          break;
        }
      }
    }

    // Si on a la phonétique, on enlève les accents bizarres, sinon on donne le thaï
    const final = resultat 
      ? resultat.normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
      : data[0][0][0];

    res.end(final);
  } catch (err) {
    res.end("Erreur service");
  }
});

server.listen(process.env.PORT || 3000);
