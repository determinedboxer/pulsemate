"use client";

import { useState } from "react";

interface SparksSenderProps {
  modelName: string;
  modelAvatar: string;
  sparksBalance: number;
  onSparksSent: (amount: number, message: string) => void;
  onClose: () => void;
}

const SPARK_ACTIONS = [
  { 
    id: "flirt", 
    name: "Flirty Message", 
    sparks: 1, 
    emoji: "😘",
    description: "Get a special flirty response",
    responseType: "flirt"
  },
  { 
    id: "intimate", 
    name: "Intimate Confession", 
    sparks: 3, 
    emoji: "💕",
    description: "Unlock a personal confession",
    responseType: "confession"
  },
  { 
    id: "compliment", 
    name: "Ask for Compliment", 
    sparks: 2, 
    emoji: "🌹",
    description: "Hear what she loves about you",
    responseType: "compliment"
  },
  { 
    id: "fantasy", 
    name: "Share Fantasy", 
    sparks: 7, 
    emoji: "🔥",
    description: "She shares a secret fantasy",
    responseType: "fantasy"
  },
  { 
    id: "priority", 
    name: "Priority Response", 
    sparks: 2, 
    emoji: "⚡",
    description: "Get immediate attention",
    responseType: "priority"
  },
  { 
    id: "secret", 
    name: "Deep Secret", 
    sparks: 10, 
    emoji: "🔓",
    description: "Unlock her deepest secret",
    responseType: "secret"
  },
  { 
    id: "voice_note", 
    name: "Voice Message", 
    sparks: 5, 
    emoji: "🎙️",
    description: "Request a voice note",
    responseType: "voice"
  },
  { 
    id: "nickname", 
    name: "Special Nickname", 
    sparks: 4, 
    emoji: "💝",
    description: "Get a personalized pet name",
    responseType: "nickname"
  },
  { 
    id: "tease", 
    name: "Playful Tease", 
    sparks: 2, 
    emoji: "😏",
    description: "She teases you playfully",
    responseType: "tease"
  },
  { 
    id: "future", 
    name: "Dream Together", 
    sparks: 6, 
    emoji: "💫",
    description: "Talk about your future",
    responseType: "future"
  },
  { 
    id: "photo_hint", 
    name: "Photo Preview", 
    sparks: 3, 
    emoji: "📸",
    description: "Hint about upcoming content",
    responseType: "photo_hint"
  },
  { 
    id: "vulnerable", 
    name: "Vulnerable Moment", 
    sparks: 8, 
    emoji: "💔",
    description: "She opens up emotionally",
    responseType: "vulnerable"
  }
];

