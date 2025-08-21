// code for how the retriver works 
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// adding a retriver, that gets the closet match according to the semantic value of the question

// create embeddings and a client that searches inside the vector store and retrives the most relevant data chunks
const url = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;
const googleAPIkey = import.meta.env.VITE_GOOGLE_API_KEY;

const client = createClient(url, apiKey);

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: googleAPIkey,
  model: "gemini-embedding-001",
});

const vectorStore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "documents",
  queryName: "match_documents",
});

const retriver = vectorStore.asRetriever() // this is a method that allows us to easily search and retrive relevant data chunks from the DB, without having to manually do anything, similar to the .fromDocuments() method that does all converting on its own 
export default retriver