const translate = require('google-translate-api-x');

module.exports = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.send("Ecris un texte !");

  try {
    // On force la traduction en Thaï
    const result = await translate(q, { 
        from: 'fr', 
        to: 'th', 
        forceBatch: false // Aide à récupérer la phonétique plus souvent
    });
    
    // Le secret est ici : on cherche le champ 'transliteration'
    const phonetique = result.transliteration;

    if (phonetique) {
      res.send(phonetique);
    } else {
      // Si la phonétique échoue, on renvoie au moins le texte pour pas avoir d'erreur
      res.send(result.text); 
    }
  } catch (err) {
    res.send("Erreur Google");
  }
};
