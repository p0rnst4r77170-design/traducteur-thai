const http = require('http');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get('q');

  if (!q) {
    res.end("Ecris un mot !");
    return;
  }

  try {
    // STRATÉGIE : On demande à l'API "Translate" mais via le client "t" (utilisé par Chrome)
    // C'est souvent la seule qui renvoie la phonétique quand les autres sont bloquées.
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=t&sl=fr&tl=th&dt=rm&dt=t&q=${encodeURIComponent(q)}`;
    
    const response = await fetch(googleUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    
    const data = await response.json();

    // La structure "client=t" est différente. La phonétique est cachée ici :
    let output = "";
    if (data && data[0] && data[0][0]) {
        // Dans le mode 't', la phonétique est souvent le dernier élément du premier tableau
        const row = data[0][0];
        output = row[row.length - 1]; 
    }

    // Si le résultat contient encore du Thaï, c'est que c'est raté, on nettoie sinon.
    if (output && !/[\u0E00-\u0E7F]/.test(output)) {
      const propre = output.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      res.end(propre);
    } else {
      // PLAN DE SECOURS : Si Google boude, on utilise une API de secours (LibreTranslate)
      const backupUrl = `https://libretranslate.de/translate`;
      const resBackup = await fetch(backupUrl, {
        method: "POST",
        body: JSON.stringify({ q, source: "fr", target: "th", format: "text" }),
        headers: { "Content-Type": "application/json" }
      });
      const dataBackup = await resBackup.json();
      res.end(dataBackup.translatedText || "Erreur Google");
    }

  } catch (err) {
    res.end("Erreur");
  }
});

server.listen(process.env.PORT || 3000);
