const translate = require('google-translate-api-x');

module.exports = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.send("Ecris un texte !");

  try {
    const result = await translate(q, { 
      to: 'th',
      forceBatch: false
    });

    // On essaie de récupérer la phonétique (romanisation)
    // Dans cette version de l'API, c'est souvent dans 'transliteration'
    let phonetique = result.transliteration;

    // Si la phonétique est vide, on renvoie quand même le texte thaï 
    // pour ne pas avoir une réponse vide dans le chat
    res.send(phonetique || result.text);
  } catch (err) {
    res.send("Erreur de traduction");
  }
};
