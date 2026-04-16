import { cn } from "@/lib/utils";

type Emotion = "Happy" | "Sad" | "Angry" | "Fear" | "Surprise" | "Neutral";

interface EmotionResultProps {
  emotion: Emotion;
  confidence: "Low" | "Medium" | "High";
  explanation: string;
}

const emotionConfig: Record<Emotion, { emoji: string; colorClass: string; bgClass: string }> = {
  Happy: { emoji: "😊", colorClass: "text-emotion-happy", bgClass: "bg-emotion-happy/10 border-emotion-happy/30" },
  Sad: { emoji: "😢", colorClass: "text-emotion-sad", bgClass: "bg-emotion-sad/10 border-emotion-sad/30" },
  Angry: { emoji: "😠", colorClass: "text-emotion-angry", bgClass: "bg-emotion-angry/10 border-emotion-angry/30" },
  Fear: { emoji: "😨", colorClass: "text-emotion-fear", bgClass: "bg-emotion-fear/10 border-emotion-fear/30" },
  Surprise: { emoji: "😲", colorClass: "text-emotion-surprise", bgClass: "bg-emotion-surprise/10 border-emotion-surprise/30" },
  Neutral: { emoji: "😐", colorClass: "text-emotion-neutral", bgClass: "bg-emotion-neutral/10 border-emotion-neutral/30" },
};

const confidenceWidth = { Low: "w-1/3", Medium: "w-2/3", High: "w-full" };

const EmotionResult = ({ emotion, confidence, explanation }: EmotionResultProps) => {
  const config = emotionConfig[emotion];

  return (
    <div className={cn("animate-fade-in-up rounded-xl border-2 p-6 space-y-5", config.bgClass)}>
      <div className="flex items-center gap-4">
        <span className="text-5xl">{config.emoji}</span>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Detected Emotion</p>
          <p className={cn("text-2xl font-bold", config.colorClass)}>{emotion}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-muted-foreground">Confidence</span>
          <span className="font-semibold">{confidence}</span>
        </div>
        <div className="h-2.5 rounded-full bg-secondary">
          <div className={cn("h-full rounded-full transition-all duration-700", confidenceWidth[confidence])}
            style={{ backgroundColor: `hsl(var(--emotion-${emotion.toLowerCase()}))` }} />
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-muted-foreground">Explanation</p>
        <p className="text-sm leading-relaxed text-foreground/80">{explanation}</p>
      </div>
    </div>
  );
};

export default EmotionResult;
