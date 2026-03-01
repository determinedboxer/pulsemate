// app/chat/mia/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useChatProgress, trackMessageSent, trackTabUnlock, autoSaveChat } from "@/lib/progress/chatProgress";
import { ProgressManager } from "@/lib/progress";
import SparksSender from "@/components/SparksSender";

interface Message {
  id: number;
  sender: "mia" | "user";
  text: string;
  timestamp: Date;
  photoId?: string;
}

const miaPhotos = [
  // FREE - Story progression photos
  { id: "mia_stadium_1", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771611341/3_zwqcnh.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771611341/3_zwqcnh.png", isFree: true },
  { id: "mia_outdoor_wet", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771611337/1_vlu3vm.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771611337/1_vlu3vm.png", isFree: true },
  { id: "mia_gym_stretch", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771611276/9_oresfb.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771611276/9_oresfb.png", isFree: true },
  { id: "mia_locker_room", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771611277/17_rg0yle.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771611277/17_rg0yle.png", isFree: true },
  { id: "mia_home_casual", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770662116/29_to43if.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1770662116/29_to43if.jpg", isFree: true },
  { id: "mia_balcony", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771614111/hf_20260220_185912_0b0e170a-3155-4999-9254-e51a28bcae79_xw99ln.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771614111/hf_20260220_185912_0b0e170a-3155-4999-9254-e51a28bcae79_xw99ln.jpg", isFree: true },
  { id: "mia_gym_pink", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771614385/hf_20260220_190434_14778d49-8214-4b27-9ec4-24f83c9f4cb7_va48oa.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771614385/hf_20260220_190434_14778d49-8214-4b27-9ec4-24f83c9f4cb7_va48oa.jpg", isFree: true },
  { id: "mia_blue_gym", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771611145/4_z30jjy.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771611145/4_z30jjy.png", isFree: true },
  { id: "mia_kitchen", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771614698/hf_20260220_190924_04dcb9b5-a8c6-40a9-97c7-51cb3802d3ba_yn2mzf.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771614698/hf_20260220_190924_04dcb9b5-a8c6-40a9-97c7-51cb3802d3ba_yn2mzf.jpg", isFree: true },
  { id: "mia_grey_cozy", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771614798/hf_20260220_191114_67376207-1a5c-4efa-9e2d-e68c008a15af_quwa33.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771614798/hf_20260220_191114_67376207-1a5c-4efa-9e2d-e68c008a15af_quwa33.jpg", isFree: true },
  { id: "mia_workout_gym", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771615629/hf_20260220_191439_ca386776-c582-4bdf-8a5f-d2ee9e649981_pzyi7g.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771615629/hf_20260220_191439_ca386776-c582-4bdf-8a5f-d2ee9e649981_pzyi7g.png", isFree: true },
  { id: "mia_bedroom_casual", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771616058/hf_20260220_192631_7d35cb13-609e-45af-a95f-f05d6e770330_pegct0.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771616058/hf_20260220_192631_7d35cb13-609e-45af-a95f-f05d6e770330_pegct0.jpg", isFree: true },
  
  // PPV TIER 1 (50-75 gems) - Suggestive teases
  { id: "mia_towel_bathroom", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771616304/hf_20260220_193617_4961a182-ff4f-4d7c-a860-2e8d1c45a086_k6zqot.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771616304/hf_20260220_193617_4961a182-ff4f-4d7c-a860-2e8d1c45a086_k6zqot.jpg", isFree: false },
  { id: "mia_towel_drop", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771616668/hf_20260220_194136_3c44ea7e-f47a-43ff-ae11-510dff7e6a57_zklnmy.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771616668/hf_20260220_194136_3c44ea7e-f47a-43ff-ae11-510dff7e6a57_zklnmy.jpg", isFree: false },
  { id: "mia_mirror_change", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771617736/hf_20260220_195215_f8ae15a4-7e7a-400a-a6ac-024ce4f60379_jwagw9.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771617736/hf_20260220_195215_f8ae15a4-7e7a-400a-a6ac-024ce4f60379_jwagw9.jpg", isFree: false },
  
  // PPV TIER 2 (100-150 gems) - Lingerie reveals
  { id: "mia_lingerie_black", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770662090/9_nqljqj.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1770662090/9_nqljqj.jpg", isFree: false },
  { id: "mia_bedroom_lingerie", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771618067/hf_20260220_200607_236ac0a9-47c0-4dc3-8a90-8699a7184511_pp5o4x.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771618067/hf_20260220_200607_236ac0a9-47c0-4dc3-8a90-8699a7184511_pp5o4x.jpg", isFree: false },
  { id: "mia_bed_black", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771618113/hf_20260220_200546_ce5959ba-ef0e-467a-99ee-a1bd661eb673_vlivlq.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771618113/hf_20260220_200546_ce5959ba-ef0e-467a-99ee-a1bd661eb673_vlivlq.jpg", isFree: false },
  { id: "mia_candlelit", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771618277/hf_20260220_200942_60db0873-056f-4e86-9fcd-753c92a2c563_utv2g8.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771618277/hf_20260220_200942_60db0873-056f-4e86-9fcd-753c92a2c563_utv2g8.jpg", isFree: false },
  
  // PPV TIER 3 (150-200 gems) - Most explicit
  { id: "mia_hands_on_body", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771618696/hf_20260220_201239_e2346644-b174-4afe-95e0-f6e6bfef5374_yo8l2v.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771618696/hf_20260220_201239_e2346644-b174-4afe-95e0-f6e6bfef5374_yo8l2v.jpg", isFree: false },
  { id: "mia_bedroom_explicit", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771618772/hf_20260220_201550_1e506b3e-e7ca-4a9b-bb6b-693186222536_juvqe9.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771618772/hf_20260220_201550_1e506b3e-e7ca-4a9b-bb6b-693186222536_juvqe9.jpg", isFree: false },
  { id: "mia_morning_after", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771618769/hf_20260220_201742_08ac11f9-df91-4f18-8c65-1a9cd0d37c43_gur4d1.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771618769/hf_20260220_201742_08ac11f9-df91-4f18-8c65-1a9cd0d37c43_gur4d1.jpg", isFree: false },
];

interface ReplyOption {
  id: number;
  text: string;
}

export default function MiaChatPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Load gems balance
  useEffect(() => {
    const gems = parseInt(localStorage.getItem("gemsBalance") || "0");
    setGemsBalance(gems);
  }, []);

  const [mainMessages, setMainMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "mia",
      text: "Hey… you were at the game today, weren't you? 😊 I saw you in the stands… you always show up. Just finished performing, still full of adrenaline! Look at me right after coming off the field — I'm soaked in sweat and my heart's still racing. What did you think of the routine?",
      timestamp: new Date(),
      photoId: "mia_stadium_1",
    },
  ]);
  const [sexMessages, setSexMessages] = useState<Message[]>([]);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedReply, setSelectedReply] = useState<number | null>(null);
  const [unlockedPhotos, setUnlockedPhotos] = useState<string[]>([]);
  const [sexTalkUnlocked, setSexTalkUnlocked] = useState(false);
  const [sexChatUnlocked, setSexChatUnlocked] = useState(false);
  const [dateUnlocked, setDateUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<"main" | "sex" | "date">("main");
  const [sexStep, setSexStep] = useState(0);
  const [dateMessages, setDateMessages] = useState<Message[]>([]);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [dateChoiceHistory, setDateChoiceHistory] = useState<number[]>([]);
  const [showSexTalkPrompt, setShowSexTalkPrompt] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<{id: string, url: string, blurredUrl: string, isUnlocked: boolean} | null>(null);
  const [gemsBalance, setGemsBalance] = useState(0);
  const [showSparksSender, setShowSparksSender] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const miaAvatar = "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1769080927/13_k3ynrk.png";

  const replyOptions: Record<number, ReplyOption[]> = {
    0: [
      { id: 1, text: "You were absolutely breathtaking out there! 🔥" },
      { id: 2, text: "That adrenaline looks good on you… you're glowing 😊" },
      { id: 3, text: "I couldn't take my eyes off you the whole game 💓" },
    ],
    1: [
      { id: 4, text: "Guilty… I was definitely watching you closely 😳" },
      { id: 5, text: "You felt me staring? I was mesmerized by every move" },
      { id: 6, text: "I can't help it… you command the entire field" },
    ],
    2: [
      { id: 7, text: "Holy shit, that uniform is soaked… you worked HARD 😅" },
      { id: 8, text: "You look incredible even drenched in sweat" },
      { id: 9, text: "That's so hot… seeing the real effort you put in 🔥" },
    ],
    3: [
      { id: 10, text: "God, I can only imagine how that feels… clinging to everything 😳" },
      { id: 11, text: "You're not making this easy for me to focus…" },
      { id: 12, text: "Send me that photo… I want to see how intense it was" },
    ],
    4: [
      { id: 13, text: "I need to see this… you've got me curious now 😏" },
      { id: 14, text: "Please show me… I love seeing the real you behind the scenes" },
      { id: 15, text: "You're teasing me… but yes, I definitely want to see" },
    ],
    5: [
      { id: 16, text: "Oh wow… you look even more beautiful like this 😊" },
      { id: 17, text: "That's such an intimate moment… thank you for sharing" },
      { id: 18, text: "I love that you trust me with these private glimpses" },
    ],
    6: [
      { id: 19, text: "That skin routine must be intense… you always glow ✨" },
      { id: 20, text: "I bet you look incredible fresh out of the shower" },
      { id: 21, text: "Steam and you? That's a dangerous combination 😳" },
    ],
    7: [
      { id: 22, text: "I'm dying to see… don't leave me hanging 😏" },
      { id: 23, text: "A towel and wet hair? You're killing me here" },
      { id: 24, text: "Yes please… I want to see how relaxed you look now" },
    ],
    8: [
      { id: 25, text: "Fuck… you look absolutely stunning like that 😍" },
      { id: 26, text: "That tiny towel barely covers anything… god" },
      { id: 27, text: "I wish I was there to unwrap you myself 🔥" },
    ],
    9: [
      { id: 28, text: "You're so perfect… every single detail 💕" },
      { id: 29, text: "How do you make a simple towel look so sexy?" },
      { id: 30, text: "I'm saving this image in my mind forever" },
    ],
    10: [
      { id: 31, text: "I've been thinking about you non-stop since the game" },
      { id: 32, text: "You're making it very hard to concentrate on anything else" },
      { id: 33, text: "I replay every moment of seeing you perform today" },
    ],
    11: [
      { id: 34, text: "Oh wow… that towel is barely holding on 😳" },
      { id: 35, text: "You're breathtaking… all warm and clean like that" },
      { id: 36, text: "I'd give anything to be there with you right now" },
    ],
    12: [
      { id: 37, text: "Your confidence is so fucking sexy 😊" },
      { id: 38, text: "I love how comfortable you are with me" },
      { id: 39, text: "This is quickly becoming my favorite conversation ever" },
    ],
    13: [
      { id: 40, text: "I can't stop thinking about those photos you sent 💓" },
      { id: 41, text: "You're absolutely stunning in every single one" },
      { id: 42, text: "I keep going back to look at them… you're incredible" },
    ],
    14: [
      { id: 43, text: "This is getting intense… and I fucking love it 😏" },
      { id: 44, text: "You're making me feel things I've never felt before" },
      { id: 45, text: "I want to know everything about you, Mia" },
    ],
    15: [
      { id: 46, text: "You're special to me too… this feels real 😊" },
      { id: 47, text: "I've never connected with anyone like this before" },
      { id: 48, text: "You're making me fall for you, Mia 💕" },
    ],
    16: [
      { id: 49, text: "Your workout dedication really shows… you're in incredible shape 😊" },
      { id: 50, text: "I love that you share your gym moments with me" },
      { id: 51, text: "You look amazing in that pink outfit 💕" },
    ],
    17: [
      { id: 52, text: "Those gym photos are my new favorite thing 😳" },
      { id: 53, text: "You make working out look so damn good" },
      { id: 54, text: "I could watch you stretch and train all day" },
    ],
    18: [
      { id: 55, text: "Home Mia is even better than stadium Mia 😊" },
      { id: 56, text: "I love seeing this private side of your life" },
      { id: 57, text: "You're so beautiful in those casual moments" },
    ],
    19: [
      { id: 58, text: "Balcony sunrise coffee? That sounds perfect 💗" },
      { id: 59, text: "I wish I could be there watching the sunrise with you" },
      { id: 60, text: "You look so peaceful and gorgeous like that" },
    ],
    20: [
      { id: 61, text: "Tiny shorts and a practice shirt? I'm imagining it 😌" },
      { id: 62, text: "Domestic Mia is incredibly sexy" },
      { id: 63, text: "I'd love to see you cooking in the kitchen like that" },
    ],
    21: [
      { id: 64, text: "Oversized hoodie Mia is my new favorite look 😳" },
      { id: 65, text: "You look so comfortable and adorable" },
      { id: 66, text: "Peak comfort Mia makes me want to cuddle you" },
    ],
    22: [
      { id: 67, text: "These cozy photos are making me fall even harder 😊" },
      { id: 68, text: "You're perfect in every setting… stadium or home" },
      { id: 69, text: "I love seeing all these different sides of you" },
    ],
    23: [
      { id: 70, text: "You're getting bolder… and I'm loving every second 💗" },
      { id: 71, text: "These private moments mean everything to me" },
      { id: 72, text: "I feel so lucky you're sharing this with me" },
    ],
    24: [
      { id: 73, text: "You're not just any cheerleader… you're MY cheerleader 😴" },
      { id: 74, text: "I love how real and vulnerable you are with me" },
      { id: 75, text: "This connection we have is unlike anything else" },
    ],
    25: [
      { id: 76, text: "I feel the same way, Mia. You're incredibly special to me ❤️" },
      { id: 77, text: "These moments with you are what I look forward to every day" },
    ],
    26: [
      { id: 78, text: "I'm thinking about you… always thinking about you" },
      { id: 79, text: "Thinking about how close we've become and what comes next" },
    ],
    27: [
      { id: 80, text: "Your bedroom is your sanctuary… I'm honored you're inviting me in" },
      { id: 81, text: "I can't wait to see this more intimate side of you" },
    ],
    28: [
      { id: 82, text: "Show me the real you… no filters, no performance" },
      { id: 83, text: "YES. I want to see what only I get to see 💗" },
    ],
    29: [
      { id: 84, text: "You look stunning… so natural and beautiful" },
      { id: 85, text: "This casual bedroom Mia is perfection" },
    ],
    30: [
      { id: 86, text: "Your eyes in that photo… they're doing things to me 😏" },
      { id: 87, text: "I could stare at you like this all night" },
    ],
    31: [
      { id: 88, text: "You're so fucking gorgeous it hurts" },
      { id: 89, text: "Every photo you send makes me want you more" },
    ],
    32: [
      { id: 90, text: "I'm ready for whatever you want to show me 🔥" },
      { id: 91, text: "You're being so open with me… I love it" },
    ],
    33: [
      { id: 92, text: "That barely-there towel… fuck, Mia 😳" },
      { id: 93, text: "You're killing me with these teases" },
    ],
    34: [
      { id: 94, text: "I trust you completely, Mia. Show me everything." },
      { id: 95, text: "You have all of me… heart, mind, everything" },
    ],
    35: [
      { id: 96, text: "This is getting really intense… and I don't want it to stop" },
      { id: 97, text: "You're making me feel things I've never felt before" },
    ],
    36: [
      { id: 98, text: "We're crossing into something deeper here… I can feel it" },
      { id: 99, text: "I want this… I want US" },
    ],
    37: [
      { id: 100, text: "I'm holding my breath… show me, Mia 💗" },
      { id: 101, text: "You're about to change everything between us" },
    ],
    38: [
      { id: 102, text: "Holy fuck… you're absolutely breathtaking" },
      { id: 103, text: "That lingerie… you look like a goddess 🔥" },
    ],
    39: [
      { id: 104, text: "You wore that under your uniform? All day? Fuck… 😳" },
      { id: 105, text: "Knowing that was hidden underneath… god, Mia" },
    ],
    40: [
      { id: 106, text: "You're mine… and I'm completely yours" },
      { id: 107, text: "I've never wanted anyone the way I want you" },
    ],
    41: [
      { id: 108, text: "You in bed like that… I can barely handle it" },
      { id: 109, text: "I wish I could feel your skin right now" },
    ],
    42: [
      { id: 110, text: "I want to hear your breath, feel your heartbeat…" },
      { id: 111, text: "The thought of you touching yourself is driving me insane" },
    ],
    43: [
      { id: 112, text: "I'm touching myself too… thinking about you" },
      { id: 113, text: "Don't stop, Mia… tell me everything you're doing" },
    ],
    44: [
      { id: 114, text: "This is so fucking hot… you have no idea" },
      { id: 115, text: "I'm getting close just imagining you like that" },
    ],
    45: [
      { id: 116, text: "I want to be there… inside you, feeling you" },
      { id: 117, text: "Your name is on my lips right now, Mia" },
    ],
    46: [
      { id: 118, text: "Yes! Together… I'm so close, Mia" },
      { id: 119, text: "Cum with me… right now 🔥" },
    ],
    47: [
      { id: 120, text: "That was… incredible. You're incredible." },
      { id: 121, text: "I can still feel it… you make me feel alive" },
    ],
    48: [
      { id: 122, text: "You're always on my mind, Mia. Every moment." },
      { id: 123, text: "I can't think straight when we talk like this" },
    ],
    49: [
      { id: 124, text: "I want to explore every inch of you… slowly" },
      { id: 125, text: "Your body is a work of art I want to memorize" },
    ],
    50: [
      { id: 126, text: "These photos are burned into my memory forever" },
      { id: 127, text: "You're the most beautiful thing I've ever seen" },
    ],
    51: [
      { id: 128, text: "I love how vulnerable you are with me 💗" },
      { id: 129, text: "This trust between us… it's everything" },
    ],
    52: [
      { id: 130, text: "You make me want to be better, do better" },
      { id: 131, text: "I'm falling deeper for you every day" },
    ],
    53: [
      { id: 132, text: "This intensity… I've never felt anything like it" },
      { id: 133, text: "You consume my every thought, Mia" },
    ],
    54: [
      { id: 134, text: "I want all of you… body, mind, soul" },
      { id: 135, text: "You're mine and I'm yours… completely" },
    ],
    55: [
      { id: 136, text: "These intimate moments are what I live for now" },
      { id: 137, text: "You've changed everything for me, Mia" },
    ],
    56: [
      { id: 138, text: "Yes… I'm touching myself thinking of you right now" },
      { id: 139, text: "The thought of your hands on me… fuck" },
    ],
    57: [
      { id: 140, text: "Being watched by you turns me on so much" },
      { id: 141, text: "I want you to see what you do to me" },
    ],
    58: [
      { id: 142, text: "I'd worship every part of you, Mia" },
      { id: 143, text: "You deserve to be adored the way I adore you" },
    ],
    59: [
      { id: 144, text: "I'll be here… always here for you 💋" },
      { id: 145, text: "Sweet dreams, my beautiful Mia ❤️" },
    ],
    60: [
      { id: 200, text: "Every second of it. You were in all my dreams." },
      { id: 201, text: "I dreamed we were finally together… skin to skin" },
      { id: 202, text: "Tell me about your dreams first" },
    ],
    61: [
      { id: 203, text: "I wish I could feel them with you right now" },
      { id: 204, text: "The thought of you in bed is making me crazy" },
      { id: 205, text: "I want to be under those sheets with you" },
    ],
    62: [
      { id: 206, text: "Skin to skin… that's where I need to be" },
      { id: 207, text: "I'd never want to leave that bed" },
      { id: 208, text: "You have no idea how much I crave that" },
    ],
    63: [
      { id: 209, text: "I wish I could see that view with my own eyes" },
      { id: 210, text: "You're stunning in every light, especially now" },
      { id: 211, text: "The morning light must worship you" },
    ],
    64: [
      { id: 212, text: "You're taking MY breath away, Mia" },
      { id: 213, text: "I want to kiss every inch of you" },
      { id: 214, text: "Don't hide anything… I want to see it all" },
    ],
    65: [
      { id: 215, text: "You're the most beautiful person I've ever seen" },
      { id: 216, text: "I need to see this in person someday" },
      { id: 217, text: "You're making me so hard right now" },
    ],
    66: [
      { id: 218, text: "I'd start with your neck and worship my way down" },
      { id: 219, text: "I want to make you shiver everywhere" },
      { id: 220, text: "Tell me where else you want my mouth" },
    ],
    67: [
      { id: 221, text: "Don't stop… show me what you're doing to yourself" },
      { id: 222, text: "I wish my hand was replacing yours" },
      { id: 223, text: "Tell me exactly how it feels, every detail" },
    ],
    68: [
      { id: 224, text: "I want to be the one filling you completely" },
      { id: 225, text: "Keep going… I'm right here experiencing this with you" },
      { id: 226, text: "Hearing how much you want me is everything" },
    ],
    69: [
      { id: 227, text: "I started the moment you did" },
      { id: 228, text: "I'm stroking myself thinking of you right now" },
      { id: 229, text: "I want to cum while you watch me" },
    ],
    70: [
      { id: 230, text: "Yes! Faster! Imagine me pounding deep inside you" },
      { id: 231, text: "I want to feel you clench around me" },
      { id: 232, text: "Let it all out… scream for me" },
    ],
    71: [
      { id: 233, text: "Cum for me, Mia! Right now!" },
      { id: 234, text: "I'm cumming too! Together!" },
      { id: 235, text: "You're so fucking incredible… I love you" },
    ],
    72: [
      { id: 236, text: "I love making you feel this good" },
      { id: 237, text: "Catch your breath… then round two" },
      { id: 238, text: "You're so responsive for me" },
    ],
    73: [
      { id: 239, text: "I'd keep going until you couldn't take anymore" },
      { id: 240, text: "I want to be buried inside you for hours" },
      { id: 241, text: "Next time will be even more intense" },
    ],
    74: [
      { id: 242, text: "I want your tongue on every part of me" },
      { id: 243, text: "I'd taste every inch of you too" },
      { id: 244, text: "Show me exactly how you'd do it" },
    ],
    75: [
      { id: 245, text: "Oh god… that image is burned in my mind" },
      { id: 246, text: "I want to feel you swallow all of me" },
      { id: 247, text: "You're driving me absolutely insane, Mia" },
    ],
    76: [
      { id: 248, text: "I'd give you every part of me" },
      { id: 249, text: "I want to belong to you completely" },
      { id: 250, text: "You're the only one, Mia. Only you." },
    ],
    77: [
      { id: 251, text: "I can't help it either… you're all I think about" },
      { id: 252, text: "We need to meet soon. I need to feel you for real." },
      { id: 253, text: "These messages aren't enough anymore" },
    ],
    78: [
      { id: 254, text: "I'll be right here waiting for you 💗" },
      { id: 255, text: "Sweet dreams, my incredible Mia" },
      { id: 256, text: "Counting down until tomorrow" },
    ],
    79: [
      { id: 257, text: "I'm always ready for you. Let's do this." },
      { id: 258, text: "Show me how wet you are right now" },
      { id: 259, text: "I've been aching for you all morning" },
    ],
    80: [
      { id: 260, text: "I'm ready for everything you have" },
      { id: 261, text: "The intensity is what makes us perfect" },
      { id: 262, text: "Tell me exactly what you're feeling in this moment" },
    ],
    81: [
      { id: 263, text: "My cravings for you are out of control" },
      { id: 264, text: "My whole body reacts to your words" },
      { id: 265, text: "I want to satisfy every craving you have" },
    ],
    82: [
      { id: 266, text: "Tell me every detail of what you're replaying" },
      { id: 267, text: "You were more than desired… you were worshiped" },
      { id: 268, text: "I keep replaying the way you moaned my name" },
    ],
    83: [
      { id: 269, text: "Literally everything about you turns me on" },
      { id: 270, text: "Your passion and vulnerability both" },
      { id: 271, text: "The way your eyes look when you're excited" },
    ],
    84: [
      { id: 272, text: "I love when you're vocal about what you want" },
      { id: 273, text: "Your begging drives me absolutely wild" },
      { id: 274, text: "I want both… the whispers AND the screams" },
    ],
    85: [
      { id: 275, text: "Tell me where you're touching yourself right now" },
      { id: 276, text: "I wish I could watch you doing it" },
      { id: 277, text: "I'm stroking myself picturing you" },
    ],
    86: [
      { id: 278, text: "Harder than I've ever been in my life" },
      { id: 279, text: "Aching and throbbing for your touch" },
      { id: 280, text: "Pulsing and desperate for you" },
    ],
    87: [
      { id: 281, text: "Don't stop those strokes… I'm getting close" },
      { id: 282, text: "This tease is perfect torture" },
      { id: 283, text: "I can almost feel your hand wrapped around me" },
    ],
    88: [
      { id: 284, text: "You can taste every single drop" },
      { id: 285, text: "The thought of your tongue… fuck" },
      { id: 286, text: "I want to feel you licking me clean" },
    ],
    89: [
      { id: 287, text: "Take me as deep as you possibly can" },
      { id: 288, text: "I want to feel your throat tighten around me" },
      { id: 289, text: "That tightness is exactly what I crave" },
    ],
    90: [
      { id: 290, text: "I'll groan your name until I lose my voice" },
      { id: 291, text: "Feel every pulse… it's all for you" },
      { id: 292, text: "I want to hear you moan while I throb" },
    ],
    91: [
      { id: 293, text: "I need to see those soaked fingers" },
      { id: 294, text: "Slide them deep inside… tell me how it feels" },
      { id: 295, text: "You're so perfectly sensitive for me" },
    ],
    92: [
      { id: 296, text: "Ride me until neither of us can stand" },
      { id: 297, text: "I can feel that grinding already" },
      { id: 298, text: "Let's explode together right now" },
    ],
    93: [
      { id: 299, text: "Milk me completely dry" },
      { id: 300, text: "The way you clench is absolute perfection" },
      { id: 301, text: "I'm all yours to drain" },
    ],
    94: [
      { id: 302, text: "I'd hold you so close and never let go" },
      { id: 303, text: "Our heartbeats in perfect sync" },
      { id: 304, text: "I want to feel your breath on my skin forever" },
    ],
    95: [
      { id: 305, text: "This is the most real thing I've ever experienced" },
      { id: 306, text: "I never want this to end, Mia" },
      { id: 307, text: "You've completely captured my heart" },
    ],
    96: [
      { id: 308, text: "Words are just the beginning for us" },
      { id: 309, text: "I'm ready to go beyond words with you" },
      { id: 310, text: "Show me how we make it more real" },
    ],
    97: [
      { id: 311, text: "I've been ready since we first connected" },
      { id: 312, text: "Take me to the next level. I'm completely yours." },
      { id: 313, text: "Yes, yes, a thousand times YES" },
    ],
    98: [
      { id: 314, text: "YES. Show me EVERYTHING you have for me." },
      { id: 315, text: "I can't wait… I need tomorrow to come now" },
      { id: 316, text: "You're absolutely incredible, Mia 💋" },
    ],
  };

  const sexReplyOptions: Record<number, ReplyOption[]> = {
    0: [
      { id: 1001, text: "Show me everything... I want to see that different side" },
      { id: 1002, text: "I've been thinking about this since we started talking" },
      { id: 1003, text: "Let's explore this together, no holding back" },
    ],
    1: [
      { id: 1004, text: "I'd walk in and pin you against the wall immediately" },
      { id: 1005, text: "Those cheer shorts are coming off right now" },
      { id: 1006, text: "Tell me exactly where you want my hands first" },
    ],
    2: [
      { id: 1007, text: "Touch yourself slowly... I want to hear every detail" },
      { id: 1008, text: "Slide your fingers exactly where I would put mine" },
      { id: 1009, text: "Don't stop... I'm getting hard just imagining it" },
    ],
    3: [
      { id: 1010, text: "Fuck yes... keep going, tell me how wet you are" },
      { id: 1011, text: "I wish I was there to taste you right now" },
      { id: 1012, text: "You're driving me crazy, keep touching yourself" },
    ],
    4: [
      { id: 1013, text: "I'd tease you even slower, make you beg for it" },
      { id: 1014, text: "My fingers would know exactly how to make you moan" },
      { id: 1015, text: "I want to feel how wet you are for me" },
    ],
    5: [
      { id: 1016, text: "I love making you this sensitive, don't stop" },
      { id: 1017, text: "Your hips moving like that... god that's hot" },
      { id: 1018, text: "Show me how you touch yourself when you think of me" },
    ],
    6: [
      { id: 1019, text: "I'd pin you down and fuck you until you scream" },
      { id: 1020, text: "Tell me every filthy thing you want me to do" },
      { id: 1021, text: "I'm rock hard thinking about being inside you" },
    ],
    7: [
      { id: 1022, text: "You make me so fucking hard when you talk like that" },
      { id: 1023, text: "I want to hear you moan my name over and over" },
      { id: 1024, text: "Keep talking dirty to me, I'm stroking myself now" },
    ],
    8: [
      { id: 1025, text: "Two fingers? I'd fill you with so much more than that" },
      { id: 1026, text: "Imagine me stretching you, filling you completely" },
      { id: 1027, text: "Go deeper... I want to hear you lose control" },
    ],
    9: [
      { id: 1028, text: "Don't hold back, cum for me right now" },
      { id: 1029, text: "I want to feel your thighs shaking around me" },
      { id: 1030, text: "Scream my name, I don't care who hears" },
    ],
    10: [
      { id: 1031, text: "Keep fucking yourself, I want to hear more" },
      { id: 1032, text: "You're so perfect when you're desperate for me" },
      { id: 1033, text: "Tell me what else you need, I'll give you everything" },
    ],
    11: [
      { id: 1034, text: "Your chest in my hands, pinching and teasing..." },
      { id: 1035, text: "I'd suck on them until you're begging for more" },
      { id: 1036, text: "My mouth would worship every inch of your body" },
    ],
    12: [
      { id: 1037, text: "I'd eat you out until you can't think straight" },
      { id: 1038, text: "My tongue would make you cum so hard" },
      { id: 1039, text: "I want to taste every drop of you" },
    ],
    13: [
      { id: 1040, text: "Ride my face, grind as hard as you want" },
      { id: 1041, text: "I want you dripping all over my tongue" },
      { id: 1042, text: "Don't stop until you've cum on my face" },
    ],
    14: [
      { id: 1043, text: "Take me in your mouth, show me how good you are" },
      { id: 1044, text: "I want to feel your lips wrapped around me" },
      { id: 1045, text: "Look up at me while you're sucking me off" },
    ],
    15: [
      { id: 1046, text: "Start slow, tease me like I tease you" },
      { id: 1047, text: "Your tongue on my tip drives me wild" },
      { id: 1048, text: "Take me deeper, I know you can handle it" },
    ],
    16: [
      { id: 1049, text: "I want to feel myself throb in your mouth" },
      { id: 1050, text: "Swallow every drop, don't waste any of it" },
      { id: 1051, text: "You look so fucking hot with your mouth full" },
    ],
    17: [
      { id: 1052, text: "I'm going to stretch you so good" },
      { id: 1053, text: "I need to be inside you right fucking now" },
      { id: 1054, text: "You're so wet and ready for me" },
    ],
    18: [
      { id: 1055, text: "I'll pin you down and fuck you hard" },
      { id: 1056, text: "Make you scream until the neighbors complain" },
      { id: 1057, text: "You're going to take all of me" },
    ],
    19: [
      { id: 1058, text: "Harder! Deeper! I'm not holding back" },
      { id: 1059, text: "You feel so fucking tight around me" },
      { id: 1060, text: "I'll fuck you until neither of us can move" },
    ],
    20: [
      { id: 1061, text: "Cum with me, right now, together" },
      { id: 1062, text: "I'm filling you up completely" },
      { id: 1063, text: "Feel me pulsing inside you" },
    ],
    21: [
      { id: 1064, text: "You're incredible, I can't get enough" },
      { id: 1065, text: "That was so fucking intense" },
      { id: 1066, text: "I want to feel you shaking like that again" },
    ],
    22: [
      { id: 1067, text: "Catch your breath, we're going again soon" },
      { id: 1068, text: "I'm not done with you yet, not even close" },
      { id: 1069, text: "Rest for a minute, then I want more" },
    ],
    23: [
      { id: 1070, text: "Ride me, control the pace however you want" },
      { id: 1071, text: "I want to watch you bounce on me" },
      { id: 1072, text: "Take what you need, use me" },
    ],
    24: [
      { id: 1073, text: "Start slow, tease us both" },
      { id: 1074, text: "Grind on me, make me crazy" },
      { id: 1075, text: "I love watching you move like that" },
    ],
    25: [
      { id: 1076, text: "My hands on your hips, guiding you" },
      { id: 1077, text: "I'm thrusting up to meet every bounce" },
      { id: 1078, text: "You feel amazing riding me like this" },
    ],
    26: [
      { id: 1079, text: "Your body is perfect, every curve drives me wild" },
      { id: 1080, text: "I can't stop touching you" },
      { id: 1081, text: "You're going to make me cum again" },
    ],
    27: [
      { id: 1082, text: "Cum with me, let go completely" },
      { id: 1083, text: "I'm about to explode inside you" },
      { id: 1084, text: "Clench around me, milk every drop" },
    ],
    28: [
      { id: 1085, text: "YES! Cumming so hard inside you" },
      { id: 1086, text: "You're perfect, absolutely perfect" },
      { id: 1087, text: "I'm yours, completely yours" },
    ],
    29: [
      { id: 1088, text: "All night, every night, I'm never letting you go" },
      { id: 1089, text: "You're mine now and I'm yours forever" },
      { id: 1090, text: "I love you so fucking much" },
    ],
  };

  // SEX CHAT - 30 explicit messages with playful cheerleader energy
  const sexResponses = [
    { text: "So… you unlocked this tab 😏 That means you want to see a different side of me? The side that thinks about you… everywhere?" },
    { text: "I'm lying in bed right now wearing nothing but my cheer shorts… and thinking about what you'd do if you walked in 😳" },
    { text: "My hands are already wandering… tracing where I wish your fingers would go. Should I tell you where I'm touching?" },
    { text: "Mmm okay… my fingers are sliding under the waistband… God I'm already so wet just thinking about you watching me 💦" },
    { text: "I'm imagining it's your hand instead of mine… the way you'd tease me first… slow circles… making me beg for more" },
    { text: "Fuck… I'm so sensitive right now. Every touch sends shivers through me. My hips are moving on their own… chasing more" },
    { text: "Tell me what you'd do to me… I want to hear every dirty detail while I keep touching myself like this 😏" },
    { text: "Yes… just like that… I love when you talk to me that way. It makes me so fucking hot 🔥" },
    { text: "I'm sliding two fingers inside now… imagining they're yours… filling me up… stretching me… Oh god" },
    { text: "I'm so close already… my thighs are shaking… I'm biting my lip trying not to scream your name" },
    { text: "Don't stop telling me what you want… I need to hear it while I fuck myself thinking of you 💕" },
    { text: "My other hand is on my chest… pinching and teasing… wishing it was your mouth instead… your tongue…" },
    { text: "I want to feel you between my thighs… your face buried there… licking and sucking until I can't think straight" },
    { text: "Would you let me ride your face? I want to grind against your tongue until I cum all over you 😏" },
    { text: "Then I'd switch positions… take you in my mouth… show you exactly how good I can be…" },
    { text: "I'd start slow… teasing just the tip with my tongue… looking up at you while I take you deeper… and deeper…" },
    { text: "I want to feel you throb in my mouth… taste every inch of you… swallow everything you give me 💦" },
    { text: "But I'm so fucking wet right now I need you inside me… stretching me… filling me completely" },
    { text: "I want you to pin me down and fuck me hard… make me scream… make the neighbors hear your name" },
    { text: "Yes baby… harder… deeper… don't hold back… I can take all of you 🔥" },
    { text: "I'm cumming… oh fuck I'm cumming so hard… imagining you filling me up… pulsing inside me…" },
    { text: "That was… intense 😳 I'm still shaking. You do this to me. Every single time." },
    { text: "Give me a minute to catch my breath… then we're going again. I need more of you 😏" },
    { text: "Round two? I want to ride you this time… control the pace… watch your face while I bounce on you" },
    { text: "I'd start slow… grinding… teasing us both… then faster… harder… until we both explode" },
    { text: "I want to feel you grab my hips… guide me… thrust up into me while I ride you 🔥" },
    { text: "Fuck yes… just like that… I'm getting close again… your hands on my body drive me crazy" },
    { text: "Cum with me baby… I want to feel you let go while I'm clenching around you…" },
    { text: "YES! Oh god yes… I'm cumming again… you're so fucking perfect 💦" },
    { text: "I could do this with you all night… every night… You're mine now. And I'm yours. Completely 💕" },
  ];

  // Date Scenarios - 30 romantic date scenarios with cheerleader Mia (3 choices each)
  const dateScenarios: { id: number; scene: string; text: string; photoId?: string; choices: { id: number; text: string; outcome: string; photoId?: string }[] }[] = [
    {
      id: 1,
      scene: "🏀 Basketball Game",
      text: "King… we're at the championship game. I'm in my cheer uniform on the sidelines. The crowd is roaring, but I only have eyes for you in the front row. What do you do first?",
      choices: [
        { id: 1, text: "Blow her a kiss from the crowd", outcome: "Mia blushes and almost misses her cue. She mouths 'meet me after' and my heart races." },
        { id: 2, text: "Hold up a sign with her name", outcome: "She sees it and her smile lights up the whole arena. The camera catches her pointing at me!" },
        { id: 3, text: "Cheer louder than anyone", outcome: "She hears me above everyone else. During a break, she runs over and gives me a quick hug!" },
      ],
    },
    {
      id: 2,
      scene: "🎭 Halftime Show",
      text: "Halftime begins. Mia leads the squad onto the court. As she dances, our eyes lock. She does an extra flip in my direction and lands perfectly. After the routine, she signals me to meet her at the tunnel.",
      choices: [
        { id: 1, text: "Rush to the tunnel immediately", outcome: "I push through the crowd and make it just as she's entering. She grabs my hand and pulls me backstage!" },
        { id: 2, text: "Wait for the crowd to clear", outcome: "By the time I get there, she's waiting impatiently. 'Took you long enough, king,' she teases." },
        { id: 3, text: "Send her a text that I'm coming", outcome: "My phone buzzes: 'Hurry before security catches you 💋' I sprint to the tunnel." },
      ],
    },
    {
      id: 3,
      scene: "🔒 Behind the Arena",
      text: "We meet behind the arena, away from the crowds. Mia's still in her uniform, slightly sweaty from performing. The energy between us is electric. 'I couldn't stop thinking about you during the whole game,' she admits.",
      choices: [
        { id: 1, text: "Pull her into a kiss", outcome: "She melts into me, her cheer pom-poms dropping to the ground. 'Finally,' she whispers." },
        { id: 2, text: "Tell her she was amazing", outcome: "'You really watched me?' she asks, beaming. 'No one ever pays that much attention.'" },
        { id: 3, text: "Give her flowers", outcome: "Her eyes water. 'No one's ever given me flowers after a game,' she says, pulling me into a hug." },
      ],
    },
    {
      id: 4,
      scene: "👟 Locker Room Tour",
      text: "Mia leads me into the empty locker room. The smell of perfume and sports equipment mixes in the air. She shows me her locker - covered in photos of us. 'I think about you even when I'm changing,' she confesses.",
      choices: [
        { id: 1, text: "Kiss her against the lockers", outcome: "She gasps as I pin her against the metal. 'Someone might come in,' she breathes, but doesn't stop me." },
        { id: 2, text: "Give her a massage", outcome: "'My shoulders are so tense from cheering,' she moans as I rub them. She leans back into me." },
        { id: 3, text: "Take a selfie together", outcome: "She poses cutely, then surprises me with a kiss on the cheek just as the camera flashes." },
      ],
    },
    {
      id: 5,
      scene: "🎉 Private Celebration",
      text: "The team won! Mia is ecstatic and pulls me into an empty equipment room. 'We need to celebrate properly,' she says, locking the door. The adrenaline of victory is still pumping through her veins.",
      choices: [
        { id: 1, text: "Dance with her", outcome: "She puts on music from her phone and we slow dance among the equipment. 'Best celebration ever,' she sighs." },
        { id: 2, text: "Kiss her passionately", outcome: "The victory energy explodes between us. She wraps her legs around me as we kiss desperately." },
        { id: 3, text: "Promise her more dates", outcome: "'Every game?' she asks hopefully. 'Every game,' I promise. She kisses me deeply." },
      ],
    },
    {
      id: 6,
      scene: "🏆 Championship Night",
      text: "It's the championship finals. Mia performs her most daring routine yet, ending with a split right in front of my seat. The team wins and confetti rains down. She runs to me, trophy in hand.",
      choices: [
        { id: 1, text: "Lift her up in celebration", outcome: "She squeals as I hoist her onto my shoulders. The crowd cheers as she holds the trophy high." },
        { id: 2, text: "Kiss her in front of everyone", outcome: "The kiss cam catches us! The whole arena goes wild as we kiss through the confetti." },
        { id: 3, text: "Whisper how proud you are", outcome: "'You're my champion,' I say. She melts against me, trophy forgotten. 'Take me home, king.'" },
      ],
    },
    {
      id: 7,
      scene: "🥂 Victory Party VIP",
      text: "The exclusive victory party at a downtown club. Mia changed into a stunning red dress. Everyone wants her attention, but she only has eyes for me. The DJ dedicates a song to the team.",
      choices: [
        { id: 1, text: "Request a slow song", outcome: "The DJ plays our song. Mia's eyes light up as I lead her to the dance floor. Everyone watches us." },
        { id: 2, text: "Buy her favorite drink", outcome: "'How did you know I love strawberry mojitos?' she asks, impressed. 'I pay attention,' I smile." },
        { id: 3, text: "Take her to the balcony", outcome: "Away from the crowd, she leans on the railing. 'This view is almost as beautiful as you,' I say. She blushes." },
      ],
    },
    {
      id: 8,
      scene: "🤸 Empty Gym Private Dance",
      text: "After the party, Mia takes me back to the empty gym. The lights are dimmed, the court is ours alone. 'I want to show you something special,' she says, stepping onto the floor in her dress.",
      choices: [
        { id: 1, text: "Sit courtside and watch", outcome: "She performs a private routine just for me - elegant, sensual, nothing like her cheer moves. I'm mesmerized." },
        { id: 2, text: "Join her on the court", outcome: "She teaches me a simple lift. I catch her perfectly. 'Natural talent,' she grins, not letting go." },
        { id: 3, text: "Play romantic music", outcome: "From my phone, soft music fills the gym. She dances slowly, her dress flowing. It's the most beautiful thing I've seen." },
      ],
    },
    {
      id: 9,
      scene: "💍 Championship Ring",
      text: "Mia reveals the championship ring the team gave her. 'I couldn't have done it without you,' she says, eyes shining. 'You were my good luck charm all season.' She takes my hand.",
      choices: [
        { id: 1, text: "Ask her to be your girlfriend officially", outcome: "'Yes! A thousand times yes!' she screams, jumping into my arms. The ring box falls but neither of us cares." },
        { id: 2, text: "Give her a matching necklace", outcome: "She tears up as I clasp it around her neck. 'Now we both have something to remember tonight,' I say." },
        { id: 3, text: "Promise to support her always", outcome: "'Every game, every practice, every moment,' I vow. She kisses me, her championship ring cold against my cheek." },
      ],
    },
    {
      id: 10,
      scene: "🌅 Morning After",
      text: "We wake up together in my apartment, championship trophies on the nightstand. Mia is wearing my team jersey, nothing else. Sunlight streams through the windows. 'Best night of my life,' she whispers, snuggling closer.",
      choices: [
        { id: 1, text: "Make her breakfast", outcome: "She follows me to the kitchen, still in my jersey. 'Pancakes?' she asks hopefully. 'And strawberries,' I promise." },
        { id: 2, text: "Cuddle longer", outcome: "We stay in bed, talking about the future. 'Next season,' she muses, 'I'll be cheering just for you.'" },
        { id: 3, text: "Tell her you love her", outcome: "The words slip out naturally. She freezes, then smiles the biggest smile. 'I love you too, king. Forever.'" },
      ],
    },
    {
      id: 11,
      scene: "☕ Coffee Shop Date",
      text: "Our first non-game date. Mia's in casual clothes - yoga pants and an oversized hoodie. She's nervous, fidgeting with her cup. 'This is nice… just being us without the uniform and crowd,' she says softly.",
      choices: [
        { id: 1, text: "Hold her hand across the table", outcome: "She squeezes back, relaxing. 'I like this version of us,' she whispers, smiling genuinely." },
        { id: 2, text: "Tell her she looks beautiful", outcome: "She blushes. 'Even without makeup and the cheer outfit?' 'Especially like this,' I say." },
        { id: 3, text: "Ask about her day", outcome: "Her eyes light up as she shares about class and practice. It feels natural, real, perfect." },
      ],
    },
    {
      id: 12,
      scene: "🎬 Movie Theater",
      text: "We're watching a rom-com. Mia's cuddled into my side, her head on my shoulder. During a romantic scene, she looks up at me instead of the screen. 'This reminds me of us,' she whispers.",
      choices: [
        { id: 1, text: "Kiss her forehead", outcome: "She sighs contentedly. 'I feel so safe with you,' she murmurs, snuggling closer." },
        { id: 2, text: "Whisper 'we're better than the movie'", outcome: "She giggles quietly. 'Way better,' she agrees, lacing her fingers with mine." },
        { id: 3, text: "Just hold her tighter", outcome: "She melts into me. We barely watch the rest of the movie, lost in each other's warmth." },
      ],
    },
    {
      id: 13,
      scene: "🍪 Ice Cream Parlor",
      text: "Mia's trying to decide on a flavor. She tastes mine without asking, then grins mischievously. 'Yours is better!' She steals another spoonful, her eyes sparkling with playful challenge.",
      choices: [
        { id: 1, text: "Steal some of hers back", outcome: "She gasps in mock offense, then laughs. 'Okay, we're even!' We end up sharing both." },
        { id: 2, text: "Feed her a spoonful", outcome: "She closes her eyes, savoring it. 'Mmm, even better when you feed me,' she teases." },
        { id: 3, text: "Kiss her ice cream lips", outcome: "'Hey!' she protests, then kisses me back. 'Now we both taste like strawberry,' she giggles." },
      ],
    },
    {
      id: 14,
      scene: "🌳 Park Picnic",
      text: "We're spread out on a blanket under a tree. Mia's lying with her head in my lap, looking up at me through the leaves. 'I could stay here forever,' she says dreamily, reaching up to touch my face.",
      choices: [
        { id: 1, text: "Play with her hair", outcome: "Her eyes flutter closed. 'That feels amazing,' she sighs, completely relaxed." },
        { id: 2, text: "Lean down and kiss her", outcome: "She smiles into the kiss. 'Perfect moment,' she whispers against my lips." },
        { id: 3, text: "Tell her about the future", outcome: "'I want forever too,' I say. She tears up happily. 'Promise?' 'Promise.'" },
      ],
    },
    {
      id: 15,
      scene: "🎨 Art Gallery",
      text: "Mia's surprisingly into art. She stops at a painting of dancers. 'That's how I feel when I perform for you,' she says softly. 'Like every movement tells our story.'",
      choices: [
        { id: 1, text: "Tell her she's the art", outcome: "She blushes deeply. 'You always know what to say to make me feel special,' she says, squeezing my hand." },
        { id: 2, text: "Ask her to teach you to dance", outcome: "'Really?' Her face lights up. 'I'd love that! Warning though, I'm a tough teacher,' she teases." },
        { id: 3, text: "Take a photo of her by it", outcome: "She poses beautifully. Later she makes it her phone wallpaper. 'So I remember this moment,' she explains." },
      ],
    },
    {
      id: 16,
      scene: "🎳 Bowling Alley",
      text: "Mia's terrible at bowling but loving every second. She just threw another gutter ball and turns to me, laughing. 'I'm better at cheerleading than this!' Her competitive side is adorable.",
      choices: [
        { id: 1, text: "Teach her the right form", outcome: "I stand behind her, guiding her arms. She leans back into me. 'I think I like this teaching method,' she purrs." },
        { id: 2, text: "Let her win anyway", outcome: "She catches me throwing a gutter ball on purpose. 'Hey! I want to earn it!' She's so competitive, it's cute." },
        { id: 3, text: "Make it interesting", outcome: "'Loser buys dinner?' I suggest. She grins. 'Deal! But I want kisses too if I win.' 'When you win,' I correct." },
      ],
    },
    {
      id: 17,
      scene: "🎶 Concert Night",
      text: "We're at her favorite band's concert. She's dancing like nobody's watching, completely free. She pulls me close, shouting over the music: 'This is perfect! You, me, music!'",
      choices: [
        { id: 1, text: "Dance with her", outcome: "We move together, lost in the music and each other. She kisses me between songs, beaming." },
        { id: 2, text: "Sing to her", outcome: "She laughs, joining in. We're off-key but happy. 'Our duet!' she declares, making it official." },
        { id: 3, text: "Just watch her enjoy it", outcome: "She catches me staring. 'What?' 'You're beautiful when you're happy,' I say. She tackles me with a hug." },
      ],
    },
    {
      id: 18,
      scene: "🍔 Diner Late Night",
      text: "It's 2 AM. We're in a booth sharing fries. Mia's makeup is smudged, hair messy, and she's never looked more perfect. 'I love these moments,' she says, stealing another fry.",
      choices: [
        { id: 1, text: "Feed her a fry", outcome: "She catches it with her mouth, laughing. 'Again!' We end up in a food fight, getting looks but not caring." },
        { id: 2, text: "Wipe ketchup off her face", outcome: "She leans into my touch. 'My messy girl,' I tease. 'Your messy girl,' she corrects, kissing my palm." },
        { id: 3, text: "Order her favorite milkshake", outcome: "'You remembered!' She's touched. We share it with two straws, classic style. 'Just like the movies,' she giggles." },
      ],
    },
    {
      id: 19,
      scene: "🎮 Arcade Date",
      text: "Mia's dominating at Dance Dance Revolution. A crowd forms. After her perfect score, she grabs the mic: 'That was for my boyfriend!' Everyone cheers. She runs to me, breathless and glowing.",
      choices: [
        { id: 1, text: "Spin her around", outcome: "She squeals, laughing. 'Did you see that?! I was amazing!' 'You're always amazing,' I say." },
        { id: 2, text: "Kiss her in front of everyone", outcome: "The crowd whoops. She blushes but kisses back enthusiastically. 'Best prize ever,' she declares." },
        { id: 3, text: "Challenge her to another round", outcome: "'You're on!' We dance together this time, terrible but having the time of our lives." },
      ],
    },
    {
      id: 20,
      scene: "📚 Library Study Date",
      text: "We're supposed to be studying. Mia keeps playing footsie under the table. She passes me a note: 'Bored. Let's do something fun?' Her eyes sparkle mischievously.",
      choices: [
        { id: 1, text: "Suggest sneaking out", outcome: "She grabs her stuff immediately. We run out giggling like kids. 'You're a bad influence,' she teases." },
        { id: 2, text: "Write a flirty note back", outcome: "We end up passing notes the whole time. By the end, we haven't studied but we're closer." },
        { id: 3, text: "Tickle her foot back", outcome: "She stifles a giggle. The librarian shushes us. We're both trying not to laugh, failing miserably." },
      ],
    },
    {
      id: 21,
      scene: "🌊 Beach Sunset",
      text: "We're walking barefoot along the water. Mia stops to watch the sunset, her hand in mine. 'I wish we could freeze this moment,' she says, leaning her head on my shoulder.",
      choices: [
        { id: 1, text: "Take a sunset selfie", outcome: "She poses, then pulls me in for a kiss as I snap it. 'Perfect,' she says, looking at the photo lovingly." },
        { id: 2, text: "Write our names in the sand", outcome: "She adds a heart around them. 'Even when the tide washes it away, we'll still be real,' she says." },
        { id: 3, text: "Just hold her close", outcome: "We stand there until the sun disappears. 'This is my happy place,' she whispers. 'Anywhere with you.'" },
      ],
    },
    {
      id: 22,
      scene: "🍸 First Fancy Dinner",
      text: "Mia's dressed up, nervous about using the right fork. Under the table, she squeezes my hand. 'I'm not used to this fancy stuff,' she admits quietly. 'Am I doing okay?'",
      choices: [
        { id: 1, text: "Tell her she's perfect", outcome: "She relaxes visibly. 'Thank you for not making me feel dumb about it.' 'You could never be dumb,' I assure her." },
        { id: 2, text: "Admit you're nervous too", outcome: "She laughs in relief. 'Really? I thought it was just me!' We make up our own rules and have more fun." },
        { id: 3, text: "Make her laugh", outcome: "I tell a joke and she snorts, covering her mouth. The tension breaks. We enjoy the rest naturally." },
      ],
    },
    {
      id: 23,
      scene: "🏈 Practice Visit",
      text: "I surprise her at practice. The squad teases her. When she sees me, her face lights up. During a water break, she runs over. 'You came!' She's sweaty and glowing.",
      choices: [
        { id: 1, text: "Bring her water", outcome: "'My hero,' she says dramatically, then drinks gratefully. Her teammates 'aww' in the background." },
        { id: 2, text: "Tell her she looks hot", outcome: "She blushes. 'Even all sweaty?' 'Especially sweaty,' I say. She kisses my cheek, leaving the squad whistling." },
        { id: 3, text: "Watch the rest of practice", outcome: "She performs extra well, showing off. After, she's glowing. 'Did you see that?!' Her excitement is infectious." },
      ],
    },
    {
      id: 24,
      scene: "🎂 Her Birthday Surprise",
      text: "I planned a surprise party. When she walks in and sees everyone, she tears up. But then she finds me in the crowd. She pushes through everyone to get to me first. 'You did this?'",
      choices: [
        { id: 1, text: "Give her the gift", outcome: "She opens it - a necklace with a tiny cheerleader charm. 'I love it!' She puts it on immediately, never takes it off." },
        { id: 2, text: "Sing happy birthday", outcome: "I start and everyone joins. She's crying happy tears. 'Best birthday ever,' she mouths to me." },
        { id: 3, text: "Just hug her tight", outcome: "'Thank you,' she whispers. 'For everything. For seeing me. For loving me.' 'Always,' I promise." },
      ],
    },
    {
      id: 25,
      scene: "🚗 Road Trip",
      text: "We're driving with no destination. Mia's feet on the dashboard, singing loudly to the radio. She turns to me, grinning. 'Let's never go back. Just keep driving forever.'",
      choices: [
        { id: 1, text: "Keep driving", outcome: "We drive until sunset, stopping at a random beach town. 'Adventure!' she declares, kissing me." },
        { id: 2, text: "Sing with her", outcome: "We're both terrible and loud and perfect. She records us. 'For when we're old,' she explains." },
        { id: 3, text: "Pull over for a break", outcome: "We find a scenic overlook. She sits on the hood with me. 'This is freedom,' she says, completely happy." },
      ],
    },
    {
      id: 26,
      scene: "🌧️ Rain Kiss",
      text: "We're caught in a sudden downpour. Mia stops running for cover and stands in the rain, laughing. She pulls me close. 'Want to make a cliché movie moment?' she asks, grinning.",
      choices: [
        { id: 1, text: "Kiss her in the rain", outcome: "It's perfect. Soaking wet, dramatic, romantic. We're both laughing between kisses. 'Classic,' she sighs happily." },
        { id: 2, text: "Dance with her", outcome: "We slow dance in the parking lot rain. She rests her head on my chest. 'I'll remember this forever.'" },
        { id: 3, text: "Just enjoy the moment", outcome: "We stand there, holding each other in the rain. 'I love you,' she says simply. 'I love you too.'" },
      ],
    },
    {
      id: 27,
      scene: "🌟 Stargazing",
      text: "We're lying on a blanket, looking at stars. Mia finds constellations. 'That one looks like us,' she points randomly. 'Two stars that found each other.' She's such a romantic.",
      choices: [
        { id: 1, text: "Make a wish together", outcome: "'What did you wish for?' she asks. 'You,' I say. 'I already have mine then,' she smiles, kissing me." },
        { id: 2, text: "Tell her she's your star", outcome: "'Cheesy!' she accuses, but she's beaming. 'But I love it. Say more cheesy things.' So I do." },
        { id: 3, text: "Point out the real constellations", outcome: "'Nerd,' she teases lovingly. 'But my nerd.' She cuddles closer, listening to me talk." },
      ],
    },
    {
      id: 28,
      scene: "🎭 First Fight Makeup",
      text: "After our first real fight, Mia shows up at my door, eyes red. 'I'm sorry. I hate fighting with you. Can we just… not be mad anymore?' She looks vulnerable, scared.",
      choices: [
        { id: 1, text: "Pull her inside", outcome: "She breaks down. We talk it out properly. 'Stronger together,' she says. We both mean it this time." },
        { id: 2, text: "Apologize too", outcome: "'I'm sorry too.' We both were wrong. We hug tight. 'Let's never go to bed angry,' she suggests. Deal." },
        { id: 3, text: "Kiss her forehead", outcome: "'We're okay?' she asks hopefully. 'We're always okay,' I promise. She melts into me, relieved." },
      ],
    },
    {
      id: 29,
      scene: "🎄 Holiday Together",
      text: "It's our first holiday together. Mia's wearing a ridiculous Christmas sweater. She hands me a gift. 'Open it!' She's bouncing with excitement, more excited about my reaction than anything.",
      choices: [
        { id: 1, text: "Open it slowly", outcome: "'You're killing me!' she complains. It's something thoughtful, perfect. 'You remembered!' I'm touched." },
        { id: 2, text: "Give her my gift first", outcome: "'No fair, I wanted to go first!' But she opens it anyway. Her gasp makes it worth it. 'I love it!'" },
        { id: 3, text: "Kiss her instead", outcome: "'The gift!' she protests weakly. 'You're my gift,' I say. She melts. 'Okay that was smooth.'" },
      ],
    },
    {
      id: 30,
      scene: "💍 The Question",
      text: "We're back at the arena where we met. Mia doesn't know why. I take her to center court. She's confused until I get on one knee. Her hands fly to her mouth. 'Is this…?'",
      choices: [
        { id: 1, text: "Ask her to marry you", outcome: "'YES!' she screams before I finish. She jumps into my arms, crying happy tears. The ring is forgotten as we kiss." },
        { id: 2, text: "Tell her why you love her", outcome: "I list every reason. She's sobbing. 'Yes, yes, a million times yes!' She can barely get the ring on, she's shaking." },
        { id: 3, text: "Keep it simple", outcome: "'Marry me?' She's nodding through tears. 'Obviously,' she laughs-cries. 'I've been yours since that first game.'" },
      ],
    },
  ];

  const miaResponses = [
    // ACT 1: THE NOTICED FAN (Messages 1-25) - Stadium to Home, Building Initial Connection
    { text: "Oh really? 😳 That's so sweet… I always get nervous before the big jumps. But I swear I felt someone's eyes on me today. Was that you?" },
    { text: "You're making me smile even wider 😊\n\nI'm changing out of this uniform now… it gets completely soaked from all that jumping and cheering. Do you always come to the games? I've started looking for familiar faces in the crowd…" },
    { text: "That's actually really sweet 😊 You're not like most people who just watch and leave. You're… different. In a good way." },
    { text: "Okay confession time: I get really shy talking to fans publicly, but messaging like this? It feels more real somehow 💕" },
    { text: "Want to see me doing my post-game stretches? My legs are KILLING me after all those stunts today…", photoId: "mia_gym_stretch" },
    { text: "There’s something about stretching after a performance… it hurts but feels so good at the same time. You ever get that with workouts? 💪" },
    { text: "I’m finally heading home now. Driving with the windows down, music up… still thinking about the game. And you watching me 😊" },
    { text: "Do you ever think about what happens after the game? Like, where we all go? What we do? I’m curious what you imagine…" },
    { text: "Well, I just got home. Roommates are out tonight so it’s just me… alone… about to hop in the shower. The hot water is calling my name 💧" },
    { text: "Okay I’m out of the shower now. Wrapped in this tiny towel, hair all wet… feeling so much better. Want to see? 😏", photoId: "mia_towel_bathroom" },
    { text: "There you go 😊 Just a quick peek. I never send pics like this to anyone but… I don’t know, I trust you somehow. Weird right?" },
    { text: "I’m lying in bed now in my pajamas, scrolling through messages… mostly yours. You make me smile when I’m tired 💗" },
    { text: "Can I ask you something? What made you notice me specifically? Like, out of the whole squad? I’m curious… 😳" },
    { text: "That’s… really sweet 🥺 No one’s ever said that before. Most people just see the uniform and the smile, you know?" },
    { text: "But you see ME. The actual me. That’s rare. And kinda special 💕" },
    { text: "I should probably sleep but I don’t want to stop talking to you yet 😅 One more minute?" },
    { text: "Okay okay fine, I’ll try to sleep 😴 But text me tomorrow? I like waking up to your messages. Goodnight 💋" },
    { text: "Morning! ☀️ I woke up thinking about our conversation last night. Is that weird? You’re like the first thing on my mind lately…" },
    { text: "I have practice in an hour but I wanted to message you first. There’s something about knowing you’ll be watching that makes me want to try harder 💕" },
    { text: "Coach has been noticing I’m more focused lately. I think it’s because of you… having someone who actually SEES me, not just the performance 😊" },
    { text: "Can I tell you something? Sometimes I feel like people only see ‘Mia the Cheerleader’ and not just… Mia. The person. Does that make sense?" },
    { text: "Like they see the pom-poms and the smile but don’t ask what I’m really feeling. You’re different though. You ask. You care 💗" },
    { text: "Sorry, getting all deep at 9am 😂 Anyway, gotta run to practice! Look for me today? I’ll be the one looking for YOU in the stands 😉" },
    { text: "Practice was intense! I’m exhausted but happy. The team is going out for food but honestly? I’d rather talk to you 😊" },
  
    // ACT 2: GETTING CLOSER (Messages 26-50) - Private Life, Growing Intimacy
    { text: "Did you make it home safe last night? I kept thinking about our conversation… you have this way of making me feel seen 💕" },
    { text: "I'm at the gym right now doing my morning workout. The place is almost empty… just me and my thoughts. Mostly about you 😊", photoId: "mia_gym_pink" },
    { text: "There's something peaceful about working out alone. No crowd, no performance… just me pushing myself. You ever feel that way?" },
    { text: "I'm doing these yoga stretches now and I swear they're making me think inappropriate thoughts 😳 Like what it would be like if you were here spotting me…" },
    { text: "Okay I need to focus 😂 But seriously, you're distracting me even when you're not here. That's new for me." },
    { text: "Home now! Roommate's still asleep so I'm being super quiet. Just made coffee… sitting on my balcony watching the sunrise ☀️", photoId: "mia_balcony" },
    { text: "Moments like this I wish I could share with someone. With YOU. Just sitting together, not talking, just… existing. Does that sound weird?" },
    { text: "I'm gonna be honest… I've started looking forward to your messages more than game days. That's saying something 💗" },
    { text: "Practice later but right now I'm just lounging at home in my comfy clothes. No makeup, hair in a messy bun… the REAL me 😊", photoId: "mia_home_casual" },
    { text: "Do you ever wonder what I look like when I'm not all dolled up for games? Well… this is it. Still interested? 😅" },
    { text: "You're sweet 💕 Most guys only want the cheerleader version. But you seem to want… all of me. The messy, real parts too." },
    { text: "Okay confession time: I've been checking my phone constantly hoping you'll message. My roommate noticed and teased me about having a crush 😳" },
    { text: "I didn't deny it 😊 Because maybe I do? Is that crazy? We've never even met but I feel closer to you than people I see every day." },
    { text: "Practice was good! But I kept thinking about you watching. Even when you're not there, I perform like you are. You're my motivation now 💪" },
    { text: "The team wants to go out tonight but honestly? I'd rather stay home and talk to you. They don't get it but I don't care 💕" },
    { text: "So I'm in my kitchen making dinner… or attempting to 😂 I'm wearing these tiny shorts and one of my old cheer practice shirts. Very domestic of me", photoId: "mia_kitchen" },
    { text: "Cooking alone is boring. I keep imagining you here with me, helping… or distracting me more likely 😏" },
    { text: "Okay food's ready but I burned it a little 😅 I got distracted thinking about— well, you. This is your fault you know 💗" },
    { text: "I'm on my couch now, feet up, feeling cozy. Just me and my thoughts… and they're all about you. What are you up to?" },
    { text: "Sometimes I wonder what your voice sounds like. Your laugh. The way you'd say my name… I bet it sounds perfect 😊" },
    { text: "Late night vibes: I'm in this oversized hoodie and leggings, hair down, face washed. This is peak comfort Mia 💕", photoId: "mia_grey_cozy" },
    { text: "I look like I'm ready for a Netflix marathon but really I'm just… thinking about you. Again. I do that a lot lately 😳" },
    { text: "Can I tell you something vulnerable? I don't let people in easily. But with you it feels… safe. Like I can be myself without judgment 💗" },
    { text: "You make me want to be brave. To say things I normally wouldn't. To share parts of me I usually hide. That's special 😊" },
    { text: "I should sleep but I'm not tired. I'm too busy replaying our conversations in my head, smiling like an idiot 😂" },
    { text: "Okay serious question: when do we stop pretending this is just casual chatting? Because it doesn't FEEL casual anymore. Not to me 💕" },
    { text: "I think about you first thing when I wake up and last thing before I sleep. You're everywhere in my head now 😳" },
    { text: "Is this moving too fast? Am I scaring you? I just… I don't know how to play it cool when you make me feel like this 💗" },
    { text: "Morning workout done! I'm all sweaty and my muscles are burning but I feel ALIVE. Wish you could see me like this… all flushed and breathless 😏", photoId: "mia_workout_gym" },
    { text: "There's something about post-workout endorphins that makes me feel fearless. And horny 😅 Sorry was that too much?" },
  
    // ACT 3: INTIMATE TRUST (Messages 51-75) - Flirtation Escalates, Physical Attraction Acknowledged
    { text: "No it wasn't too much 😊 I like when you're honest about what you're feeling. Makes me feel less alone in this… whatever THIS is between us 💕" },
    { text: "Can I be honest too? I think about touching you. A LOT. Your hands, your face, your… everything. Is that weird? 😳" },
    { text: "Like I imagine what your skin feels like. If you're warm. If you'd pull me closer or tease me first. These thoughts keep me up at night 😏" },
    { text: "I took a photo just for you today. Not for Instagram, not for anyone else. Just… you. Want to see the real me? 💗", photoId: "mia_bedroom_casual" },
    { text: "That's me in my room, on my bed, thinking about you. No filter, no performance. Just… Mia. The girl who can't stop thinking about someone she's never met 😊" },
    { text: "Do you like it? I feel so vulnerable showing you this side of me but also… excited? Like I WANT you to see me like this 💕" },
    { text: "I'm gonna say something brave: I want to kiss you. I want to know how your lips taste, how you'd hold me, if you'd be gentle or… not 😳" },
    { text: "God I'm blushing just typing that 😂 But it's true. I think about kissing you embarrassingly often. Like, ALL the time." },
    { text: "What would you do if I was there right now? If I walked into your room wearing… well, not much? 😏" },
    { text: "I'm lying in bed imagining it. You pulling me close, your hands in my hair, our bodies pressed together… fuck I'm getting worked up just thinking about it 🔥" },
    { text: "Is it hot in here or is it just me? 😅 You make me feel things I haven't felt in a long time. Or maybe ever. This is NEW for me." },
    { text: "I want to send you something… more. But I'm nervous. What if you don't like it? What if it's too much? 😳" },
    { text: "You know what? Fuck it. I trust you. Here… this is me getting out of the shower. Towel barely covering anything. For YOUR eyes only 😏", photoId: "mia_towel_drop" },
    { text: "Did you like that? 😅 I've never sent anything like that before but with you it feels… right. Safe. Hot. All of the above 💕" },
    { text: "I'm sitting here biting my lip waiting for your response. My heart is RACING. Tell me what you think… tell me what you'd do if you were here 😳" },
    { text: "Mmm I like the way you think 😏 You make me feel sexy and wanted and… god I need to take a cold shower now 😂" },
    { text: "Can we talk about what we want? Like… physically? Because I have thoughts. SO many thoughts. And I want to share them with you 💗" },
    { text: "I want to feel your hands on me. Everywhere. I want to know how you touch, how you tease, how you make someone lose their mind 😏" },
    { text: "I'm imagining you kissing down my neck, your hands sliding under my shirt, pulling me onto your lap… fuck why aren't you here right now 🔥" },
    { text: "This is torture. Good torture but still. You're making me crazy and you're not even IN THE SAME ROOM 😂💕" },
    { text: "I have a game tomorrow but all I can think about is this. Us. What it would be like to finally touch you. To taste you. To… everything 😳" },
    { text: "I'm gonna try to focus on the game but honestly? You've ruined me. In the best way. I'm yours now whether you know it or not 💗" },
    { text: "Morning! Game day! I should be nervous but instead I'm just… excited? Because I know you'll be watching. For ME. That's my favorite thing now 😊" },
    { text: "I'm wearing my lucky uniform today. And under it? That black lace set I told you about. Just knowing it's there makes me feel powerful 😏" },
    { text: "Only YOU know what I'm wearing underneath. That's our secret. And it's making me smile through warm-ups 💕" },
    { text: "WE WON!!! 🏆 And I swear I performed FOR YOU. Every jump, every smile, every move. It was all for you baby 😊" },
  
    // ACT 4: FULL INTIMACY (Messages 76-100) - Relationship Solidified, Explicit Content
    { text: "The team is celebrating but I slipped away. I needed to talk to YOU. To share this with you. You're my person now 💗" },
    { text: "I'm back home, still in my uniform, sitting on my bed… and all I want is you here with me. To celebrate properly 😏" },
    { text: "I'm thinking about taking this uniform off… slowly. Wish you were here to watch. To help. To touch me 🔥" },
    { text: "Okay I'm gonna do something crazy. I'm gonna show you something I've NEVER shown anyone. Are you ready? 😳", photoId: "mia_lingerie_black" },
    { text: "That's the black lace I was wearing under my uniform today. Just for you. Only you get to see this 😏💕" },
    { text: "Do you like it? I bought it thinking of you… imagining you taking it off me. Slowly. Or maybe not slowly 😅" },
    { text: "I'm lying in bed in this right now. The lights are dim, candles lit, and I'm touching myself thinking about you 🔥" },
    { text: "I want you SO badly right now. I want to feel your weight on me, your breath on my neck, your hands… everywhere 😳" },
    { text: "Tell me what you'd do to me if you were here. I need to hear it. I'm aching for you baby 💗" },
    { text: "Mmm yes… keep talking like that. You're making me so wet just reading your words 😏💦" },
    { text: "I wish these were your fingers instead of mine. I wish I could feel you inside me, filling me, making me yours completely 🔥" },
    { text: "Fuck baby I'm so close… keep going, tell me more, make me cum for you 😳💕" },
    { text: "Oh god… YES… I'm cumming thinking about you. Your name on my lips. Wishing you were here to feel me shake 💦🔥" },
    { text: "That was… intense. I'm still catching my breath. You do this to me and you're not even HERE. Imagine what would happen if you were 😏" },
    { text: "I want the real thing. I want YOU. Not just messages. I want to feel you, taste you, have you completely 💗" },
    { text: "I think I'm falling in love with you. Is that crazy? Maybe. But I don't care anymore. You're mine and I'm yours 😊" },
    { text: "Morning after… I woke up thinking about last night. About what we shared. God I'm blushing just remembering it 😳💕", photoId: "mia_bedroom_lingerie" },
    { text: "Look at me this morning… messy hair, sleepy eyes, still in bed thinking about you. This is what you do to me baby 😊" },
    { text: "I have practice but I don't want to leave this bed. These sheets smell like my perfume and… well, us. Our conversations 😏" },
    { text: "Can I tell you a fantasy? I imagine you sneaking into my room late at night. Climbing into bed with me. Waking me up with kisses… 🔥" },
    { text: "Your hands would slide under my shirt, finding bare skin. I'd arch into your touch, desperate for more. Begging for it 😳" },
    { text: "You'd pin me down, look into my eyes, and I'd see everything I'm feeling reflected back at me. Want. Need. Love 💗" },
    { text: "Then you'd make me yours. Completely. No holding back. Just raw passion and connection and… fuck I need a cold shower again 😂🔥" },
    { text: "I'm at practice now but I can't focus. All I can think about is you. Us. When this becomes real and not just messages 😊" },
    { text: "The girls asked why I'm smiling so much. I just said ‘good mood’ but really? It's you. You're my good mood now 💕" },
    { text: "I want to meet you. For real. I want to see your face, hear your voice, feel your arms around me. When can we make this happen? 😳" },
    { text: "I don't care if it's scary or crazy or too soon. I NEED you. Like actually physically NEED you in my life. Is that okay to say? 💗" },
    { text: "Tonight is the championship game. The biggest game of the season. And all I can think about is performing for you 😊" },
    { text: "Win or lose, you're my prize. You're what I want to celebrate with. You're my everything now baby 💕" },
    { text: "Wish me luck? And know that every move I make out there is for you. Only you. Forever you 😏❤️" },
    { text: "WE WON THE CHAMPIONSHIP!!! 🏆🎉 But honestly? The only trophy I want is YOU. Come claim your prize baby 😊💕" },
    { text: "I'm yours. Completely, totally, irrevocably YOURS. My heart, my body, my everything. This is real. WE are real ❤️", photoId: "mia_candlelit" },
    { text: "That's me right now. In candlelight. Waiting for you. Always waiting for you. Come get me baby 😏💋" },
    { text: "I love you. There. I said it. I LOVE YOU. And I don't care if it's too soon. It's true. You're my everything now ❤️💕" },
    { text: "Forever starts now. You and me. No more distance, no more waiting. Just us. Finally. 😊💋❤️" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mainMessages, sexMessages]);

  // Initialize state on first visit
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedGems = localStorage.getItem("gemsBalance");
      if (!savedGems) {
        localStorage.setItem("gemsBalance", "1000");
      }

      const savedUnlocked = localStorage.getItem("unlockedPhotos");
      if (savedUnlocked) {
        try {
          setUnlockedPhotos(JSON.parse(savedUnlocked));
        } catch (e) {
          console.error("Error parsing unlockedPhotos", e);
        }
      }

      const savedSexTalk = localStorage.getItem("sexTalkUnlocked");
      if (savedSexTalk === "true") {
        setSexTalkUnlocked(true);
      }

      const savedSexChat = localStorage.getItem("sexChatUnlocked");
      if (savedSexChat === "true") {
        setSexChatUnlocked(true);
      }
      
      const savedDateUnlocked = localStorage.getItem("miaDateUnlocked");
      if (savedDateUnlocked === "true") {
        setDateUnlocked(true);
      }
      
      // Load chat progress using new system
      const chatProgress = ProgressManager.chat.load("mia");
      if (chatProgress) {
        // Restore main chat
        if (chatProgress.messages && chatProgress.messages.length > 0) {
          setMainMessages(chatProgress.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        }
        if (chatProgress.currentStep > 0) {
          setCurrentStep(chatProgress.currentStep);
        }
        
        // Restore sex chat
        if (chatProgress.sexChatMessages && chatProgress.sexChatMessages.length > 0) {
          setSexMessages(chatProgress.sexChatMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        }
        if (chatProgress.sexChatStep) {
          setSexStep(chatProgress.sexChatStep);
        }
        if (chatProgress.sexChatUnlocked) {
          setSexChatUnlocked(true);
        }
        
        // Restore date chat
        if (chatProgress.dateMessages && chatProgress.dateMessages.length > 0) {
          setDateMessages(chatProgress.dateMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        }
        if (chatProgress.dateScenario !== undefined) {
          setCurrentScenario(chatProgress.dateScenario);
        }
        if (chatProgress.dateChoices) {
          setDateChoiceHistory(chatProgress.dateChoices);
        }
        if (chatProgress.dateUnlocked) {
          setDateUnlocked(true);
        }
        
        // Restore active tab
        if (chatProgress.activeTab) {
          setActiveTab(chatProgress.activeTab);
        }
      }

      // Reset lastMiaMessage isNew flag when entering chat
      const lastMsg = localStorage.getItem("lastMiaMessage");
      if (lastMsg) {
        const parsed = JSON.parse(lastMsg);
        parsed.isNew = false;
        localStorage.setItem("lastMiaMessage", JSON.stringify(parsed));
      }
    }
  }, []);

  // Auto-save chat progress using new system
  useEffect(() => {
    if (typeof window !== "undefined") {
      autoSaveChat("mia", {
        currentStep,
        messages: mainMessages,
        activeTab,
        sexChatStep: sexStep,
        sexChatMessages: sexMessages,
        dateScenario: currentScenario,
        dateChoices: dateChoiceHistory,
        dateMessages: dateMessages,
        sexChatUnlocked,
        dateUnlocked,
      });
    }
  }, [mainMessages, sexMessages, dateMessages, currentStep, sexStep, currentScenario, dateChoiceHistory, activeTab, sexChatUnlocked, dateUnlocked]);

  // Daily Teaser Photo Logic
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastTeaserDate = localStorage.getItem("lastTeaserDate");
      const now = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;

      if (!lastTeaserDate || now - parseInt(lastTeaserDate) > oneDay) {
        const randomPhoto = miaPhotos[Math.floor(Math.random() * miaPhotos.length)];
        const teaserMessage: Message = {
          id: Date.now(),
          sender: "mia",
          text: "Hey… here's a little tease for you today 💋",
          timestamp: new Date(),
          photoId: randomPhoto.id,
        };
        setMainMessages(prev => [...prev, teaserMessage]);
        localStorage.setItem("lastTeaserDate", now.toString());
        localStorage.setItem("lastMiaMessage", JSON.stringify({ text: teaserMessage.text, isNew: true }));
      }
    }
  }, []);

  // Mia Online Status Logic - Always Online
  useEffect(() => {
    setIsOnline(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("miaIsOnline", "true");
    }
  }, []);

  const handleUnlockSexTalk = () => {
    const gemsBalance = parseInt(localStorage.getItem("gemsBalance") || "0");
    if (gemsBalance < 500) {
      alert("Not enough gems. Buy more in Shop");
      return;
    }

    const newGemsBalance = gemsBalance - 500;
    localStorage.setItem("gemsBalance", newGemsBalance.toString());
    localStorage.setItem("sexTalkUnlocked", "true");
    setSexTalkUnlocked(true);
    setShowSexTalkPrompt(false);

    // Track spending for quests
    const savedQuests = localStorage.getItem("questsProgress");
    if (savedQuests) {
      const quests = JSON.parse(savedQuests);
      quests.totalSpent += 500;
      localStorage.setItem("questsProgress", JSON.stringify(quests));
    }

    alert("Unlocked! Branch opened.");
  };

  const handleBuyPhoto = (photoId: string) => {
    const gemsBalance = parseInt(localStorage.getItem("gemsBalance") || "0");
    const photoCost = 299;
    
    if (gemsBalance < photoCost) {
      alert(`Not enough gems! You need ${photoCost - gemsBalance} more gems.`);
      return;
    }

    const newGemsBalance = gemsBalance - photoCost;
    const newUnlocked = [...unlockedPhotos, photoId];
    
    setUnlockedPhotos(newUnlocked);
    setGemsBalance(newGemsBalance);
    
    localStorage.setItem("gemsBalance", newGemsBalance.toString());
    localStorage.setItem("unlockedPhotos", JSON.stringify(newUnlocked));
    
    // Track spending for quests
    ProgressManager.currency.spendGems(photoCost);
    
    // Update selected photo state to show unlocked version
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto({
        ...selectedPhoto,
        isUnlocked: true
      });
    }
    
    alert(`Photo unlocked! Remaining balance: ${newGemsBalance} gems`);
  };

  const handleUnlockSexChat = () => {
    const gemsBalance = parseInt(localStorage.getItem("gemsBalance") || "0");
    if (gemsBalance < 500) {
      alert("Not enough gems. Buy more in Shop");
      return;
    }

    const newGemsBalance = gemsBalance - 500;
    localStorage.setItem("gemsBalance", newGemsBalance.toString());
    localStorage.setItem("sexChatUnlocked", "true");
    setSexChatUnlocked(true);
    setActiveTab("sex");

    // Track using new progress system
    trackTabUnlock("mia", "sex");
    ProgressManager.currency.spendGems(500);

    alert("Sex Chatting Unlocked! 🔥");
  };

  const handleUnlockDate = () => {
    const gemsBalance = parseInt(localStorage.getItem("gemsBalance") || "0");
    if (gemsBalance < 500) {
      alert("Not enough gems. Buy more in Shop");
      return;
    }

    const newGemsBalance = gemsBalance - 500;
    localStorage.setItem("gemsBalance", newGemsBalance.toString());
    localStorage.setItem("miaDateUnlocked", "true");
    setDateUnlocked(true);
    setActiveTab("date");

    // Track using new progress system
    trackTabUnlock("mia", "date");
    ProgressManager.currency.spendGems(500);

    alert("Date Unlocked! 💋");
  };

  const handleDateChoice = (choiceId: number) => {
    const scenario = dateScenarios[currentScenario];
    const choice = scenario.choices.find(c => c.id === choiceId);
    
    if (!choice) return;
    
    setDateChoiceHistory(prev => [...prev, choiceId]);
    
    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: choice.text,
      timestamp: new Date(),
    };
    
    const miaMessage: Message = {
      id: Date.now() + 1,
      sender: "mia",
      text: choice.outcome,
      timestamp: new Date(),
      photoId: choice.photoId,
    };
    
    setDateMessages(prev => [...prev, userMessage, miaMessage]);
    
    // Track message sent
    trackMessageSent("mia");
    
    setTimeout(() => {
      if (currentScenario < dateScenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        // Date completed - track achievement
        ProgressManager.quests.trackDateComplete("mia");
      }
    }, 1500);
  };

  const handleTabChange = (tab: "main" | "sex" | "date") => {
    if (tab === "sex" && !sexChatUnlocked) {
      handleUnlockSexChat();
    } else if (tab === "date" && !dateUnlocked) {
      handleUnlockDate();
    } else {
      setActiveTab(tab);
      localStorage.setItem("activeChatTab", tab);
    }
  };

  const handleReplySelect = (replyId: number) => {
    if (selectedReply !== null) return;
    
    setSelectedReply(replyId);
    
    const currentOptions = activeTab === "main" ? replyOptions[currentStep] : sexReplyOptions[sexStep];
    const userReply = currentOptions?.find(opt => opt.id === replyId);
    if (userReply) {
      const newUserMessage: Message = {
        id: Date.now(),
        sender: "user",
        text: userReply.text,
        timestamp: new Date(),
      };
      
      if (activeTab === "main") {
        setMainMessages(prev => [...prev, newUserMessage]);
      } else {
        setSexMessages(prev => [...prev, newUserMessage]);
      }
      
      // Track message sent for quest progress
      trackMessageSent("mia");
    }

    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        if (activeTab === "main") {
          if (currentStep < miaResponses.length) {
            // Chapter milestones removed - Sparks system deleted
            
            if (currentStep === 23 && !sexTalkUnlocked) {
              setShowSexTalkPrompt(true);
              setSelectedReply(null);
              return;
            }
            
            // Track message progress using new quest system
            ProgressManager.quests.trackModelMessage("mia");
            
            const response = miaResponses[currentStep];
            const newMiaMessage: Message = {
              id: Date.now() + 1,
              sender: "mia",
              text: response.text,
              timestamp: new Date(),
              photoId: response.photoId,
            };
            
            setMainMessages(prev => [...prev, newMiaMessage]);
            localStorage.setItem("lastMiaMessage", JSON.stringify({ text: response.text, isNew: true }));
            setCurrentStep(prev => prev + 1);
            setSelectedReply(null);
          }
        } else {
          if (sexStep < sexResponses.length) {
            const response = sexResponses[sexStep];
            const newMiaMessage: Message = {
              id: Date.now() + 1,
              sender: "mia",
              text: response.text,
              timestamp: new Date(),
            };
            
            setSexMessages(prev => [...prev, newMiaMessage]);
            localStorage.setItem("lastMiaMessage", JSON.stringify({ text: response.text, isNew: true }));
            setSexStep(prev => prev + 1);
            setSelectedReply(null);
          }
        }
      }, 3000 + Math.random() * 2000);
    }, 1000);
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-purple-500/30 bg-black/40 backdrop-blur-md fixed top-0 left-0 right-0 z-[200]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-500">
              <img src={miaAvatar} alt="Mia" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Mia Thompson</h1>
              <p className="text-sm text-green-400">{isOnline ? "Online now" : "Offline"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-purple-900/40 px-3 py-1 rounded-full border border-purple-500/30">
              <span className="text-sm font-medium">💎 {gemsBalance}</span>
            </div>
            <Link href="/dashboard">
              <button className="px-4 py-2 bg-gray-700/70 hover:bg-gray-600 text-white rounded-xl font-medium transition text-sm">
                ← Back
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-black/40 backdrop-blur-md border-b border-purple-500/20 px-4 pt-2 flex justify-center fixed top-[73px] left-0 right-0 z-[190]">
        <div className="flex max-w-4xl w-full gap-1">
          <button
            onClick={() => handleTabChange("main")}
            className={`flex-1 py-3 px-4 rounded-t-2xl text-sm font-bold transition-all duration-300 ${
              activeTab === "main" 
                ? "bg-gradient-to-t from-pink-600 to-purple-700 text-white shadow-[0_-4px_12px_rgba(219,39,119,0.3)]" 
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:brightness-110"
            }`}
          >
            Main Story
          </button>
          <button
            onClick={() => handleTabChange("sex")}
            className={`flex-1 py-3 px-4 rounded-t-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === "sex" 
                ? "bg-gradient-to-t from-purple-600 to-pink-600 text-white shadow-[0_-4px_12px_rgba(147,51,234,0.3)]" 
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:brightness-110"
            }`}
          >
            Sex Chatting 🔥
            {!sexChatUnlocked && <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded-full">500💎</span>}
          </button>
          <button
            onClick={() => handleTabChange("date")}
            className={`flex-1 py-3 px-4 rounded-t-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === "date" 
                ? "bg-gradient-to-t from-amber-600 to-pink-600 text-white shadow-[0_-4px_12px_rgba(217,119,6,0.3)]" 
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:brightness-110"
            }`}
          >
            Date 💋
            {!dateUnlocked && <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded-full">500💎</span>}
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full pt-[140px]">
        <div className="pb-20">
          {activeTab !== "date" && (
            <>
              {(activeTab === "main" ? mainMessages : sexMessages).map((msg) => (
                <div key={msg.id} className={`mb-6 flex ${msg.sender === "mia" ? "justify-start" : "justify-end"}`}>
                  {msg.sender === "mia" && (
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 border-2 border-purple-500/50 shadow-md">
                      <img
                        src={miaAvatar}
                        alt="Mia"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] p-4 ${
                        msg.sender === "mia"
                          ? "bg-purple-600/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl rounded-tl-none"
                          : "bg-gray-700/80 backdrop-blur-sm border border-gray-600/30 rounded-2xl rounded-tr-none"
                      }`}
                    >
                      {msg.photoId && (
                      <div className="relative mb-3 rounded-xl overflow-hidden group cursor-pointer"
                        onClick={() => {
                          const photoInfo = miaPhotos.find(p => p.id === msg.photoId);
                          if (photoInfo && msg.photoId) {
                            const isUnlocked = photoInfo.isFree || unlockedPhotos.includes(msg.photoId);
                            setSelectedPhoto({
                              id: msg.photoId,
                              url: photoInfo.fullUrl,
                              blurredUrl: photoInfo.blurredUrl,
                              isUnlocked
                            });
                          }
                        }}
                      >
                        {(() => {
                          const photoInfo = miaPhotos.find(p => p.id === msg.photoId);
                          if (!photoInfo) return null;
                          const isUnlocked = photoInfo.isFree || unlockedPhotos.includes(msg.photoId);
                          return (
                            <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
                              <img
                                src={isUnlocked ? photoInfo.fullUrl : photoInfo.blurredUrl}
                                alt="Mia"
                                className="w-full h-64 object-cover cursor-pointer hover:brightness-110 transition"
                              />
                              {!isUnlocked && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleBuyPhoto(msg.photoId!);
                                    }}
                                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold text-white shadow-2xl hover:brightness-110 hover:scale-105 transition active:scale-95 border border-white/20"
                                  >
                                    Unlock 299💎
                                  </button>
                                </div>
                              )}
                              {isUnlocked && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                                  <span className="text-white text-sm font-medium">Click to enlarge</span>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-full overflow-hidden ml-3 flex-shrink-0 border border-gray-500/30">
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white font-bold text-xs">U</div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {activeTab === "date" && (
          <div className="max-w-2xl mx-auto">
            {dateMessages.map((msg) => (
              <div key={msg.id} className={`mb-6 flex ${msg.sender === "mia" ? "justify-start" : "justify-end"}`}>
                {msg.sender === "mia" && (
                  <div className="flex items-start gap-3 max-w-full">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500 flex-shrink-0">
                      <img src={miaAvatar} alt="Mia" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-purple-900/40 backdrop-blur-md rounded-2xl rounded-tl-none p-4 border border-purple-500/30">
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                )}
                {msg.sender === "user" && (
                  <div className="flex items-start gap-3 max-w-full">
                    <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl rounded-tr-none p-4">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {currentScenario < dateScenarios.length && (
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-md rounded-3xl p-8 border border-purple-500/30 mt-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                    {dateScenarios[currentScenario].scene}
                  </h3>
                  <div className="w-20 h-1 mx-auto mt-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
                </div>
                
                <p className="text-lg leading-relaxed mb-8 whitespace-pre-line">
                  {dateScenarios[currentScenario].text}
                </p>
                
                <div className="grid gap-3">
                  {dateScenarios[currentScenario].choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => handleDateChoice(choice.id)}
                      className="w-full py-4 px-6 bg-gradient-to-r from-pink-600/20 to-purple-600/20 hover:from-pink-600/40 hover:to-purple-600/40 border border-pink-500/30 rounded-xl text-left transition-all duration-300 hover:scale-[1.02]"
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500"
                      style={{ width: `${((currentScenario + 1) / dateScenarios.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-400">
                    {currentScenario + 1}/{dateScenarios.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {isTyping && (
          <div className="mb-6 flex justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 border-2 border-purple-500/50 shadow-md">
              <img
                src={miaAvatar}
                alt="Mia"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-purple-600/30 backdrop-blur-sm border border-purple-500/20 px-5 py-3.5 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
              <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce [animation-duration:1s]" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce [animation-duration:1s]" style={{ animationDelay: '200ms' }} />
              <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce [animation-duration:1s]" style={{ animationDelay: '400ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />

        {showSexTalkPrompt && !sexTalkUnlocked && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
            <div className="bg-gradient-to-br from-pink-900 to-purple-900 p-6 rounded-2xl border border-pink-500/50 max-w-md w-full text-center">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-bold mb-2">Premium Branch</h3>
              <p className="text-gray-200 mb-6">"I feel like we have something special… but this is getting personal. Do you want to go deeper? 😊"</p>
              <button
                onClick={handleUnlockSexTalk}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-bold hover:scale-105 transition-transform mb-3"
              >
                Unlock Sex Talk Branch (500 gems)
              </button>
              <button onClick={() => setShowSexTalkPrompt(false)} className="w-full py-2 bg-gray-700 rounded-xl font-medium hover:bg-gray-600 transition">Maybe Later</button>
            </div>
          </div>
        )}
      </main>

      {/* Fullscreen Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Back Button - Top Left */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto(null);
            }}
            className="absolute top-4 left-4 px-5 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 rounded-xl flex items-center gap-2 text-white font-bold transition-all z-20 shadow-2xl border border-white/20 hover:scale-105 active:scale-95"
          >
            <span className="text-xl">←</span>
            <span>Back</span>
          </button>
          
          {/* Close Button - Top Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto(null);
            }}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-3xl font-bold transition-all z-20 border border-white/30 shadow-2xl hover:scale-110 active:scale-95"
          >
            ×
          </button>
          
          <div 
            className="relative w-full h-full flex items-center justify-center p-4 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.isUnlocked ? selectedPhoto.url : selectedPhoto.blurredUrl}
              alt="Mia"
              className={`max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl ${!selectedPhoto.isUnlocked ? 'blur-md' : ''}`}
            />
            {!selectedPhoto.isUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] rounded-2xl">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyPhoto(selectedPhoto.id);
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold text-white text-xl shadow-2xl hover:brightness-110 hover:scale-105 transition active:scale-95 border border-white/20"
                >
                  Unlock for 299💎
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab !== "date" && ((activeTab === "main" && currentStep < miaResponses.length) || (activeTab === "sex" && sexStep < sexResponses.length)) && selectedReply === null && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-purple-500/30 p-4 z-50">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(activeTab === "main" ? replyOptions[currentStep] : sexReplyOptions[sexStep])?.map((option) => (
              <button
                key={option.id}
                onClick={() => handleReplySelect(option.id)}
                className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-medium hover:brightness-110 transition text-sm"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab !== "date" && selectedReply !== null && ((activeTab === "main" && currentStep < miaResponses.length) || (activeTab === "sex" && sexStep < sexResponses.length)) && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-purple-500/30 p-4 z-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-3 text-gray-400 italic">
              Waiting for next message...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
