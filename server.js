const http = require('http');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get('q');

  if (!q) {
    res.end("Ecris un mot !");
    return;
  }

  try {
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=th&dt=rm&dt=t&q=${encodeURIComponent(q)}`;
    const response = await fetch(googleUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36' }
    });
    const data = await response.json();

    let phonetique = "";
    if (data && data[0]) {
      for (let i = 0; i < data[0].length; i++) {
        if (data[0][i][3]) {
          phonetique = data[0][i][3];
          break;
        }
      }
    }

    const final = phonetique ? phonetique.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : data[0][0][0];
    res.end(final);
  } catch (err) {
    res.end("Erreur");
  }
});

server.listen(process.env.PORT || 3000);
