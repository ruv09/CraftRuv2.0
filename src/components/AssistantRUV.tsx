import React, { useState, useRef, useEffect } from "react";

async function getRUVResponse(input: string): Promise<string> {
  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: `Ты — помощник по 3D-моделированию мебели. Если пользователь просит создать объект, верни JSON вида {\"type\":\"шкаф\",\"width\":120,\"height\":200,\"depth\":60,\"material\":\"oak\"} без пояснений. Если вопрос обычный — просто ответь текстом. Запрос: ${input}`,
        stream: false
      })
    });
    const data = await res.json();
    return data.response || "Нет ответа от ИИ.";
  } catch (e) {
    return "Ошибка соединения с Ollama.";
  }
}

export const AssistantRUV: React.FC = () => {
  const [messages, setMessages] = useState([
    { from: "ruv", text: "Здравствуйте! Я РУВ — ваш помощник по проектированию мебели. Чем могу помочь?" }
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { from: "user", text: input }]);
    setInput("");
    setMessages((msgs) => [...msgs, { from: "ruv", text: "Печатаю ответ..." }]);
    const aiResponse = await getRUVResponse(input);

    // Попробуйте распарсить JSON
    let modelParams = null;
    try {
      modelParams = JSON.parse(aiResponse);
    } catch {}

    if (modelParams && modelParams.type) {
      // Вызовите функцию для генерации 3D-модели на сцене
      window.create3DModelFromAI?.(modelParams);
      setMessages((msgs) => [
        ...msgs.slice(0, -1),
        { from: "ruv", text: `Создаю ${modelParams.type} с параметрами: ширина ${modelParams.width}, высота ${modelParams.height}, глубина ${modelParams.depth}, материал ${modelParams.material}` }
      ]);
    } else {
      setMessages((msgs) => [
        ...msgs.slice(0, -1),
        { from: "ruv", text: aiResponse }
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl w-96 max-w-full z-50">
      <div className="bg-orange-500 text-white px-4 py-2 rounded-t-xl font-bold flex justify-between items-center">
        🤖 РУВ — ассистент
      </div>
      <div ref={chatRef} className="p-4 h-64 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${msg.from === "ruv" ? "text-left" : "text-right"}`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.from === "ruv"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex border-t p-2">
        <input
          className="flex-1 border rounded-l-lg px-3 py-2 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Спросите РУВ..."
        />
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded-r-lg"
          onClick={send}
        >
          Отправить
        </button>
      </div>
    </div>
  );
}; 