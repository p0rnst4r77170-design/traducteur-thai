module.exports = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.send("Ecris un mot !");

  try {
    // On utilise l'API client "gtx" qui est parfois plus généreuse sur la phonétique
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=th&dt=rm&dt=t&q=${encodeURIComponent(q)}`;
    
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await response.json();

    // Analyse très précise du tableau de réponse de Google
    // La phonétique est TOUJOURS au deuxième index du premier tableau, en position 3 ou 2
    let phonetique = "";
    
    if (data && data[0]) {
      // On parcourt les segments pour trouver celui qui contient des lettres latines
      for (let i = 0; i < data[0].length; i++) {
        if (data[0][i][3]) {
          phonetique = data[0][i][3];
          break;
        } else if (data[0][i][2] && /^[a-zA-Z]/.test(data[0][i][2])) {
          // Si on trouve un truc qui commence par une lettre normale (A-Z)
          phonetique = data[0][i][2];
          break;
        }
      }
    }

    // On renvoie la phonétique si trouvée, sinon on renvoie un message clair
    res.send(phonetique || "Désolé, Google ne donne pas la phonétique pour ce mot");

  } catch (err) {
    res.send("Erreur serveur");
  }
};
