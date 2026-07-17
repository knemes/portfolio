import { useState, useEffect, FormEvent } from "react";
import { Send, Mail, Trash2, Github, Linkedin } from "lucide-react";
import PageContainer from "../PageContainer";

interface Page6ContactProps {
  isDrawingActive: boolean;
  totalPages: number;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  date: string;
  rating?: number;
}

export default function Page6Contact({ isDrawingActive, totalPages }: Page6ContactProps) {
  // Message Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formRating, setFormRating] = useState<number>(5);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [messagesList, setMessagesList] = useState<Message[]>([]);

  // Load contact messages from LocalStorage on mount
  useEffect(() => {
    try {
      const savedMsgs = localStorage.getItem("notebook_messages");
      if (savedMsgs) {
        setMessagesList(JSON.parse(savedMsgs));
      } else {
        // Seed default messages for high fidelity
        const seedMsgs: Message[] = [
          {
            id: "seed-1",
            name: "Alex Rivera",
            email: "alex@designco.io",
            subject: "Exceptional Concept!",
            body: "Your fluid notebook portfolio is incredible! The drawing canvas integration is a stroke of genius. Let's connect next week about our upcoming Interactive WebGL design project.",
            date: "Jul 12, 2026",
            rating: 5,
          },
          {
            id: "seed-2",
            name: "Sarah Jenkins",
            email: "sjenkins@creative-lab.dev",
            subject: "Amazing sketchbook vibe!",
            body: "I love that my doodles are saved per-page. Keep pushing the boundaries of web experiences!",
            date: "Jul 13, 2026",
            rating: 5,
          },
        ];
        setMessagesList(seedMsgs);
        localStorage.setItem("notebook_messages", JSON.stringify(seedMsgs));
      }
    } catch (e) {
      console.error("Error loading local storage data", e);
    }
  }, []);

  // Form submission handler (local mock)
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formBody) return;

    const newMsg: Message = {
      id: Math.random().toString(36).substring(2, 9),
      name: formName,
      email: formEmail,
      subject: formSubject || "Excellent Portfolio",
      body: formBody,
      rating: formRating,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    const updated = [newMsg, ...messagesList];
    setMessagesList(updated);
    localStorage.setItem("notebook_messages", JSON.stringify(updated));

    setFormSubmitted(true);
    // Reset form fields
    setFormName("");
    setFormEmail("");
    setFormSubject("");
    setFormBody("");
    setFormRating(5);

    // Automatically dismiss the success state after 4 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 4000);
  };

  const deleteMessage = (id: string) => {
    const updated = messagesList.filter((m) => m.id !== id);
    setMessagesList(updated);
    localStorage.setItem("notebook_messages", JSON.stringify(updated));
  };

  return (
    <PageContainer
      pageNumber={6}
      totalPages={totalPages}
      title="05. Public Review Board & Comments"
      category="GUESTBOOK"
      drawingActive={isDrawingActive}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
        
        {/* Left: Standardized Info and Form (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between py-1 text-left space-y-4">
          <div className="space-y-3">
            <span className="text-[10px] font-mono bg-[#1A1A1A] text-white px-2.5 py-1 uppercase tracking-widest inline-block w-fit">
              Guestbook
            </span>
            <h3 className="text-2xl md:text-3xl font-serif italic text-[#1A1A1A] leading-tight">
              Review Board
            </h3>
            <p className="text-sm md:text-base text-[#1A1A1A]/80 leading-relaxed font-serif italic">
              Leave your feedback, ratings, and comments. Submissions are dynamically updated and rendered on the community wall.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="p-4 bg-[#EAE7DF]/60 border border-[#1A1A1A]/10 space-y-3 relative font-mono text-[11px] text-[#1A1A1A]">
            
            {formSubmitted && (
              <div className="absolute inset-0 bg-[#F4F1EA]/95 backdrop-blur rounded-none flex flex-col items-center justify-center text-center p-6 z-20">
                <div className="w-12 h-12 rounded-none bg-stone-100 text-[#1A1A1A] flex items-center justify-center mb-3 border border-[#1A1A1A]/10">
                  <Send className="w-5 h-5 animate-bounce" />
                </div>
                <h4 className="text-xs font-serif italic font-bold text-[#1A1A1A]">
                  REVIEW PUBLISHED!
                </h4>
                <p className="text-xs text-[#1A1A1A]/60 max-w-xs mt-1 leading-relaxed font-serif italic">
                  Thank you! Your comments have been appended to our public feedback board.
                </p>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider pb-1.5 border-b border-[#1A1A1A]/10">
              <Mail className="w-3.5 h-3.5 text-[#1A1A1A]/60" />
              <span>Review Submission</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label htmlFor="form-name" className="text-[9px] font-mono font-bold text-[#1A1A1A]/40 uppercase block">Name</label>
                <input
                  id="form-name"
                  type="text"
                  placeholder="Your Name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="w-full text-[10px] font-mono px-2 py-1.5 border border-[#1A1A1A]/15 rounded-none focus:outline-none focus:border-[#1A1A1A] bg-white/60"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="form-email" className="text-[9px] font-mono font-bold text-[#1A1A1A]/40 uppercase block">Email</label>
                <input
                  id="form-email"
                  type="email"
                  placeholder="name@email.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                  className="w-full text-[10px] font-mono px-2 py-1.5 border border-[#1A1A1A]/15 rounded-none focus:outline-none focus:border-[#1A1A1A] bg-white/60"
                />
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-1">
              <label className="text-[9px] font-mono font-bold text-[#1A1A1A]/40 uppercase block">Rating Score</label>
              <div className="flex gap-1.5 items-center my-0.5 bg-white/40 p-1 px-2 border border-[#1A1A1A]/10">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    id={`btn-form-star-${starVal}`}
                    type="button"
                    key={starVal}
                    onClick={() => setFormRating(starVal)}
                    className="p-0.5 focus:outline-none transition-all hover:scale-110 cursor-pointer border-none bg-transparent"
                  >
                    <span className={`text-base font-mono leading-none transition-all ${
                      starVal <= formRating 
                        ? "font-black text-[#1A1A1A] opacity-100" 
                        : "font-normal text-[#1A1A1A]/20"
                    }`}>
                      *
                    </span>
                  </button>
                ))}
                <span className="text-[9px] font-mono text-[#1A1A1A]/50 ml-2">
                  ({formRating} / 5 stars)
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="form-subject" className="text-[9px] font-mono font-bold text-[#1A1A1A]/40 uppercase block">Review Headline</label>
              <input
                id="form-subject"
                type="text"
                placeholder="e.g., Brilliant design layout!"
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                className="w-full text-[10px] font-mono px-2 py-1.5 border border-[#1A1A1A]/15 rounded-none focus:outline-none focus:border-[#1A1A1A] bg-white/60"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="form-body" className="text-[9px] font-mono font-bold text-[#1A1A1A]/40 uppercase block">Review Comment</label>
              <textarea
                id="form-body"
                rows={2}
                placeholder="Write comments or doodles feedback here..."
                value={formBody}
                onChange={(e) => setFormBody(e.target.value)}
                required
                className="w-full text-[10px] font-sans px-2 py-1.5 border border-[#1A1A1A]/15 rounded-none focus:outline-none focus:border-[#1A1A1A] bg-white/60 resize-none font-sans"
              />
            </div>

            <button
              id="btn-submit-contact"
              type="submit"
              className="w-full py-2 bg-[#1A1A1A] hover:bg-[#2c2a29] text-white rounded-none text-[10px] font-mono font-semibold tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none shadow-sm"
            >
              <Send className="w-3 h-3" />
              <span>POST TO BOARD</span>
            </button>
          </form>

          <div className="text-[10px] font-mono text-[#1A1A1A]/40 border-t border-[#1A1A1A]/10 pt-3 uppercase tracking-widest">
            💡 Review data is persisted locally in your client's web storage.
          </div>
        </div>

        {/* Right: Public Message Feed Board (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="w-full h-[380px] md:h-[420px] bg-[#EAE7DF]/60 border border-[#1A1A1A]/10 overflow-hidden relative flex flex-col shadow-inner">
            
            {/* Header bar matches standards */}
            <div className="p-2 border-b border-[#1A1A1A]/10 bg-[#F4F1EA]/80 backdrop-blur flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]/60 animate-pulse"></span>
                <span className="text-[9px] font-mono font-medium text-[#1A1A1A] uppercase tracking-wider">Live Feedback Wall</span>
              </div>
              <span className="text-[9px] font-mono text-[#1A1A1A]/40">TOTAL_POSTS::{(messagesList || []).length}</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-transparent">
              {messagesList.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center text-[#1A1A1A]/40 font-mono text-[10px] p-6 space-y-2">
                  <Mail className="w-8 h-8 text-[#1A1A1A]/20" />
                  <span>No public reviews received yet. Use the left form to post your review!</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {messagesList.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 border border-[#1A1A1A]/10 rounded-none bg-[#F4F1EA]/50 hover:bg-[#F4F1EA] transition-colors text-left text-xs space-y-1.5 relative group"
                    >
                      <button
                        id={`btn-delete-msg-${m.id}`}
                        onClick={() => deleteMessage(m.id)}
                        className="absolute top-2 right-2 p-1 rounded-none hover:bg-red-50 text-[#1A1A1A]/30 hover:text-red-600 transition-colors cursor-pointer border-none bg-transparent"
                        title="Delete review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex justify-between items-center pr-6">
                        <span className="font-mono font-bold text-[#1A1A1A]">{m.name}</span>
                        <span className="text-[9px] font-mono text-[#1A1A1A]/40">{m.date}</span>
                      </div>

                      {/* Rating display */}
                      <div className="flex gap-0.5 py-0.5">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <span
                            key={starVal}
                            className={`text-sm font-mono leading-none ${
                              starVal <= (m.rating || 5)
                                ? "font-black text-[#1A1A1A] opacity-100"
                                : "font-normal text-[#1A1A1A]/20"
                            }`}
                          >
                            *
                          </span>
                        ))}
                      </div>

                      <div className="text-[9px] font-mono text-[#1A1A1A]/50">
                        Review: <span className="text-[#1A1A1A]/70 font-bold">{m.subject}</span>
                      </div>

                      <p className="text-[#1A1A1A]/80 leading-relaxed pr-2 font-serif italic">
                        "{m.body}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-4 text-xs font-mono text-[#1A1A1A]/50 pt-3 border-t border-[#1A1A1A]/10 mt-3">
            <a
              id="link-github"
              href="https://github.com/knemes/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#1A1A1A] transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GITHUB</span>
            </a>
            <span>•</span>
            <a
              id="link-linkedin"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#1A1A1A] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>LINKEDIN</span>
            </a>
            <span>•</span>
            <a
              id="link-email"
              href="mailto:kknemes@gmail.com"
              className="flex items-center gap-1.5 hover:text-[#1A1A1A] transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>EMAIL</span>
            </a>
          </div>
        </div>

      </div>
    </PageContainer>
  );
}