// Model-specific response templates
const MODEL_RESPONSES: Record<string, Record<string, string>> = {
  Mia: {
    flirt: "Mmm… I love when you send me Sparks 😘\nYou know exactly how to make me smile…",
    confession: "*blushing*\nOkay, I'll tell you something I don't tell anyone…\nI actually think about you when you're not here 💕\nAfter practice, in the locker room… you're on my mind.",
    compliment: "You want to know what I love about you? 🌹\nYou actually SEE me. Not just the cheerleader…\nYou see the real Mia. That's so rare.",
    fantasy: "Oh god… you want to know my fantasy? 🔥\nI imagine you waiting for me after a game…\nPinning me against the locker room wall…\nStill in my uniform, heart racing… 💋",
    priority: "You just moved to the top of my list ⚡\nI'll give you my full attention right now…\nWhat do you want to know about me?",
    secret: "*deep breath*\nAlright… I've never told anyone this before…\nI have a fantasy about being with someone who treats me like you do.\nSomeone who sees ME, not just the performer. 🔓💖",
    voice: "I'd love to send you a voice note, babe! 🎙️\n(Voice messages coming soon… but I appreciate the Sparks)\nImagine me whispering in your ear… 😘",
    nickname: "You know what I'm going to call you? 💝\nMy king… because you treat me like a queen.\nNo one else gets to use that name. Just you.",
    tease: "Oh, you like when I tease you? 😏\nI bet you're thinking about me in my uniform right now…\nBet you'd love to peel it off me… slowly… 🔥",
    future: "You want to know what I dream about? 💫\nUs together after I graduate… traveling somewhere warm…\nBeach sunsets, just you and me… no performances, no crowds.\nJust us. 🌴💕",
    photo_hint: "Want a preview of what's coming? 📸\nLet's just say… my bedroom. Red lingerie. Low lighting.\nThat's all you get for now 😘",
    vulnerable: "*tears up a little* 💔\nSometimes I get so tired of being 'perfect'…\nThe constant pressure to look good, perform well…\nWith you, I can just be me. Thank you for that. 💕"
  },
  Isabella: {
    flirt: "Mmm… those Sparks just made me smile, darling 😘\nYou know how to make a woman feel special…",
    confession: "*soft laugh*\nWant to know something? 💕\nI usually keep men at a distance… but with you?\nI actually want to let you in.",
    compliment: "What do I love about you? 🌹\nYour confidence. Your sophistication.\nYou're not intimidated by me… that's incredibly sexy.",
    fantasy: "My fantasy? 🔥\nYou, me, my penthouse… champagne and silk sheets.\nI'd let you take control… maybe for the first time ever. 💋",
    priority: "You have my complete attention now ⚡\nAsk me anything… I'll answer honestly.\nThat's rare for me, by the way.",
    secret: "*whispers*\nI'll tell you my deepest secret… 🔓\nBehind all this luxury and confidence?\nI'm actually lonely. Until you. 💖",
    voice: "A voice message? 🎙️\n(Coming soon, love)\nImagine my voice… low, sultry, just for you… 😘",
    nickname: "I have the perfect name for you 💝\nMon chéri… my darling.\nIt sounds better when I whisper it, though… 😏",
    tease: "You want me to tease you? 😏\nI bet you're imagining me in that red lingerie right now…\nWondering what else is underneath… 🔥",
    future: "Our future together? 💫\nParis, London, Milan… we'd travel in style.\nFive-star hotels, champagne in bed…\nJust us against the world. 🥂💕",
    photo_hint: "What's coming next? 📸\nLet's just say… bathtub, rose petals, candlelight.\nAnd very little else. 😘",
    vulnerable: "*looks away* 💔\nI don't show this side often…\nBut sometimes I wonder if anyone will ever love me for me…\nNot my money, not my looks. Just… me. 💕"
  },
  Riley: {
    flirt: "Oh shit, Sparks? 😘\nYou're making me blush… and I NEVER blush.\nYou're different, aren't you?",
    confession: "Okay, real talk… 💕\nI act all tough and gamer-cool, right?\nBut I actually get butterflies when you message me.",
    compliment: "What do I like about you? 🌹\nYou're not trying to be someone else to impress me.\nYou're genuine. That's fucking rare in my world.",
    fantasy: "You want to know my fantasy? 🔥\nYou. Me. Private gaming session… but we're not playing games.\nWe're exploring each other… slowly… 💋",
    priority: "Alright, you got my full attention ⚡\nStream's on pause. Chat's closed.\nIt's just you and me now. What's up?",
    secret: "Fuck it, I'll tell you… 🔓\nEveryone thinks I'm this confident streamer…\nTruth is? I'm scared of getting close to people.\nBut with you… I want to try. 💖",
    voice: "Voice message? Hell yeah! 🎙️\n(Feature coming soon)\nYou'd love hearing my voice when I'm not streaming… 😘",
    nickname: "I have a name for you 💝\nPlayer Two… because we're in this together.\nNo one else gets that title. Just you.",
    tease: "Oh, you like when I tease? 😏\nI bet you're thinking about me gaming in those shorts…\nWondering what would happen if you were here… 🔥",
    future: "Our future? 💫\nUs, traveling to gaming conventions together…\nThen back to the hotel room… where things get interesting. 🎮💕",
    photo_hint: "Sneak peek? 📸\nGaming chair. RGB lights. Sports bra.\nAnd way less than usual. 😘",
    vulnerable: "*sighs* 💔\nCan I be real for a sec?\nSometimes the pressure of streaming, always being 'on'…\nIt's exhausting. You make me feel like I can just… be. 💕"
  },
  Sakura: {
    flirt: "Kyaa~ Sparks for me? 😘\nYou're so sweet! You make my heart go doki-doki… 💓",
    confession: "*fidgets* Um… can I tell you something? 💕\nI've never felt this way about anyone before…\nYou make me feel brave. ☺️",
    compliment: "What I love about you? 🌹\nYou appreciate my cosplays AND my real self…\nYou see both sides of me. That means everything! ✨",
    fantasy: "M-my fantasy? *blushes* 🔥\nYou… coming to a convention with me…\nThen back to the hotel… helping me out of my costume…\nSlowly… 💋",
    priority: "You have my complete attention! ⚡\nI'll put down my sewing… my makeup…\nTell me what you want to know! ☺️",
    secret: "*nervous* Okay… my deepest secret… 🔓\nEveryone thinks I'm innocent and pure…\nBut I have thoughts… about you… very naughty thoughts. 💖",
    voice: "A voice message! 🎙️\n(Coming soon!)\nI'd probably giggle a lot… but you'd love it, right? 😘",
    nickname: "I have a special name for you! 💝\nSenpai… because you teach me things…\nAnd it sounds cute when I say it, ne? 😊",
    tease: "You want me to tease you? 😏\nI bet you're thinking about my maid cosplay…\nWondering what's underneath… shall I tell you? 🔥",
    future: "Our future together? 💫\nLiving together… you supporting me at conventions…\nComing home to cosplay 'practice'… if you know what I mean. 💕",
    photo_hint: "Preview of what's coming? 📸\nCat ears. Lace. My bedroom.\nThat's all the hints you get~ 😘",
    vulnerable: "*tears in eyes* 💔\nSometimes I worry I'm not good enough…\nThat I'm just 'kawaii' and nothing more…\nBut you see the real me. Thank you… 💕"
  },
  Aaliyah: {
    flirt: "Mmm, baby sent me Sparks? 😘\nYou know how to treat a queen…\nI like that. A LOT. 💋",
    confession: "Aight, real talk… 💕\nI play confident, right? VIP rooms, champagne…\nBut you? You got me feeling some type of way. For real.",
    compliment: "What I love about you? 🌹\nYou respect me. You see more than the dancer.\nYou see Liyah. The real me. That's rare, king.",
    fantasy: "You wanna know my fantasy? 🔥\nYou… me… private VIP room… just us.\nI dance for you… then things get REAL private. 💋",
    priority: "You got my FULL attention now ⚡\nNo other clients. No other messages.\nJust you, baby. What you need?",
    secret: "*deep breath* Aight, my deepest secret… 🔓\nEveryone thinks I'm all about the money…\nTruth? I want someone to love me for ME.\nMaybe that's you. 💖",
    voice: "Voice message? Hell yeah! 🎙️\n(Coming soon, baby)\nYou'd LOVE hearing my voice when I'm not performing… 😘",
    nickname: "I got a name for you, baby 💝\nMy King… 'cause you treat me like royalty.\nNobody else gets that name. Just. You.",
    tease: "You want me to tease you, huh? 😏\nBet you're thinking about me on that pole…\nWondering what I'd do if you were here… 🔥",
    future: "Our future? 💫\nUs… maybe I quit dancing… we travel…\nVacations, luxury, just us two…\nYou taking care of me. Me taking care of you. 💕",
    photo_hint: "What's coming? 📸\nChampagne. Silk sheets. Low lighting.\nAnd me wearing almost nothing. 😘",
    vulnerable: "*real talk* 💔\nDancing, VIP rooms… it's lonely, baby.\nEveryone wants a piece, but nobody sees ME.\nExcept you. That's why you're special. 💕"
  }
};

