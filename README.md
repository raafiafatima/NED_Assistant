
# The NED Assistant  

The **NED Assistant** is an AI-powered chatbot built for students, faculty, and visitors of **NED University**. It provides quick answers to queries based on official university documents, using **LangChain**, **Supabase**, and **Google Gemini AI**.  

---

##  Features  
- **Conversational Chatbot** – Ask questions naturally and get friendly, contextual answers.  
- **Knowledge Retrieval** – Uses **Supabase Vector Store** to fetch relevant NED documents.  
- **AI-Powered Responses** – Generates helpful answers using **Gemini 2.0 Flash**.  
- **Loading Animation** – Displays a typing indicator while the bot thinks.  
- **Auto-Scroll** – Chat window automatically scrolls to the latest message.  

---

## Tech Stack  
- **Frontend:** React + Vite + TailwindCSS  
- **Backend / AI:** LangChain + Google Generative AI (Gemini)  
- **Database:** Supabase (Vector Store for embeddings)  
- **Embeddings:** Gemini Embeddings (`gemini-embedding-001`)  

---

## Setup Instructions  

1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/ned-assistant.git
   cd ned-assistant
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your keys:  
   ```env
   VITE_GOOGLE_API_KEY=your_google_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_API_KEY=your_supabase_key
   ```
4. Create a Supabase account and run the following code snippet in your SQL Editor to make a table for storing vector embeddings:

```sql
-- Create table for documents with embeddings
create table documents (
  id bigserial primary key,
  content text,        -- corresponds to Document.pageContent
  metadata jsonb,      -- corresponds to Document.metadata
  embedding vector(3072) -- 3072 dims for Google GenAI embeddings
);

-- Function to perform semantic similarity search
create or replace function match_documents (
  query_embedding vector(3072),
  match_count int DEFAULT null,
  filter jsonb DEFAULT '{}'
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Function to perform keyword-based matching (fallback)
create or replace function kw_match_documents(
  query_text text,
  match_count int
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity real
)
language plpgsql
as $$
begin
  return query execute
  format(
    'select id, content, metadata, ts_rank(to_tsvector(''english'', content), plainto_tsquery($1)) as similarity
     from documents
     where to_tsvector(''english'', content) @@ plainto_tsquery($1)
     order by similarity desc
     limit $2'
  )
  using query_text, match_count;
end;
$$;

   ```
5. Run the storeData.js file from the SupabaseVectorStore folder to populate the documents table
   
7. Start the dev server:

   ```bash
   npm run dev
   ```

---

## Preview  
<img width="1917" height="875" alt="image" src="https://github.com/user-attachments/assets/96a8a09c-9d1e-40e0-ba29-44c532c806ea" />


---

## Notes  
- If the bot cannot find an answer in the documents, it will politely reply with:  
  *“I’m sorry, I don’t know the answer to that. Please email registrar@neduet.edu.pk.”*  
- Ensure that your **Supabase `documents` table** is populated with relevant data before running.  

---

## Author  
Developed by **[Raafia Fatima]** 
Thanks for reading :)
