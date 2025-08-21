// this is a function to combine the page contents of the different chunks so that we can have one cohesive piece of information. 

export function combineDocs(docs) {
    console.log("Docs received in combineDocs:", docs);
    return docs.map((doc) => doc.pageContent).join('\n\n')
}