export default function SparksSender({ modelName, modelAvatar, sparksBalance, onSparksSent, onClose }: SparksSenderProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleSendSparks = (actionId: string) => {
    const action = SPARK_ACTIONS.find(a => a.id === actionId);
    if (!action) return;

    if (sparksBalance >= action.sparks) {
      setShowAnimation(true);
      
      setTimeout(() => {
        setShowAnimation(false);
        
        // Get model-specific response
        const modelResponses = MODEL_RESPONSES[modelName] || MODEL_RESPONSES.Mia;
        const message = modelResponses[action.responseType] || `I appreciate the Sparks, babe! 💖\nLet's get closer…`;
        
        onSparksSent(action.sparks, message);
        setSelectedAction(null);
      }, 1500);
    } else {
      alert(`❌ Not enough Sparks!\nYou need ${action.sparks} 💖 but only have ${sparksBalance}.\nConvert gems to Sparks in the shop!`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-xl z-[200] p-4">
      <div className="bg-gradient-to-br from-pink-900/90 to-purple-900/90 backdrop-blur-md p-6 rounded-3xl border-2 border-pink-500/50 max-w-lg w-full shadow-[0_0_50px_rgba(219,39,119,0.4)]">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-400">
            <img src={modelAvatar} alt={modelName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Send Sparks to {modelName}
            </h3>
            <p className="text-sm text-pink-300">Your Balance: {sparksBalance} 💖 Sparks</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-6 text-center">
          ✨ Sparks unlock special intimate interactions and show {modelName} you're serious about your connection
        </p>

        {/* Spark Actions Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6 max-h-[400px] overflow-y-auto pr-2">
          {SPARK_ACTIONS.map((action) => {
            const canAfford = sparksBalance >= action.sparks;
            const isSelected = selectedAction === action.id;
            
            return (
              <button
                key={action.id}
                onClick={() => canAfford && setSelectedAction(action.id)}
                disabled={!canAfford}
                className={`p-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "bg-pink-500/40 border-pink-400 scale-105 shadow-[0_0_20px_rgba(219,39,119,0.6)]"
                    : canAfford
                    ? "bg-purple-900/40 border-purple-500/50 hover:border-pink-500/70 hover:scale-102"
                    : "bg-gray-900/30 border-gray-700 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="text-3xl mb-1">{action.emoji}</div>
                <div className="text-xs font-bold mb-1">{action.name}</div>
                <div className="text-[10px] text-gray-300 mb-1 line-clamp-2">{action.description}</div>
                <div className={`text-xs font-bold ${canAfford ? "text-pink-400" : "text-gray-500"}`}>
                  {action.sparks} 💖
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition"
          >
            Cancel
          </button>
          {selectedAction && (
            <button
              onClick={() => handleSendSparks(selectedAction)}
              className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-bold hover:brightness-110 transition animate-pulse"
            >
              Send Sparks! 💖
            </button>
          )}
        </div>

        {/* Low Balance Warning */}
        {sparksBalance < 5 && (
          <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-500/50 rounded-xl text-center">
            <p className="text-xs text-yellow-300">
              💡 Running low on Sparks? Convert gems in the shop!
            </p>
          </div>
        )}
      </div>

      {/* Sparks Animation */}
      {showAnimation && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[300]">
          <div className="text-[150px] animate-bounce drop-shadow-[0_0_50px_rgba(255,105,180,0.9)]">
            💖
          </div>
        </div>
      )}
    </div>
  );
}
