var see;
var doct;
var ls2;
async function process(article, langage, percent) {

  //get the wikipedia plaintext with wtf_wikipedia
  //let text =  await wtf.fetch(article).then(doc=> doc.plaintext());
  let doc = await wtf.fetch(article, langage);

  doct = doc;

  let allLinks = doc.links();
  //get all the nouns from the text
  //let nouns = nlp(text).nouns()
  //sort them by frequency
  //var ls = nouns.out('topk').slice(0,percent);
  var ls = doc.links();//doc.section(0).links();
  var seeAlsoSection = doc.sections('See also');
  var secondSection = doc.sections(1);

  if (percent && percent != "max")
    ls = ls.slice(0, percent);
  /*   if (secondSection) {
      ls = ls.concat(secondSection.links().slice(0, percent));
    }
    if (seeAlsoSection) {
      ls = ls.concat(seeAlsoSection.links().slice(0, percent));
    } */
  return ls;
}

async function processSummary(article, langage) {
  let doc = await wtf.fetch(article, langage);

  dictionary[article] = doc.section(0).data.paragraphs[0].sentences()[0].data.text;

}
