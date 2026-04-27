const translate = require('google-translate-api-x');

module.exports = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.send("Ecris un texte !");

  try {
    const result = await translate(q, { 
      to: 'th',
      forceBatch: false 
    });
    
    // Si Google renvoie la phonétique (ex: Sawatdee), on l'affiche. 
    // Sinon on affiche le texte.
    res.send(result.transliteration || result.text);
  } catch (err) {
    res.send("Erreur de traduction");
  }
};
