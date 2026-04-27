const http = require('http');
const romanize = require('thai-romanization');

const server = http.createServer(async (req, res) => {
  // Cette ligne permet de récupérer "q" peu importe comment l'URL est écrite
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get('q');

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  // Si on ne trouve pas de texte, on donne un mode d'emploi au lieu d'une erreur
  if (!q) {
    return res.end("Ajoute ?q=tonmot a la fin de l'adresse");
  }

  try {
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=th&dt=t&q=${encodeURIComponent(q)}`;
    const response = await fetch(googleUrl);
    const data = await response.json();
    
    const texteThai = data[0][0][0];
    const phonetique = romanize(texteThai);

    res.end(phonetique);
  } catch (err) {
    res.end("Erreur de traduction");
  }
});

server.listen(process.env.PORT || 3000);
