const http = require('http');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get('q');

  if (!q) {
    res.end("Ecris un mot !");
    return;
  }

  try {
    // On change radicalement l'URL pour simuler une requête de dictionnaire
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=th&dt=t&dt=rm&dj=1&q=${encodeURIComponent(q)}`;
    
    const response = await fetch(googleUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await response.json();

    // Avec "dj=1", Google renvoie un JSON structuré (plus facile à lire)
    let phonetique = "";
    
    if (data.sentences) {
      data.sentences.forEach(s => {
        if (s.src_translit) phonetique = s.src_translit; // Phonétique source
        if (s.translit) phonetique = s.translit; // Phonétique cible (Thaï)
      });
    }

    if (phonetique) {
      // Nettoyage des accents
      const propre = phonetique.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      res.send(propre);
    } else {
      // Si Google ne donne RIEN en phonétique, on tente une ruse : 
      // on renvoie la traduction mais on ne peut pas forcer la phonétique si elle n'est pas dans le JSON
      res.end(data.sentences[0].trans);
    }

  } catch (err) {
    res.end("Erreur");
  }
});

server.listen(process.env.PORT || 3000);
