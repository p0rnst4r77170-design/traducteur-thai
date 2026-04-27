module.exports = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.send("Ecris un mot !");

  try {
    // On utilise l'API de Lingva (un miroir open-source) qui force la phonétique
    const url = `https://lingva.ml/api/v1/fr/th/${encodeURIComponent(q)}`;
    
    const response = await fetch(url);
    const data = await response.json();

    // On cherche spécifiquement la prononciation dans la réponse
    // Si Lingva la donne, elle est dans data.info.pronunciation
    const phonetique = data.info && data.info.pronunciation ? data.info.pronunciation : null;
    const traduction = data.translation;

    if (phonetique) {
      // On nettoie les petits accents bizarres pour que ce soit lisible
      res.send(phonetique.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    } else {
      // Si même lui ne donne que le Thaï, on renvoie la traduction brute
      res.send(traduction);
    }

  } catch (err) {
    res.send("Erreur de connexion au traducteur");
  }
};
