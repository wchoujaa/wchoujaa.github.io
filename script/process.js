var doct;
async function process(article, percent) {
  //get the wikipedia plaintext with wtf_wikipedia
  //let text =  await wtf.fetch(article).then(doc=> doc.plaintext());
  let doc =  await wtf.fetch(article);
  //get all the nouns from the text
  //let nouns = nlp(text).nouns()
  //sort them by frequency
  //var ls = nouns.out('topk').slice(0,percent);
  var ls = doc.section(0).links();
  var seeAlsoSection = doc.sections('see also');
  
  console.log(percent);
  console.log(seeAlsoSectin);
  
  if(percent && percent != -1)
    ls = ls.slice(0,percent);

  if(seeAlsoSection){
    ls.concat(seeAlsoSection.links());
  }
  return ls;
}
