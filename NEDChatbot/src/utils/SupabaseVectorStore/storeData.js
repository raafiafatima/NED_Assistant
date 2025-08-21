
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import fs from "fs/promises";

// ------------------------------CONFIG------------------------------------

const url = import.meta.env.VITE_SUPABASE_URL
const apikey = process.env.VITE_SUPABASE_API_KEY;
const googleapikey = process.env.VITE_GOOGLE_API_KEY;

// ---------------------------------UITILS-----------------------------------

// read file
async function readText(filePath) {
  const text = await fs.readFile(filePath, "utf-8");
  return text;
}

// create chunks
async function spliText(text, chunkSize = 500, chunkOverlap = 50) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
    separators: ["\n\n", "\n", " ", ""],
  });

  const output = await splitter.createDocuments([text]);
  return output;
}

// get embeddings
function getEmbeddings(modal = "google") {
  switch (modal) {
    case "google":
      const embed =  new GoogleGenerativeAIEmbeddings({
        apiKey: googleapikey,
        model: "gemini-embedding-001",
      });
      console.log('success')
      return embed

    default:
      console.log("Embeddings Modal", modal);
      break;
  }
}

// store in supabase
async function storeEmbeddings(document, embeddings, Tname) {
  const client = createClient(url, apikey);
  try {
    await SupabaseVectorStore.fromDocuments(document, embeddings, {
      client,
      tableName: Tname,
    });
    console.log(`✅ Data stored in table "${tableName}"`);
  } catch (error) {
    console.log("Error :: Store Service", error.message);
  }
}

// main flow

async function processFiletoSupabase(file, modal) {
  try {
    const text = await readText(file);
    const chunks = await spliText(text);
    const embedding = getEmbeddings(modal);
    await storeEmbeddings(chunks, embedding, "documents");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

export default processFiletoSupabase