module.exports = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.send("Ecris un mot !");

  try {
    // On appelle une URL différente qui est connue pour renvoyer la phonétique plus facilement
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=th&dt=t&dt=rm&q=${encodeURIComponent(q)}`;
    
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await response.json();

    // Analyse de la réponse complexe de Google :
    // On cherche la ligne qui contient du texte latin au milieu du Thaï
    let phonetique = "";
    
    if (data[0]) {
      data[0].forEach(partie => {
        if (partie[3]) { // Le 4ème élément du tableau est souvent la phonétique
          phonetique = partie[3];
        }
      });
    }

    // Si on a trouvé la phonétique, on l'envoie. Sinon, on envoie le Thaï.
    res.send(phonetique || data[0][0][0]);

  } catch (err) {
    res.send("Erreur");
  }
};
