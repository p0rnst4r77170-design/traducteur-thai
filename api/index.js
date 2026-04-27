const translate = require('google-translate-api-x');

module.exports = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.send("Ecris un texte !");

  try {
    // On fait la traduction
    const result = await translate(q, { 
      to: 'th',
      forceBatch: false 
    });

    // On cherche la phonétique dans les données renvoyées par Google
    // Si 'transliteration' existe, on l'affiche, sinon on donne le texte thaï
    const reponse = result.transliteration || result.text;
    
    res.send(reponse);
  } catch (err) {
    res.send("Erreur");
  }
};
