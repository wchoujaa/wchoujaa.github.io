async function process(article, percent) {
  //get the wikipedia plaintext with wtf_wikipedia
  let text =  await wtf.fetch(article).then(doc=>doc.plaintext())
  //get all the nouns from the text
  let nouns = nlp(text).nouns()
  //sort them by frequency
  var ls = nouns.out('topk').slice(0,percent);

  return ls;
}
