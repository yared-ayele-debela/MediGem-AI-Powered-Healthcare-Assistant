// app/patient/chat/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function PatientChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm MediGem, your AI health assistant. You can speak or type to book an appointment, check your schedule, or ask anything!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Voice Recognition Setup
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      console.log("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      handleSend(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = { role: "user", content: messageText, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();

      if (data.bookingIntent) {
        // BOOK APPOINTMENT
        const booking = data.bookingData;
        const token = localStorage.getItem("patient_token");

        try {
          const bookRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              doctor_id: booking.doctorId,
              appointment_date: booking.date,
              start_time: booking.time,
              patient_notes: `AI Booking: ${messageText}`,
            }),
          });

          if (bookRes.ok) {
            const successMsg: Message = {
              role: "assistant",
              content: `Success! Your appointment with ${booking.doctorName} on ${booking.date} at ${booking.time} is booked and pending approval. You'll get a WhatsApp confirmation soon!`,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, successMsg]);
            speak(successMsg.content);
          }
        } catch (err) {
          const errMsg: Message = {
            role: "assistant",
            content: "Sorry, that time is not available. Please try another time.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errMsg]);
        }
      } else {
        const aiMsg: Message = { role: "assistant", content: data.response, timestamp: new Date() };
        setMessages((prev) => [...prev, aiMsg]);
        speak(data.response);
      }
    } catch (err) {
      const errMsg: Message = {
        role: "assistant",
        content: "I'm having trouble connecting. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      <header className="bg-teal-600 text-white p-5 text-center">
        <h1 className="text-2xl font-bold">MediGem AI Assistant</h1>
        <p className="text-sm opacity-90">Speak or type • I understand everything</p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-5 py-4 rounded-3xl shadow-lg ${
                msg.role === "user" ? "bg-teal-600 text-white" : "bg-white text-gray-800 border"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <p className="text-xs opacity-70 mt-2">
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-5 py-4 rounded-3xl shadow">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Speak or type your message..."
            className="flex-1 px-5 py-4 border rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={loading}
          />
          <Button
            onClick={toggleListening}
            size="icon"
            className={`${isListening ? "bg-red-600 animate-pulse" : "bg-teal-600"} hover:opacity-90`}
            disabled={!recognitionRef.current}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>
          <Button onClick={() => handleSend()} size="icon" className="bg-teal-600 hover:bg-teal-700">
            <Send className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}