import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import EmotionResult from "@/components/EmotionResult";

type Emotion = "Happy" | "Sad" | "Angry" | "Fear" | "Surprise" | "Neutral";
type Confidence = "Low" | "Medium" | "High";

interface AnalysisResult {
  emotion: Emotion;
  confidence: Confidence;
  explanation: string;
}

function analyzeEmotion(text: string): AnalysisResult {
  const lower = text.toLowerCase();

  const patterns: { emotion: Emotion; words: string[] }[] = [
    { emotion: "Happy", words: ["happy", "joy", "excited", "love", "great", "wonderful", "amazing", "glad", "thankful", "grateful", "awesome", "fantastic", "delighted", "pleased", "thrilled", "blessed", "celebrate", "smile", "laugh", "fun", "enjoy", "cheerful", "ecstatic", "euphoric", "elated"] },
    { emotion: "Sad", words: ["sad", "depressed", "unhappy", "miserable", "heartbroken", "grief", "sorrow", "lonely", "cry", "tears", "disappointed", "hopeless", "gloomy", "melancholy", "devastated", "hurt", "loss", "miss", "regret", "pain", "suffering", "broken"] },
    { emotion: "Angry", words: ["angry", "furious", "mad", "hate", "rage", "annoyed", "frustrated", "irritated", "outraged", "disgusted", "livid", "hostile", "resent", "infuriated", "bitter", "enraged", "pissed", "damn", "stupid", "terrible", "worst"] },
    { emotion: "Fear", words: ["scared", "afraid", "fear", "terrified", "anxious", "worried", "nervous", "panic", "dread", "horror", "frightened", "uneasy", "alarmed", "paranoid", "phobia", "threat", "danger", "helpless", "vulnerable", "overwhelmed"] },
    { emotion: "Surprise", words: ["surprised", "shocked", "amazed", "astonished", "unexpected", "unbelievable", "wow", "incredible", "stunning", "remarkable", "omg", "whoa", "cant believe", "no way", "speechless", "jaw dropped", "mind blown"] },
  ];

  const scores: Record<Emotion, number> = { Happy: 0, Sad: 0, Angry: 0, Fear: 0, Surprise: 0, Neutral: 0 };

  for (const { emotion, words } of patterns) {
    for (const word of words) {
      if (lower.includes(word)) scores[emotion] += 1;
    }
  }

  // Exclamation marks boost surprise/anger
  const exclamations = (text.match(/!/g) || []).length;
  if (exclamations >= 2) { scores.Surprise += 1; scores.Angry += 0.5; }

  // ALL CAPS boost anger
  const capsWords = (text.match(/\b[A-Z]{3,}\b/g) || []).length;
  if (capsWords >= 2) scores.Angry += 1.5;

  const maxScore = Math.max(...Object.values(scores));
  let emotion: Emotion = "Neutral";
  if (maxScore > 0) {
    emotion = (Object.entries(scores) as [Emotion, number][]).reduce((a, b) => b[1] > a[1] ? b : a)[0];
  }

  let confidence: Confidence = "Low";
  if (maxScore >= 4) confidence = "High";
  else if (maxScore >= 2) confidence = "Medium";
  else if (maxScore > 0) confidence = "Low";
  else confidence = "Medium"; // Neutral with medium confidence

  const explanations: Record<Emotion, string> = {
    Happy: "The text contains positive and uplifting language, suggesting feelings of joy, contentment, or excitement.",
    Sad: "The text conveys feelings of sadness, loss, or emotional pain through its word choices and tone.",
    Angry: "The text expresses frustration, hostility, or strong displeasure, indicating anger or irritation.",
    Fear: "The text reflects anxiety, worry, or a sense of threat, pointing to underlying fear or unease.",
    Surprise: "The text conveys a sense of astonishment or unexpectedness, suggesting the author was caught off guard.",
    Neutral: "The text appears balanced and matter-of-fact, without strong emotional indicators in either direction.",
  };

  return { emotion, confidence, explanation: explanations[emotion] };
}

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    setResult(analyzeEmotion(inputText));
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Emotion Analyzer
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
            Enter any text and discover the emotion behind the words.
          </p>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <Textarea
            placeholder="Type or paste your text here…"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[140px] resize-none text-base bg-card border-border/60 focus-visible:ring-primary/40"
          />
          <Button
            onClick={handleAnalyze}
            disabled={!inputText.trim()}
            className="w-full h-12 text-base font-semibold"
          >
            Analyze Emotion
          </Button>
        </div>

        {/* Result */}
        {result && <EmotionResult {...result} />}
      </div>
    </div>
  );
};

export default Index;
