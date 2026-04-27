const translate = require('google-translate-api-x');

module.exports = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.send("Ecris un texte !");

  try {
    const result = await translate(q, { 
      from: 'fr',
      to: 'th',
      forceBatch: false 
    });
    
    // Le secret : result.transliteration contient la phonétique (ex: Sawatdee)
    // Si elle existe, on l'envoie, sinon on envoie le texte
    if (result.transliteration) {
      res.send(result.transliteration);
    } else {
      res.send(result.text);
    }
  } catch (err) {
    res.send("Erreur de traduction");
  }
};
