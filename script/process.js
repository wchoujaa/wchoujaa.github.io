var see;
var doct;
var ls2;
async function process(metadata, langage, percent) {
  var ls = []
  //get the wikipedia plaintext with wtf_wikipedia
  //let text =  await wtf.fetch(article).then(doc=> doc.plaintext());
  if (!dictionaryLink[metadata.id]) {
    await wtf.fetch(metadata.name, langage, (err, doc) => {
      if (err) {
        return ls;
      }
      doct = doc;

      ls = doc.links();
      dictionaryLink[metadata.id] = ls;
      if (metadata && doc.section(0) && doc.section(0).data.paragraphs[0] && doc.section(0).data.paragraphs[0].sentences()[0])
        dictionary[metadata.id] = doc.section(0).data.paragraphs[0].sentences()[0].data.text;

    });
  } else {
    ls = dictionaryLink[metadata.id];
  }




  
  if (percent && ls.length > 0){
    ls = ls.slice(0,  ls.length * (percent/100) );

  }
 
  return ls;
}