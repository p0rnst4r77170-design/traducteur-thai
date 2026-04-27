module.exports = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.send("Ecris un mot !");

  try {
    // On utilise l'API MyMemory qui est plus ouverte
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=fr|th`;
    
    const response = await fetch(url);
    const data = await response.json();

    // MyMemory renvoie souvent la traduction et parfois la phonétique.
    // Si la phonétique n'est pas dispo, on va utiliser un petit moteur 
    // interne pour transformer le Thaï en lettres (Romanisation).
    
    const traduction = data.responseData.translatedText;
    
    // On renvoie la traduction. 
    // Note : Si MyMemory ne donne pas de phonétique, on va tenter 
    // de "forcer" un affichage latin via un second service.
    
    res.send(traduction);

  } catch (err) {
    res.send("Erreur service");
  }
};
