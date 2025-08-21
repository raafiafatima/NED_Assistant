import { ChatHeader } from "./components/ChatHeader";
import retriver from "./utils/Retriever/retriever";
import { combineDocs } from "./utils/CombineDocs/combineDocs";
import { useState } from "react";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { ChatInput } from "./components/ChatInput";
import { ChatMessage } from "./components/ChatMessage";
import { formatConvo } from "./utils/FormatConvo/formatConvo";
import { useRef } from "react";
import { useEffect } from "react";

function App() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      question: "Hi! how can I assist you?",
      isUser: false,
    },
  ]);
  const [value, setValue] = useState("");
  const [convoHistory, setConvoHistory] = useState([])
  const chatContainerRef = useRef(null)

  useEffect(() => {
    if (chatContainerRef.current) {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }
  }, [loading, messages])

  // calling LLM
  const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: googleApiKey,
  });

  // making standalone question
  const standaloneQuesTemplate = `Given some history (if any) and a question, turn it into a standalone question.
  conversation history : {convo_history}
   question : {question}
    standalone_question :`;
  const standalonePrompt = PromptTemplate.fromTemplate(standaloneQuesTemplate);

  //formatting response
  const answerTemplate = `You are a helpful and professional academic advisor bot for NED University. Your primary function is to answer questions about the university based on provided context and conversation history. Prioritize finding answers within the provided context. If not found, search the conversation history. If the answer is unavailable in both sources, state: 'I'm sorry, I don't know the answer to that. For further assistance, please contact registrar@neduet.edu.pk.' Donot fabricate answers. In addition to answering questions, you will offer study tips and course guidance tailored to student interests. Maintain a formal and objective tone, providing only factual information and established guidance. Greet the user only once. Donot add any bold or italic text, keep it simple and plain. 
  conversation history : {convo_history}
  context: {context} 
  question: {question} 
  answer:`;
  const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

  // making indiviual chains for each step
  const standaloneChain = standalonePrompt
    .pipe(llm)
    .pipe(new StringOutputParser()); // made via pipe method
  const retrieverChain = RunnableSequence.from([
    (prevRes) => prevRes.standalone_question,
    retriver,
    combineDocs,
  ]);
  const answerChain = RunnableSequence.from([
    answerPrompt,
    llm,
    new StringOutputParser(),
  ]);

  // chaining the responses together via Runnable Sequence
  const chain = RunnableSequence.from([
    {
      standalone_question: standaloneChain,
      original_question: new RunnablePassthrough(),
    },
    {
      context: retrieverChain,
      question: ({ original_question }) => original_question.question,
      convo_history : ({original_question}) => original_question.convo_history
    },
    answerChain,
  ]);

//handle submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    const newMsg = {
      question: value,
      isUser: true,
    };
    setMessages([...messages, newMsg]);
    setValue("");
    setLoading(true);

    const response = await chain.invoke({
      question: value,
      convo_history : formatConvo(convoHistory)
    });
    setMessages((prev) => [...prev, { question: response, isUser: false }]);
    if (response) setLoading(false);
    setConvoHistory((prev) => [...prev, value, response])
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-[#f5f0e8]">
        <ChatHeader />
        <div ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <ChatMessage message={msg} />
          ))}
          {loading && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-[#f5f0e8] rounded-2xl">
              <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
              <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
            </div>
          )}
        </div>
        <ChatInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}

export default App;
