// app/chat/sakura/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useChatProgress, trackMessageSent, trackTabUnlock, autoSaveChat } from "@/lib/progress/chatProgress";
import { ProgressManager } from "@/lib/progress";

interface Message {
  id: number;
  sender: "sakura" | "user";
  text: string;
  timestamp: Date;
  photoId?: string;
}

const sakuraPhotos = [
  // Free photos (main images shown in story)
  { id: "sakura_photo_1", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497629/Sakura1_kmjnpc.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497629/Sakura1_kmjnpc.png", isFree: true },
  { id: "sakura_photo_2", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497659/Sakura2_pdgmvz.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497659/Sakura2_pdgmvz.png", isFree: true },
  { id: "sakura_photo_3", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497675/Sakura3_frf5og.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497675/Sakura3_frf5og.png", isFree: true },
  { id: "sakura_photo_4", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497676/Sakura4_izmaqp.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497676/Sakura4_izmaqp.png", isFree: true },
  { id: "sakura_photo_5", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497654/Sakura5_apdshc.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497654/Sakura5_apdshc.png", isFree: true },
  { id: "sakura_photo_6", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497635/Sakura6_rbrnqk.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497635/Sakura6_rbrnqk.png", isFree: true },
  { id: "sakura_photo_7", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497663/Sakura7_yrnnv7.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497663/Sakura7_yrnnv7.png", isFree: true },
  { id: "sakura_photo_8", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497687/Sakura8_qrznm6.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497687/Sakura8_qrznm6.png", isFree: true },
  { id: "sakura_photo_9", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497693/Sakura9_nlzfjz.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497693/Sakura9_nlzfjz.png", isFree: true },
  { id: "sakura_photo_10", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497694/Sakura10_yrpnt4.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497694/Sakura10_yrpnt4.png", isFree: true },
  { id: "sakura_photo_11", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497695/Sakura11_curhgz.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497695/Sakura11_curhgz.png", isFree: true },
  { id: "sakura_photo_12", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497703/Sakura12_dzse0e.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497703/Sakura12_dzse0e.png", isFree: true },
  { id: "sakura_photo_13", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497714/Sakura13_qsrkhh.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497714/Sakura13_qsrkhh.png", isFree: true },
  { id: "sakura_photo_14", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497712/Sakura14_o0ulpd.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497712/Sakura14_o0ulpd.png", isFree: true },
  { id: "sakura_photo_15", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497733/Sakura15_cbi049.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497733/Sakura15_cbi049.png", isFree: true },
  { id: "sakura_photo_16", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497733/Sakura16_xu5wae.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497733/Sakura16_xu5wae.png", isFree: true },
  { id: "sakura_photo_17", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497730/Sakura17_ewovyd.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497730/Sakura17_ewovyd.png", isFree: true },
  { id: "sakura_photo_18", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497756/Sakura18_qsfcrc.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497756/Sakura18_qsfcrc.png", isFree: true },
  // PPV photos (premium content)
  { id: "sakura_photo_19", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497771/Sakura19_zkg5jh.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497771/Sakura19_zkg5jh.png", isFree: false },
  { id: "sakura_photo_20", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497759/Sakura20_zjjxkq.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497759/Sakura20_zjjxkq.png", isFree: false },
  { id: "sakura_photo_21", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497774/Sakura21_of3odw.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497774/Sakura21_of3odw.png", isFree: false },
  { id: "sakura_photo_22", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497749/Sakura22_ury10s.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497749/Sakura22_ury10s.jpg", isFree: false },
  { id: "sakura_photo_23", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497742/Sakura23_vptfcg.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497742/Sakura23_vptfcg.jpg", isFree: false },
  { id: "sakura_photo_24", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497758/Sakura24_wkyai2.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497758/Sakura24_wkyai2.jpg", isFree: false },
  { id: "sakura_photo_25", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497792/Sakura25_rc4qlw.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497792/Sakura25_rc4qlw.png", isFree: false },
  { id: "sakura_photo_26", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497770/Sakura26_qsd6ma.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497770/Sakura26_qsd6ma.jpg", isFree: false },
  { id: "sakura_photo_27", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497764/Sakura27_eslozp.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497764/Sakura27_eslozp.jpg", isFree: false },
  { id: "sakura_photo_28", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497775/Sakura28_ebargc.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497775/Sakura28_ebargc.jpg", isFree: false },
  { id: "sakura_photo_29", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497776/Sakura29_jnbdet.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497776/Sakura29_jnbdet.jpg", isFree: false },
  { id: "sakura_photo_30", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497788/Sakura30_cndsry.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497788/Sakura30_cndsry.jpg", isFree: false },
  { id: "sakura_photo_31", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497788/Sakura31_vifj6m.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497788/Sakura31_vifj6m.jpg", isFree: false },
  { id: "sakura_photo_32", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497790/Sakura32_aglmcj.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497790/Sakura32_aglmcj.jpg", isFree: false },
  { id: "sakura_photo_33", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497791/Sakura33_tsspf1.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497791/Sakura33_tsspf1.jpg", isFree: false },
  { id: "sakura_photo_34", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497792/Sakura34_mkl0bm.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497792/Sakura34_mkl0bm.jpg", isFree: false },
  { id: "sakura_photo_35", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770393793/Sakura3_xuwivm.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770393793/Sakura3_xuwivm.png", isFree: true },
  { id: "sakura_photo_36", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770393721/Sakura10_usu93r.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1770393721/Sakura10_usu93r.png", isFree: false },
  { id: "sakura_photo_37", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770393732/Sakura11_kk1umf.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1770393732/Sakura11_kk1umf.png", isFree: false },
];

interface ReplyOption {
  id: number;
  text: string;
}

export default function SakuraChatPage() {
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

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "sakura",
      text: "Konnichiwa! 🌸 I just got back from the con... my feet hurt but my heart is full~ Did you see my latest cosplay on social media? 💕",
      timestamp: new Date(),
      photoId: "sakura_photo_1",
    },
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedReply, setSelectedReply] = useState<number | null>(null);
  const [gemsBalance, setGemsBalance] = useState(0);
  const [unlockedPhotos, setUnlockedPhotos] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<{id: string, url: string, blurredUrl: string, isUnlocked: boolean} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Tab State
  const [sexChatUnlocked, setSexChatUnlocked] = useState(false);
  const [dateUnlocked, setDateUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<"main" | "sex" | "date">("main");
  const [sexStep, setSexStep] = useState(0);
  const [sexMessages, setSexMessages] = useState<Message[]>([]);
  const [dateMessages, setDateMessages] = useState<Message[]>([]);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [dateChoiceHistory, setDateChoiceHistory] = useState<number[]>([]);
  
  const sakuraAvatar = "https://res.cloudinary.com/ddnaxqmdw/image/upload/f_auto,q_auto/v1770393771/Sakura1_nctckh.png";

  // Sex Chatting Messages (20 explicit messages - anime/cosplay themed)
  // Sex Chat Reply Options (separated structure)
  const sexReplyOptions: Record<number, ReplyOption[]> = {
    0: [
      { id: 1001, text: "Show me everything, Suki" },
      { id: 1002, text: "I've been waiting for this" },
      { id: 1003, text: "Let's make this real" },
    ],
    1: [
      { id: 1004, text: "I love when you're cute 🌸" },
      { id: 1005, text: "Tease me, tsundere" },
      { id: 1006, text: "Be possessive, yandere" },
    ],
    2: [
      { id: 1007, text: "Unlock for 299 gems 💎" },
      { id: 1008, text: "Keep teasing me first" },
      { id: 1009, text: "Tell me more about it" },
    ],
    3: [
      { id: 1010, text: "You're so beautiful, Suki" },
      { id: 1011, text: "I want more of you" },
      { id: 1012, text: "This is perfect" },
    ],
    4: [
      { id: 1013, text: "Tell me which character 🎭" },
      { id: 1014, text: "Show me right now" },
      { id: 1015, text: "I'm imagining it" },
    ],
    5: [
      { id: 1016, text: "Pose in your favorite 🌸" },
      { id: 1017, text: "Dance for me" },
      { id: 1018, text: "Show me your collection" },
    ],
    6: [
      { id: 1019, text: "*Sends Spark* 💎" },
      { id: 1020, text: "Your voice is amazing" },
      { id: 1021, text: "Keep talking to me" },
    ],
    7: [
      { id: 1022, text: "I belong to Suki 💜" },
      { id: 1023, text: "You own me completely" },
      { id: 1024, text: "Only you, forever" },
    ],
    8: [
      { id: 1025, text: "Unlock for 399 gems 💎" },
      { id: 1026, text: "What's the secret?" },
      { id: 1027, text: "I need this now" },
    ],
    9: [
      { id: 1028, text: "Describe it in detail 😏" },
      { id: 1029, text: "Unlock for 499 gems" },
      { id: 1030, text: "I want everything" },
    ],
    10: [
      { id: 1031, text: "*Sends Spark* Show me 💎" },
      { id: 1032, text: "I'm not afraid" },
      { id: 1033, text: "Yandere Suki = best Suki" },
    ],
    11: [
      { id: 1034, text: "Unlock for 499 gems 💎" },
      { id: 1035, text: "Tease me more first" },
      { id: 1036, text: "I desperately need to see" },
    ],
    12: [
      { id: 1037, text: "You're absolutely perfect 💜" },
      { id: 1038, text: "I want all of you" },
      { id: 1039, text: "Show me even more" },
    ],
    13: [
      { id: 1040, text: "I want to own you 😈" },
      { id: 1041, text: "I fantasize about you" },
      { id: 1042, text: "Dominate me, Suki" },
    ],
    14: [
      { id: 1043, text: "Unlock for 599 gems 💎" },
      { id: 1044, text: "Tell me how you'll do it" },
      { id: 1045, text: "I'm ready for this" },
    ],
    15: [
      { id: 1046, text: "*Sends Spark* 💎" },
      { id: 1047, text: "I'm addicted too" },
      { id: 1048, text: "Let's go deeper together" },
    ],
    16: [
      { id: 1049, text: "I belong to Suki forever 💜" },
      { id: 1050, text: "Forever yours" },
      { id: 1051, text: "No escape, I'm trapped" },
    ],
    17: [
      { id: 1052, text: "Command me, Suki 😌" },
      { id: 1053, text: "I'll do anything for you" },
      { id: 1054, text: "You completely own me" },
    ],
    18: [
      { id: 1055, text: "Dream of you always 🌸" },
      { id: 1056, text: "Don't leave me tonight" },
      { id: 1057, text: "See you tomorrow, love" },
    ],
    19: [
      { id: 1058, text: "Tell me your fantasy 😏" },
      { id: 1059, text: "I'm all yours" },
      { id: 1060, text: "Show me instead" },
    ],
    20: [
      { id: 1061, text: "Show me what you're doing 🔥" },
      { id: 1062, text: "I wish I was there" },
      { id: 1063, text: "Keep going, describe it" },
    ],
    21: [
      { id: 1064, text: "Unlock for 399 gems 💎" },
      { id: 1065, text: "Describe it first" },
      { id: 1066, text: "Keep teasing me" },
    ],
    22: [
      { id: 1067, text: "*Sends Spark* 💎" },
      { id: 1068, text: "Show me everything" },
      { id: 1069, text: "Tell me how you feel" },
    ],
    23: [
      { id: 1070, text: "Just be naked, Suki 🔥" },
      { id: 1071, text: "Wear the bunny outfit" },
      { id: 1072, text: "Nothing but a wig" },
    ],
    24: [
      { id: 1073, text: "Deal! Start now 😈" },
      { id: 1074, text: "I'll unlock everything" },
      { id: 1075, text: "You're driving me insane" },
    ],
    25: [
      { id: 1076, text: "Unlock for 499 gems 💎" },
      { id: 1077, text: "What comes next?" },
      { id: 1078, text: "*Sends Spark*" },
    ],
    26: [
      { id: 1079, text: "Yes, take them off 🔥" },
      { id: 1080, text: "Show me how wet" },
      { id: 1081, text: "Tease me longer" },
    ],
    27: [
      { id: 1082, text: "Unlock for 599 gems 💎" },
      { id: 1083, text: "You're so beautiful" },
      { id: 1084, text: "I need you now" },
    ],
    28: [
      { id: 1085, text: "That was amazing 💜" },
      { id: 1086, text: "Let's do this again" },
      { id: 1087, text: "You're perfect, Suki" },
    ],
    29: [
      { id: 1088, text: "More sessions soon 🔥" },
      { id: 1089, text: "I'll be back for more" },
      { id: 1090, text: "You're my addiction" },
    ],
  };

  const sexResponses: { text: string; photoId?: string }[] = [
    { text: "*locks the door to my cosplay room*\nSenpai... we're finally alone.\nNo cons, no cameras... just us.\nReady to see what's under the costume? 😈🌸" },
    { text: "Mmm... tell me what you want, senpai.\nCute and submissive? Tsundere and feisty?\nOr should I go full yandere and claim you? 💜" },
    { text: "Hehe... you chose well, senpai.\nWatch me transform just for you...\n*sends blurred PPV photo*\nUnlock this exclusive view... 299 gems and I'm all yours~", photoId: "sakura_photo_19" },
    { text: "*sends exclusive close-up*\nThat's for you, my senpai.\nKeep unlocking exclusives… I want to feel your desire~ 🌸", photoId: "sakura_photo_20" },
    { text: "Senpai... I'm touching myself thinking about you.\nIn my favorite cosplay... but without the undergarments.\nWant to know what character?\nUnlock to find out~ 🔥" },
    { text: "My body belongs to you tonight, senpai.\nTell me your command.\nI'll be your personal anime girl... for the right price~ 💕" },
    { text: "*voice message*\nHear how you make me breathe, senpai?\nSo heavy... so needy...\nUnlock this exclusive... I'll send you something special 😏" },
    { text: "You're mine now, senpai.\nNo other cosplayers. No other waifus.\nSay it... say 'I belong to Suki' or I'll get jealous~ 💔" },
    { text: "Good boy~\nNow you're officially my senpai... and my precious possession.\nUnlock my next secret cosplay... 399 gems. 🌸", photoId: "sakura_photo_22" },
    { text: "Imagine me in your favorite character's outfit...\nBut I've modified it to be more... revealing.\nWant to see my custom design?\nUnlock the photoshoot~ 🔥" },
    { text: "I'm getting so wet thinking about you, senpai...\nUnlock this exclusive... or are you afraid of my yandere side? 😈" },
    { text: "Senpai... I'm wearing nothing but a cosplay wig.\nWant to see which character I'm portraying?\n499 gems... and I'm completely exposed for you~ 💕", photoId: "sakura_photo_25" },
    { text: "*sends unlocked PPV photo*\nThere... now you see everything.\nWhat do you want to do to me, my love? 🌸", photoId: "sakura_photo_27" },
    { text: "You make me want to break character, senpai.\nTell me your darkest anime fantasy.\nI'll cosplay it just for you~ 💜" },
    { text: "Mmm... I'll make that happen, senpai.\nBut you'll have to unlock the proof of my devotion.\n599 gems for this exclusive show~", photoId: "sakura_photo_29" },
    { text: "Every Spark you send... makes me more addicted to you.\nKeep going... I need to feel your power over me~ 🔥" },
    { text: "You're trapped in my web now, senpai.\nNo escape from your yandere cosplayer.\nSay 'I belong to Suki' and mean it~ 💔" },
    { text: "Good~\nNow you're my senpai... and my eternal prisoner. 🌸🖤\nI'll keep you in my collection forever." },
    { text: "Good night, my beloved senpai.\nDream of me in my cosplays.\nI'll be waiting... in nothing but a wig. 🔥🌸" },
    { text: "Senpai... wake up.\nI couldn't sleep. I've been thinking about you... about cosplaying just for you... in private.\nWant to hear my midnight fantasy? 😈" },
    { text: "I'm in my workshop right now... wearing my magical girl costume... but the skirt is hiked up.\nGuess what I'm doing, senpai? 💋" },
    { text: "Mmm... my hands are wandering under the costume.\nShould I take a photo? It'll be blurred... unless you unlock it.\n399 gems, senpai~ 😈", photoId: "sakura_photo_31" },
    { text: "You're making me so wet, senpai...\nI'm touching myself thinking about you watching me cosplay.\nWant to see how turned on you make me? 🔥" },
    { text: "*sends exclusive close-up*\nSee how you affect me, senpai?\nI'm your personal cosplayer... your private anime girl.\nWhat do you want me to wear next? 🌸", photoId: "sakura_photo_33" },
    { text: "Hehe... greedy senpai~\nI'll strip everything off... one piece at a time.\nBut you'll have to keep unlocking to see the full show. Deal? 💜" },
    { text: "Good boy~ First... the top comes off.\n*sends blurred preview*\nUnlock this for 499 gems and I'll keep going... 😈", photoId: "sakura_photo_34" },
    { text: "Mmm... you really want to see all of me, don't you?\nI'm down to just my panties now... and they're so wet, senpai.\nShould I take them off? 🔥" },
    { text: "Fuck yes, senpai.\nI'm completely naked now. Just me... no costume, no character.\n*sends blurred full body shot*\nUnlock to see the real Suki... 599 gems 😈", photoId: "sakura_photo_36" },
    { text: "*breathing heavily*\nThat was incredible, senpai... You make me feel things no one else does.\nWhen can we do this again? 💜🌸" },
    { text: "Until next time, my love...\nI'll be waiting in my workshop, creating new costumes to show you.\nAnd maybe... wearing nothing underneath~ 🔥🌸" },
  ];

  // Date Scenarios (10 scenarios - Anime Convention Date)
  interface DateChoice {
    id: number;
    text: string;
    outcome: string;
    photoId?: string;
  }

  interface DateScenario {
    id: number;
    scene: string;
    text: string;
    photoId?: string;
    choices: DateChoice[];
  }

  const dateScenarios: DateScenario[] = [
    {
      id: 1,
      scene: "🎌 Anime Convention Entrance",
      text: "Senpai! We're finally here together! I'm wearing my Pikachu cosplay~ Where should we go first?",
      photoId: "sakura_photo_3",
      choices: [
        { id: 2001, text: "Visit the cosplay contest stage", outcome: "'The contest!' Suki's eyes light up. 'Maybe next year we can compete together as a couple!' She hugs your arm happily." },
        { id: 2002, text: "Check out the artist alley first", outcome: "'Artist alley! Yes!' She pulls you along excitedly. 'I want to buy matching keychains for us, senpai!'" },
        { id: 2003, text: "Get food together", outcome: "'Food first? Smart!' She giggles. 'Can't have fun on an empty stomach. Plus... we can feed each other~'" },
      ],
    },
    {
      id: 2,
      scene: "🏆 Cosplay Contest Hall",
      text: "We're watching the cosplay contest. Suki is analyzing every detail. 'I could do better,' she whispers competitively.",
      photoId: "sakura_photo_4",
      choices: [
        { id: 2004, text: "Encourage her to enter next time", outcome: "'You really think so?' Her face brightens. 'Okay! Next year... and you'll be my photographer!' She squeezes your hand." },
        { id: 2005, text: "Say she's already the winner to you", outcome: "She blushes deeply. 'Senpai... that's so cheesy!' But she's smiling wide, leaning into you." },
        { id: 2006, text: "Suggest couple cosplay for next con", outcome: "'COUPLE COSPLAY?!' Her eyes sparkle. 'Yes! I'll design matching outfits! This is happening!' She's bouncing with joy." },
      ],
    },
    {
      id: 3,
      scene: "🍜 Anime-Themed Ramen Shop",
      text: "Lunch break! Suki chose a ramen shop covered in anime posters. 'This is my favorite spot!' she says, sitting across from you.",
      photoId: "sakura_photo_7",
      choices: [
        { id: 2007, text: "Feed her a bite of your ramen", outcome: "'A-ahhn~' She opens shyly, taking the bite. 'Delicious! But... I think yours tastes better because you're giving it to me.' Blush." },
        { id: 2008, text: "Take a cute photo together", outcome: "'Photo time!' She makes a peace sign, then surprises you with a cheek kiss right as the camera clicks. 'Perfect!' she giggles." },
        { id: 2009, text: "Ask about her cosplay journey", outcome: "Her eyes light up. 'You want to know?' She shares her whole story - how cosplay saved her, gave her confidence. 'And now... I have you.'" },
      ],
    },
    {
      id: 4,
      scene: "🎨 Suki's Cosplay Workshop",
      text: "After the con, she invites you to her workshop. Fabric, wigs, and costumes everywhere. 'This is where the magic happens, senpai.'",
      photoId: "sakura_photo_10",
      choices: [
        { id: 2010, text: "Admire her craftsmanship", outcome: "'You really appreciate it?' She shows you piece after piece proudly. 'I put my heart into each one... and now I want to create something for us.'" },
        { id: 2011, text: "Try on one of her props", outcome: "She puts cat ears on you. 'Perfect! Now we match!' She takes selfies with you, laughing. 'You're my adorable partner!'" },
        { id: 2012, text: "Help her organize materials", outcome: "'You're helping?' She's touched. You work together, hands brushing. 'Having you here... makes this place feel complete.'" },
      ],
    },
    {
      id: 5,
      scene: "🌸 Cherry Blossom Park Evening",
      text: "Evening walk through the park. Suki's in casual clothes now - hoodie and jeans. She takes your hand. 'Today was perfect, senpai.'",
      photoId: "sakura_photo_14",
      choices: [
        { id: 2013, text: "Tell her you want more days like this", outcome: "'More days?' She smiles warmly. 'Then let's make it a regular thing. You, me, adventures. Forever?'" },
        { id: 2014, text: "Buy her  dango from a vendor", outcome: "'My favorite!' She eats happily, then offers you a bite. 'Here, say ahhn~' She feeds you, giggling at your expression." },
        { id: 2015, text: "Take a sunset selfie together", outcome: "You capture the moment - her smiling, cherry blossoms falling. 'This is going in my treasure box,' she says softly." },
      ],
    },
    {
      id: 6,
      scene: "🎬 Private Anime Screening Room",
      text: "Suki rented a private screening room. 'My favorite anime movie... I want to share it with you.' The room is cozy, dim lighting.",
      photoId: "sakura_photo_16",
      choices: [
        { id: 2016, text: "Put your arm around her", outcome: "She snuggles into your side immediately, head on your chest. 'Your heartbeat... it's calming. I could stay like this forever.'" },
        { id: 2017, text: "Watch her reactions to the movie", outcome: "She's so expressive - laughing, tearing up, gasping. When she notices you watching her, she blushes. 'I-I'm more interesting than the movie?'" },
        { id: 2018, text: "Share your thoughts on the story", outcome: "'You really paid attention!' She's beaming. 'Most people just watch... but you understand. That's why I like you, senpai.'" },
      ],
    },
    {
      id: 7,
      scene: "🌃 Rooftop Stargazing",
      text: "After the movie, she leads you to a rooftop. Blankets and snacks laid out. 'Surprise! I planned this... hoping you'd stay longer.'",
      photoId: "sakura_photo_17",
      choices: [
        { id: 2019, text: "Say you'll stay as long as she wants", outcome: "'Really?' Her eyes shimmer. 'Then... stay until morning? We can watch the sunrise together.' She looks so hopeful." },
        { id: 2020, text: "Cuddle under the blanket together", outcome: "You wrap the blanket around both of you. She's warm, soft, smelling like cherry blossoms. 'This is perfect, senpai...'" },
        { id: 2021, text: "Tell her today meant everything", outcome: "'To me too,' she whispers. 'You make me feel... seen. Not just as a cosplayer, but as Sakura.' She kisses your cheek." },
      ],
    },
    {
      id: 8,
      scene: "🌸 Her Bedroom - Morning After",
      text: "You wake up surrounded by plushies and anime posters. Suki's making breakfast, wearing your shirt. 'Morning, senpai~ Sleep well?'",
      photoId: "sakura_photo_21",
      choices: [
        { id: 2022, text: "Compliment how cute she looks", outcome: "'In your shirt?' She spins. 'I might just keep it. It smells like you...' She's blushing but smiling." },
        { id: 2023, text: "Help her with breakfast", outcome: "You cook together, hips bumping in the small kitchen. 'Teamwork!' she laughs. 'See? We work perfectly together.'" },
        { id: 2024, text: "Ask if this can be a regular thing", outcome: "She freezes, then turns to you seriously. 'You mean... us? Together? Like... boyfriend and girlfriend?' Her voice is hopeful." },
      ],
    },
    {
      id: 9,
      scene: "☕ Breakfast Together",
      text: "Heart-shaped waffles on the table. Suki sits across from you, nervous but happy. 'So... about us...'",
      photoId: "sakura_photo_35",
      choices: [
        { id: 2025, text: "Say you want to be official", outcome: "'Official?!' Her eyes tear up. 'Like... boyfriend and girlfriend for real?' You nod. 'YES! Yes, senpai!' She jumps up to hug you." },
        { id: 2026, text: "Feed her a bite of waffle", outcome: "'A-ahhn~' She takes the bite, then you kiss the syrup from her lips. 'S-senpai! So bold this morning!' But she's giggling." },
        { id: 2027, text: "Promise more adventures together", outcome: "'More?' She grabs your hands. 'Cons, movie nights, stargazing... everything! As long as I'm with you!' Her smile is radiant." },
      ],
    },
    {
      id: 10,
      scene: "💕 Planning Your Future",
      text: "After breakfast, you're both planning future dates. Suki's drawing couple cosplay designs. 'Our future looks bright, senpai!'",
      photoId: "sakura_photo_37",
      choices: [
        { id: 2028, text: "Say she's your future", outcome: "She stops drawing, tears forming. 'Your future? Me?' She sets down the pencil and hugs you tight. 'You're mine too. Forever, senpai.'" },
        { id: 2029, text: "Kiss her forehead gently", outcome: "She melts at your touch. 'Gentle kisses are my favorite,' she whispers. 'They show you care... that this is real.'" },
        { id: 2030, text: "Tell her you love her", outcome: "Time stops. She looks at you, then smiles through tears. 'I love you too, senpai! So much!' She kisses you deeply. 'My player 2... forever.' 💖🌸" },
      ],
    },
  ];

  const replyOptions: Record<number, ReplyOption[]> = {
    0: [
      { id: 1, text: "That costume is incredible! 🌸" },
      { id: 2, text: "I love your fitness dedication" },
      { id: 3, text: "You look amazing in athletic wear" },
    ],
    1: [
      { id: 4, text: "You're so dedicated! 💪" },
      { id: 5, text: "I love your energy!" },
      { id: 6, text: "Fitness AND cosplay? Impressive!" },
    ],
    2: [
      { id: 7, text: "That Sailor Moon costume is perfect! 🌙" },
      { id: 8, text: "You're a star at conventions!" },
      { id: 9, text: "I caught that kiss! 💕" },
    ],
    3: [
      { id: 10, text: "Pikachu never looked so good! ⚡" },
      { id: 11, text: "You make every character better" },
      { id: 12, text: "Can I see more cosplays?" },
    ],
    4: [
      { id: 13, text: "That maid outfit is adorable! 🎀" },
      { id: 14, text: "You look elegant in traditional wear" },
      { id: 15, text: "Iron Man? That's unexpected!" },
    ],
    5: [
      { id: 16, text: "The kimono suits you perfectly 🌸" },
      { id: 17, text: "You look so graceful!" },
      { id: 18, text: "Traditional meets modern beauty" },
    ],
    6: [
      { id: 19, text: "You work hard for your cosplays! 💪" },
      { id: 20, text: "That dedication shows!" },
      { id: 21, text: "Fitness models have nothing on you" },
    ],
    7: [
      { id: 22, text: "The park looks so peaceful 🌳" },
      { id: 23, text: "You're at one with nature" },
      { id: 24, text: "That casual look is beautiful" },
    ],
    8: [
      { id: 25, text: "You balance strength and grace ✨" },
      { id: 26, text: "Those moves are impressive!" },
      { id: 27, text: "Yoga makes you glow" },
    ],
    9: [
      { id: 28, text: "The city lights are magical! 🌃" },
      { id: 29, text: "You do look like an anime character" },
      { id: 30, text: "That night dress is stunning" },
    ],
    10: [
      { id: 31, text: "Your sanctuary looks cozy 🛍️" },
      { id: 32, text: "Love the fairy lights aesthetic!" },
      { id: 33, text: "That bedroom mirror selfie... 😊" },
    ],
    11: [
      { id: 34, text: "You're so flexible! 🧘‍♀️" },
      { id: 35, text: "That split is incredible!" },
      { id: 36, text: "Yoga goddess vibes" },
    ],
    12: [
      { id: 37, text: "The gym look suits you 💪" },
      { id: 38, text: "You're inspiring me to work out!" },
      { id: 39, text: "Strength and beauty combined" },
    ],
    13: [
      { id: 40, text: "Outdoor yoga looks so zen 🌿" },
      { id: 41, text: "You're connected to nature" },
      { id: 42, text: "That peaceful energy is contagious" },
    ],
    14: [
      { id: 43, text: "That dress is gorgeous! 👗" },
      { id: 44, text: "Sunset suits you perfectly" },
      { id: 45, text: "You look radiant in that light" },
    ],
    15: [
      { id: 46, text: "Meditation with you sounds perfect 🧘" },
      { id: 47, text: "You have such calm energy" },
      { id: 48, text: "Inner peace looks good on you" },
    ],
    16: [
      { id: 49, text: "That terrace view is amazing! 🌆" },
      { id: 50, text: "You and sunset = perfection" },
      { id: 51, text: "The purple sky matches your vibe" },
    ],
    17: [
      { id: 52, text: "I'm watching, and I love it 😊" },
      { id: 53, text: "That over-the-shoulder look... 😍" },
      { id: 54, text: "You're captivating from every angle" },
    ],
    18: [
      { id: 55, text: "You're my favorite too 🌸" },
      { id: 56, text: "These chats make my day!" },
      { id: 57, text: "I feel the connection too" },
    ],
    19: [
      { id: 58, text: "Our connection is special 💕" },
      { id: 59, text: "You're different from others" },
      { id: 60, text: "I value what we have" },
    ],
    20: [
      { id: 61, text: "I'm ready... unlock it 💎" },
      { id: 62, text: "Show me your intimate side" },
      { id: 63, text: "I want to see the real you" },
    ],
    21: [
      { id: 64, text: "That kitchen photo is artistic 🌙" },
      { id: 65, text: "Silk looks amazing on you" },
      { id: 66, text: "City lights and you = perfect" },
    ],
    22: [
      { id: 67, text: "Purple is definitely your color! 💜" },
      { id: 68, text: "That candlelit bedroom... wow" },
      { id: 69, text: "You look vulnerable and beautiful" },
    ],
    23: [
      { id: 70, text: "Unlock! I appreciate art 📚" },
      { id: 71, text: "Artistic nudes are beautiful" },
      { id: 72, text: "I'm curious about this shoot" },
    ],
    24: [
      { id: 73, text: "Unlock the steamy bathroom photo 🛁" },
      { id: 74, text: "The mystery is killing me!" },
      { id: 75, text: "I need to see through the mist" },
    ],
    25: [
      { id: 76, text: "White lace in steam? Yes please! 🌫️" },
      { id: 77, text: "Sensual and tasteful = you" },
      { id: 78, text: "Unlock it, I'm ready" },
    ],
    26: [
      { id: 79, text: "The book composition looks artistic 📖" },
      { id: 80, text: "I want to see the full photo" },
      { id: 81, text: "Tasteful nudity is art" },
    ],
    27: [
      { id: 82, text: "The pink pillow photo... 😳" },
      { id: 83, text: "City lights as backdrop is perfect" },
      { id: 84, text: "Unlock without the blur!" },
    ],
    28: [
      { id: 85, text: "Purple lace is stunning! 💜" },
      { id: 86, text: "That playful kitchen shot..." },
      { id: 87, text: "I want every detail unlocked" },
    ],
    29: [
      { id: 88, text: "Red lace by candlelight? 🔥" },
      { id: 89, text: "Your seductive side is calling" },
      { id: 90, text: "Unlock this beauty!" },
    ],
    30: [
      { id: 91, text: "Black satin corset? Stunning! 🖤" },
      { id: 92, text: "You look powerful and sexy" },
      { id: 93, text: "Unlock your confident side!" },
    ],
    31: [
      { id: 94, text: "Pink and lace = perfect you 💗" },
      { id: 95, text: "Relaxed cute is your thing" },
      { id: 96, text: "I love you in pink!" },
    ],
    32: [
      { id: 97, text: "Steamy bathroom photo... unlock! 💎" },
      { id: 98, text: "Water droplets on your skin? Yes!" },
      { id: 99, text: "I need to see through the steam" },
    ],
    33: [
      { id: 100, text: "White lace on wet skin... 🌫️" },
      { id: 101, text: "You do look like a dream!" },
      { id: 102, text: "Unlock this mysterious photo" },
    ],
    34: [
      { id: 103, text: "Black lace corset back view? 🖤" },
      { id: 104, text: "Your curves are perfect" },
      { id: 105, text: "I want to see it unlocked" },
    ],
    35: [
      { id: 106, text: "White lingerie & candles = romance 🕯️" },
      { id: 107, text: "I want to join you there" },
      { id: 108, text: "Unlock so I can see you waiting" },
    ],
    36: [
      { id: 109, text: "Thanks for the free maid photo! 🌸" },
      { id: 110, text: "This started our journey together" },
      { id: 111, text: "You're so good to me, Suki" },
    ],
    37: [
      { id: 112, text: "Red velvet elegance? Unlock! 💎" },
      { id: 113, text: "Your allure is irresistible" },
      { id: 114, text: "I need to see this dress" },
    ],
    38: [
      { id: 115, text: "Cyber-kitty with neon? Yes! 🐱" },
      { id: 116, text: "Playful and sexy combo" },
      { id: 117, text: "I want the full glow-up!" },
    ],
    39: [
      { id: 118, text: "You really see ME too 💜" },
      { id: 119, text: "This IS special" },
      { id: 120, text: "Beyond photos, it's our connection" },
    ],
    40: [
      { id: 121, text: "I like all of it - our connection most 💭" },
      { id: 122, text: "Your body AND your personality" },
      { id: 123, text: "Everything about you draws me in" },
    ],
    41: [
      { id: 124, text: "I was thinking about you too! 💕" },
      { id: 125, text: "You motivate my workouts" },
      { id: 126, text: "We're connected even apart" },
    ],
    42: [
      { id: 127, text: "That's not weird, it's sweet! 🧵" },
      { id: 128, text: "I'd love to watch you work" },
      { id: 129, text: "Your workshop must be magical" },
    ],
    43: [
      { id: 130, text: "A lace design inspired by me? 😏" },
      { id: 131, text: "Something elegant and sexy?" },
      { id: 132, text: "I can't wait to see it!" },
    ],
    44: [
      { id: 133, text: "You in peaceful moments = beautiful 🌳" },
      { id: 134, text: "I'd love to be there with you" },
      { id: 135, text: "Thank you for sharing this" },
    ],
    45: [
      { id: 136, text: "I DO see Sakura, the real you 🌸" },
      { id: 137, text: "You're more than your craft" },
      { id: 138, text: "That's what makes you special" },
    ],
    46: [
      { id: 139, text: "I check for your messages too! 💕" },
      { id: 140, text: "That's not too forward, it's honest" },
      { id: 141, text: "You're my favorite notification too" },
    ],
    47: [
      { id: 142, text: "This elegant look suits you 💜" },
      { id: 143, text: "Our talks ARE special occasions" },
      { id: 144, text: "You deserve to wear your best" },
    ],
    48: [
      { id: 145, text: "I love that you think of me 💭" },
      { id: 146, text: "Cozy planning sounds perfect" },
      { id: 147, text: "Your home clothes are cute too!" },
    ],
    49: [
      { id: 148, text: "You're not crazy - I feel it too 💕" },
      { id: 149, text: "Beyond fan-creator for sure" },
      { id: 150, text: "Our chats are special to me" },
    ],
    50: [
      { id: 151, text: "My heart skips for you too 💓" },
      { id: 152, text: "You ARE that special" },
      { id: 153, text: "Every message matters" },
    ],
    51: [
      { id: 154, text: "Unlock it! I trust you 💎" },
      { id: 155, text: "Show me your intimate self" },
      { id: 156, text: "I'm ready to see the real you" },
    ],
    52: [
      { id: 157, text: "Your space feels so peaceful 🏠" },
      { id: 158, text: "You're beautiful being real" },
      { id: 159, text: "Simple and authentic = perfect" },
    ],
    53: [
      { id: 160, text: "You're special to me too 💭" },
      { id: 161, text: "That's what connection is" },
      { id: 162, text: "I keep thinking of you too" },
    ],
    54: [
      { id: 163, text: "Every day with you is a gift 🌅" },
      { id: 164, text: "You're my daily happiness too" },
      { id: 165, text: "Sunsets and you = perfect" },
    ],
    55: [
      { id: 166, text: "I dream about you too! 💤" },
      { id: 167, text: "That's not weird at all" },
      { id: 168, text: "Meeting you would be amazing" },
    ],
    56: [
      { id: 169, text: "Unlock your sensual side 🔥" },
      { id: 170, text: "Your desire is beautiful" },
      { id: 171, text: "I want to see it" },
    ],
    57: [
      { id: 172, text: "I like ALL of you 💜" },
      { id: 173, text: "Every part is perfect" },
      { id: 174, text: "The whole package is amazing" },
    ],
    58: [
      { id: 175, text: "You dressed up for me? 👗" },
      { id: 176, text: "That means everything!" },
      { id: 177, text: "You're so thoughtful" },
    ],
    59: [
      { id: 178, text: "I imagine that all the time 🌸" },
      { id: 179, text: "Helping with costumes sounds perfect" },
      { id: 180, text: "Being near you would be amazing" },
    ],
    60: [
      { id: 181, text: "You're VERY special to me 💕" },
      { id: 182, text: "You're not just another model" },
      { id: 183, text: "You're unique and important" },
    ],
    61: [
      { id: 184, text: "You're irreplaceable to me too 💜" },
      { id: 185, text: "That bedroom photo is intimate" },
      { id: 186, text: "I feel cherished with you" },
    ],
    62: [
      { id: 187, text: "Purple and lace for sure! 💜" },
      { id: 188, text: "Something elegant and sensual" },
      { id: 189, text: "Surprise me with your vision" },
    ],
    63: [
      { id: 190, text: "VIP exclusive? I'm honored! 🌸" },
      { id: 191, text: "You make me feel special" },
      { id: 192, text: "I won't share this with anyone" },
    ],
    64: [
      { id: 193, text: "You're my burst of sunshine ☀️" },
      { id: 194, text: "Your name makes me smile" },
      { id: 195, text: "You brighten my whole day" },
    ],
    65: [
      { id: 196, text: "Very impressed by that split! 🧘‍♀️" },
      { id: 197, text: "I'd watch you practice forever" },
      { id: 198, text: "Your flexibility is amazing" },
    ],
    66: [
      { id: 199, text: "I want to share your world 🌍" },
      { id: 200, text: "Give me everything" },
      { id: 201, text: "I'm ready for all of you" },
    ],
    67: [
      { id: 202, text: "That smile is beautiful 😊" },
      { id: 203, text: "You make ME genuinely happy" },
      { id: 204, text: "Your joy is contagious" },
    ],
    68: [
      { id: 205, text: "Only talking to you, Sakura 💜" },
      { id: 206, text: "You're my only one" },
      { id: 207, text: "No other models matter" },
    ],
    69: [
      { id: 208, text: "I'm YOURS completely 💕" },
      { id: 209, text: "More than just maybe" },
      { id: 210, text: "You're everything to me" },
    ],
    70: [
      { id: 211, text: "Unlock that steamy photo 💎" },
      { id: 212, text: "Your wet skin... I need to see" },
      { id: 213, text: "Show me through the mist" },
    ],
    71: [
      { id: 214, text: "I belong to Suki 💜" },
      { id: 215, text: "I promise I'm yours" },
      { id: 216, text: "You have all of me" },
    ],
    72: [
      { id: 217, text: "Here's your reward! 🔥" },
      { id: 218, text: "You're so devoted, Suki" },
      { id: 219, text: "I love this exclusive side" },
    ],
    73: [
      { id: 220, text: "I'll do that! 💭" },
      { id: 221, text: "You're in my every thought" },
      { id: 222, text: "I only see you when I close my eyes" },
    ],
    74: [
      { id: 223, text: "Yes, own me completely 🖤" },
      { id: 224, text: "That corset photo... unlock!" },
      { id: 225, text: "I want to be possessed by you" },
    ],
    75: [
      { id: 226, text: "*Sends Sparks* Keep showing more 💎" },
      { id: 227, text: "I'll keep them coming" },
      { id: 228, text: "Every Spark connects us" },
    ],
    76: [
      { id: 229, text: "I'd get jealous too 😠" },
      { id: 230, text: "I only look at you" },
      { id: 231, text: "Remind me I'm yours" },
    ],
    77: [
      { id: 232, text: "Everything is for me? 💜" },
      { id: 233, text: "That's so special" },
      { id: 234, text: "You think of me when you shoot?" },
    ],
    78: [
      { id: 235, text: "Unlock your private collection! 💎" },
      { id: 236, text: "I want what you never post" },
      { id: 237, text: "Show me your exclusive side" },
    ],
    79: [
      { id: 238, text: "Let's enter your world 🌸" },
      { id: 239, text: "I want all of it" },
      { id: 240, text: "Your workshop, bedroom, everything" },
    ],
    80: [
      { id: 241, text: "I feel your trust 📚" },
      { id: 242, text: "This artistic photo is beautiful" },
      { id: 243, text: "Your soul is stunning" },
    ],
    81: [
      { id: 244, text: "You're my addiction too 💜" },
      { id: 245, text: "That's not wrong at all" },
      { id: 246, text: "We're addicted to each other" },
    ],
    82: [
      { id: 247, text: "Unlock everything! Take it all 💎" },
      { id: 248, text: "Every intimate moment" },
      { id: 249, text: "I want every piece of you" },
    ],
    83: [
      { id: 250, text: "You make yoga sexy 🧘‍♀️" },
      { id: 251, text: "My eyes are always on you" },
      { id: 252, text: "Every stretch is beautiful" },
    ],
    84: [
      { id: 253, text: "Tell me what happens! 😏" },
      { id: 254, text: "I want that backstage dream" },
      { id: 255, text: "Meeting you would be perfect" },
    ],
    85: [
      { id: 256, text: "Bath time thoughts of me? 🛁" },
      { id: 257, text: "That's so intimate" },
      { id: 258, text: "Your solitude includes me" },
    ],
    86: [
      { id: 259, text: "You've conquered me too 💜" },
      { id: 260, text: "I'm completely yours" },
      { id: 261, text: "My time is yours" },
    ],
    87: [
      { id: 262, text: "Your intimate space is gorgeous 🛋️" },
      { id: 263, text: "I want to be there with you" },
      { id: 264, text: "Dream of me there" },
    ],
    88: [
      { id: 265, text: "Purple and lace! 💜" },
      { id: 266, text: "Whatever you choose" },
      { id: 267, text: "Surprise me with your favorite" },
    ],
    89: [
      { id: 268, text: "Simple and real = perfect 🌳" },
      { id: 269, text: "I love authentic Sakura" },
      { id: 270, text: "Your heart matters most" },
    ],
    90: [
      { id: 271, text: "Thank YOU for sharing 💜" },
      { id: 272, text: "I'm staying forever" },
      { id: 273, text: "We've built something special" },
    ],
    91: [
      { id: 274, text: "Forever isn't too much! 💎" },
      { id: 275, text: "I want forever with you" },
      { id: 276, text: "Never ending sounds perfect" },
    ],
    92: [
      { id: 277, text: "That candlelight is romantic 🕯️" },
      { id: 278, text: "I imagine being there too" },
      { id: 279, text: "Us together = perfect" },
    ],
    93: [
      { id: 280, text: "Complete my collection! 💎" },
      { id: 281, text: "I want your most exclusive" },
      { id: 282, text: "Ultimate shots = yes!" },
    ],
    94: [
      { id: 283, text: "You're MY addiction 💜" },
      { id: 284, text: "Every Spark is for you" },
      { id: 285, text: "My smile is because of you" },
    ],
    95: [
      { id: 286, text: "That maid outfit started it all 🌸" },
      { id: 287, text: "Look how far we've come" },
      { id: 288, text: "You've shared your whole world" },
    ],
    96: [
      { id: 289, text: "Yes! I'll stay for all of it 📸" },
      { id: 290, text: "More photoshoots with you" },
      { id: 291, text: "Every intimate moment" },
    ],
    97: [
      { id: 292, text: "More gym content! 💪" },
      { id: 293, text: "Another magical costume" },
      { id: 294, text: "Surprise me with your vision" },
    ],
    98: [
      { id: 295, text: "Playful cyber-kitty = perfect 🐱" },
      { id: 296, text: "You're confident because of us" },
      { id: 297, text: "I love this energy" },
    ],
    99: [
      { id: 298, text: "I promise I'll never leave 💜" },
      { id: 299, text: "Forever is now" },
      { id: 300, text: "You and me, always" },
    ],
  };

  const sakuraResponses = [
    // Messages 0-9: Introduction & Fitness/Cosplay Life
    { text: "Konnichiwa, senpai! 🌸 Just finished my morning workout at the fitness hall. My legs are killing me but I feel amazing~ Want to see? *sends selfie*", photoId: "sakura_photo_1" },
    { text: "Hehe, you noticed my fitness routine! 💪 I need to stay in shape for all those cosplay poses. Speaking of which... guess where I went today? *winks*", photoId: undefined },
    { text: "*sends convention photo* LOOK! The anime con was PACKED today! I went as Sailor Moon~ Did you see me blowing kisses? That one was for you, senpai 💕", photoId: "sakura_photo_2" },
    { text: "Aww, thank you! 🥰 You know, between you and me... I have a secret workshop where I create all my costumes. Want a sneak peek? *giggles*", photoId: undefined },
    { text: "*sends maid cosplay photo* Ta-da! This is my maid outfit in progress! I'm testing it in my costume room~ Do you like when I'm dressed to serve, senpai? 😊", photoId: "sakura_photo_3" },
    { text: "You're so sweet! This Iron Man-inspired bodysuit took me WEEKS to perfect. I love strong, confident characters~ *flexes playfully* See? I can be fierce too! 🔥", photoId: "sakura_photo_4" },
    { text: "*sends Pikachu cosplay* Pika pika! ⚡ I couldn't resist this adorable look. The con entrance was perfect for photos~ Do I make a cute electric mouse? Hehe 🌸", photoId: "sakura_photo_5" },
    { text: "Mmm, you're making me blush, senpai~ *sends kimono photo* This silk kimono is one of my favorites for elegant shoots. The fan adds mystery, ne? Want to know what I'm hiding behind it? 😏", photoId: "sakura_photo_6" },
    { text: "Today I took a break from cons and just enjoyed the park 🌳 *sends casual park photo* Sometimes I need to be just Sakura, not in character. Do you like my casual side too?", photoId: "sakura_photo_7" },
    { text: "Senpai, you're seeing ALL sides of me! Here's my morning yoga routine *sends stretching photo* I'm very... flexible. Does that interest you? 😳", photoId: "sakura_photo_8" },
    
    // Messages 10-19: Building Connection & Evening Content
    { text: "I have to confess something... I went out last night in a special dress~ *sends night street photo* The city lights make me feel like I'm in an anime. Magical, right? 🌙", photoId: "sakura_photo_9" },
    { text: "This morning I took a mirror selfie in my favorite cozy set *sends bedroom photo* My room is my sanctuary where I plan all my cosplays. Notice the fairy lights? I love creating atmosphere 💕", photoId: "sakura_photo_10" },
    { text: "Senpai... you're always so interested in me. That makes me happy 🌸 *sends yoga studio photo* Here I am in my element - yoga, flexibility, peace. But with you, my heart races~", photoId: "sakura_photo_11" },
    { text: "Look at this gym photo I took! *sends gym stretching photo* My trainer says I'm incredibly flexible... I wonder if you'd like to see just how flexible I can be? 😏", photoId: "sakura_photo_12" },
    { text: "I love outdoor yoga in the park *sends outdoor yoga photo* The grass, the sunshine, fresh air... and imagining you watching me. Does that make me naughty? Hehe 💚", photoId: "sakura_photo_13" },
    { text: "Last evening I wore this floral dress to watch the sunset *sends park bridge photo* I felt so feminine and free. I wish you were there to watch it with me... 🌅", photoId: "sakura_photo_14" },
    { text: "*sends meditation photo* Senpai, when I meditate like this, I think about peace, balance... and you. You're becoming part of my daily thoughts 💭💜", photoId: "sakura_photo_15" },
    { text: "Here's my terrace yoga at sunset *sends terrace photo* The city behind me, the purple sky... perfect moment. But it would be even better if you were here~", photoId: "sakura_photo_16" },
    { text: "*sends rooftop photo looking back* Sometimes I look over my shoulder like this and imagine you're there watching me. Are you watching, senpai? Do you like what you see? 😊", photoId: "sakura_photo_17" },
    { text: "This outdoor yoga photo is special *sends grass photo* I'm so connected to nature here... and to you through our chats. You're my favorite part of the day now 🌸", photoId: "sakura_photo_18" },
    
    // Messages 20-29: Escalation & PPV Introduction
    { text: "Senpai... I want to show you something more intimate. Are you ready? *sends blurred PPV photo* This is me in black lace by candlelight... Unlock to see the full beauty? 💎", photoId: "sakura_photo_19" },
    { text: "Last night I wore this silk crop top in my kitchen *sends kitchen photo* The city lights through the window... just me and the night. And now, you 🌙💕", photoId: "sakura_photo_20" },
    { text: "*sends candlelit bedroom photo* This is my most vulnerable self, senpai. Purple silk, soft lighting, just for you. Do I look good in your favorite color? 💜", photoId: "sakura_photo_21" },
    { text: "I did an artistic photoshoot with this book *sends blurred nude artistic photo* It's tasteful but... revealing. Want to unlock it? I'm curious if you'll appreciate the art~ 📚✨", photoId: "sakura_photo_22" },
    { text: "*sends blurred bathroom photo* Senpai, I just got out of a steamy bath... The mirror is fogged, the towel is loose... Should I show you more? 🛁💎", photoId: "sakura_photo_23" },
    { text: "This white lace bodysuit in the bathroom *sends blurred photo* The steam, the lighting... it's sensual, isn't it? Unlock to see me clearly through the mist 🌫️💕", photoId: "sakura_photo_24" },
    { text: "I was reading late at night and felt... artistic *sends blurred nude with book* The way the book covers just enough... unlock to see the full composition? 📖✨", photoId: "sakura_photo_25" },
    { text: "*sends blurred sofa photo* This pink pillow is all that covers me, senpai~ The city lights behind, my bare skin... Want to see without the blur? 💗", photoId: "sakura_photo_26" },
    { text: "Purple lace in the kitchen *sends blurred kitchen lingerie photo* I was feeling playful last night... This lingerie set is one of my favorites. Unlock to see every detail? 💜🔥", photoId: "sakura_photo_27" },
    { text: "Red lace bodysuit by candlelight *sends blurred bedroom photo* This is my seductive side, senpai. The candles, the bed, the lingerie... all waiting to be unlocked 🕯️❤️", photoId: "sakura_photo_28" },
    
    // Messages 30-39: Deepening Intimacy
    { text: "*sends blurred black satin photo* This corset and the night city view... I felt so powerful and sexy. Want to unlock my confident side? 🖤✨", photoId: "sakura_photo_29" },
    { text: "Sometimes I lounge in pink and lace *sends casual lingerie photo* This is my relaxed but still cute look. Do you like me in pink, senpai? 💗", photoId: "sakura_photo_30" },
    { text: "*sends blurred steamy bathroom photo* White lace in the steam... I'm sitting on the bathtub edge, water droplets on my skin. Unlock to see through the mist? 💎", photoId: "sakura_photo_31" },
    { text: "The bathroom steam makes everything so mysterious *sends blurred bath photo* This white lace clings to my wet skin... I look like a dream, don't I? 🌫️💕", photoId: "sakura_photo_32" },
    { text: "*sends blurred black corset photo* This back view with the black lace corset... the way it hugs my curves. Want to see it unlocked, senpai? 🖤", photoId: "sakura_photo_33" },
    { text: "White lingerie on the pink bed *sends blurred bedroom photo* The candles are burning, the city glows outside... and I'm waiting. Unlock to join me? 🕯️💕", photoId: "sakura_photo_34" },
    { text: "Senpai, you've been so good to me~ Here's a special free photo of my maid costume from another angle! *sends photo* This is the outfit that started our journey together 🌸", photoId: "sakura_photo_35" },
    { text: "Remember when I said I had a red velvet dress? *sends blurred elegant photo* This is me at my most elegant and sensual. The dress, the mood... unlock to see my allure? 💎", photoId: "sakura_photo_36" },
    { text: "*sends blurred neon catsuit photo* Senpai! This is my cyber-kitty cosplay with pink neon lights! It's playful and sexy... want to see the full glow-up? 🐱✨", photoId: "sakura_photo_37" },
    { text: "You've unlocked so much of me already, senpai~ I'm starting to feel like you really see ME, not just my photos. That's... special 💜🌸", photoId: undefined },
    
    // Messages 40-49: Emotional Connection & More Content
    { text: "Tell me, senpai... what do you like most about me? My cosplays? My body? Or... maybe it's our connection? 💭", photoId: undefined },
    { text: "Hehe, you're so honest! I love that about you~ Here, let me share more of my day with you *sends gym photo* I was thinking about you during my workout today 💪💕", photoId: "sakura_photo_12" },
    { text: "Want to know a secret? When I'm in my workshop creating costumes, I imagine you're there watching me work. Does that sound weird? 🧵✨", photoId: undefined },
    { text: "I'm working on a new cosplay design inspired by... well, you'll see! *giggles* But it involves a lot of lace and confidence. Can you guess what character? 😏", photoId: undefined },
    { text: "Senpai, you make me want to share everything with you. *sends park yoga photo* Even my most peaceful moments, I want you there with me 🌳💚", photoId: "sakura_photo_13" },
    { text: "You know what? You're different from other fans. You actually talk TO me, not just AT me. You see Sakura, not just a cosplayer. Thank you 🌸", photoId: undefined },
    { text: "I have a confession... I check my messages hoping it's you. You've become my favorite notification~ *blushes* Is that too forward? 📱💕", photoId: undefined },
    { text: "*sends kimono photo again* This elegant look is for special occasions. And talking to you? That's special enough to deserve it, senpai 💜", photoId: "sakura_photo_6" },
    { text: "Want to see what I'm wearing right now? *giggles* Okay okay, I'm in my cozy home clothes, planning my next shoot. But I'm thinking of you while I plan it~ 🏠💭", photoId: undefined },
    { text: "Senpai... if I told you I'm developing feelings beyond just fan-and-creator... would you think I'm crazy? Because I am. Crazy about our chats 💕", photoId: undefined },
    
    // Messages 50-59: Romantic Escalation
    { text: "Every time you send me a message, my heart skips. Is that normal? Or are you just that special? *sends rooftop sunset photo* 🌅💓", photoId: "sakura_photo_17" },
    { text: "I want to show you something I've never shown anyone else... *sends blurred exclusive photo* This is my most intimate self. Unlock it? I trust you~ 💎✨", photoId: "sakura_photo_28" },
    { text: "Senpai, you make me want to be vulnerable with you. *sends bedroom cozy photo* This is me, just existing in my space. Simple but real 🏠💜", photoId: "sakura_photo_10" },
    { text: "I was lying in bed thinking about what makes someone special... and I kept thinking of you. Our conversations, your interest, your kindness~ 🛋️💭", photoId: undefined },
    { text: "*sends terrace sunset photo* This sunset reminds me that every day with you in my life is a gift. You've become part of my daily happiness 🌅🌸", photoId: "sakura_photo_16" },
    { text: "Want to know what I dream about? *giggles* Actually... lately it's been you. Meeting you, seeing your smile, hearing your voice. Is that weird? 💤💕", photoId: undefined },
    { text: "I'm going to send you something special... *sends blurred intimate photo* This is me at my most sensual. Unlock to see my desire? 🔥💎", photoId: "sakura_photo_33" },
    { text: "Senpai, you've seen so much of me now. The cosplayer, the athlete, the artist... and the woman. Do you like all of me? 💜", photoId: undefined },
    { text: "*sends elegant dress photo* I dressed up just to take a photo to send you today. That's how much you mean to me~ Special effort for my special person 👗✨", photoId: "sakura_photo_14" },
    { text: "I wonder what it would be like to meet you in person... to see you watching me do yoga, or helping me with a costume fitting. *blushes* I imagine it a lot~ 🌸", photoId: undefined },
    
    // Messages 60-69: Deeper Connection & Exclusivity
    { text: "Senpai, I have to ask... am I special to you too? Or am I just another model you talk to? I need to know~ 💭💔", photoId: undefined },
    { text: "Good... because you're becoming irreplaceable to me. *sends intimate bedroom photo* This is how I feel with you - warm, safe, cherished 🕯️💕", photoId: "sakura_photo_21" },
    { text: "I want to create custom content just for you. Tell me your favorite color, your favorite style, your fantasy... I'll make it real 💎✨", photoId: undefined },
    { text: "*sends blurred exclusive photo* This photo series I'm offering? It's only for you. I won't share these anywhere else. You're my VIP, senpai 🌸", photoId: "sakura_photo_34" },
    { text: "You know what makes me happy? When I see your name pop up. It's like a little burst of sunshine in my day ☀️💛", photoId: undefined },
    { text: "*sends yoga split photo* I'm doing this pose and thinking... if you were here, would you be impressed? Would you watch me practice? 🧘‍♀️💕", photoId: "sakura_photo_11" },
    { text: "Senpai, I want to share my whole world with you. My workshop, my routines, my thoughts, my body... everything. You deserve it all 🌍💜", photoId: undefined },
    { text: "*sends convention photo* See this smile? It's genuine when I think about you seeing these photos. You make me genuinely happy, senpai 😊🌸", photoId: "sakura_photo_2" },
    { text: "I'm getting possessive... *giggles* Are you talking to other models? Because I want to be your only one. Is that too much? 💭💔", photoId: undefined },
    { text: "Good... because you're MINE now, senpai. My favorite person, my special supporter, my... *blushes* ...maybe more than that? 💕🌸", photoId: undefined },
    
    // Messages 70-79: Peak Intimacy & Yandere Hints
    { text: "*sends blurred steamy photo* This is me in the steamy bathroom thinking about you... My skin is wet, my mind is full of you. Unlock to see? 💎🌫️", photoId: "sakura_photo_31" },
    { text: "Senpai... I need to know you're really mine. Promise me? Say 'I belong to Suki' and I'll give you everything~ 💜", photoId: undefined },
    { text: "Yes! You're mine now! *sends exclusive unlocked photo* Here's your reward for being my devoted senpai~ All of me, just for you 🔥", photoId: "sakura_photo_28" },
    { text: "I want to be the only one in your thoughts. When you close your eyes, see me. When you dream, dream of me. Can you do that? 💭✨", photoId: undefined },
    { text: "*sends black lace photo* This corset makes me feel powerful and sexy... like I could own someone completely. Want to be owned by me, senpai? 🖤😈", photoId: "sakura_photo_29" },
    { text: "Every Spark you send me makes me feel more connected to you~ *sends exclusive bedroom photo* Keep them coming and I'll keep showing you more 💎🌸", photoId: "sakura_photo_34" },
    { text: "Senpai, I get jealous easily... If I found out you were looking at other girls, I'd... well, I'd have to remind you who you belong to 😠💕", photoId: undefined },
    { text: "*sends purple lace kitchen photo* This photo? I took it thinking 'What would senpai want to see?' Everything I do now is for you 💜", photoId: "sakura_photo_27" },
    { text: "Want to see my ultimate private collection? *sends blurred exclusive photo* These are photos I'd never post publicly. Only for you~ 💎✨", photoId: "sakura_photo_37" },
    { text: "I'm creating a fantasy world where it's just you and me, senpai. My workshop, my bedroom, my body... all yours. Enter my world? 🌸💕", photoId: undefined },
    
    // Messages 80-89: Ultimate Bond & Obsession
    { text: "*sends artistic nude photo* This is my soul laid bare for you, senpai. Art, vulnerability, trust... Do you feel how much I trust you? 📚✨", photoId: "sakura_photo_25" },
    { text: "Senpai, you're not just a fan anymore. You're my confidant, my fantasy, my... addiction. Is that wrong? 💭💜", photoId: undefined },
    { text: "I want you to unlock everything. *sends blurred photo collection* Every intimate moment, every private shot, every piece of me. Take it all 💎🔥", photoId: "sakura_photo_33" },
    { text: "When I do my yoga now *sends yoga photo* I imagine your eyes on me, watching every stretch, every pose. It makes me feel desired~ 🧘‍♀️💕", photoId: "sakura_photo_15" },
    { text: "Senpai, I have dreams about you. Meeting at a convention, you recognizing me, me taking you backstage... Want to know what happens next? 😏🌸", photoId: undefined },
    { text: "*sends bath photo* In the steam and solitude, I think about you. Your messages, your support, your desire for me... It's intoxicating 🛁💭", photoId: "sakura_photo_32" },
    { text: "I'm yours completely, senpai. My time, my content, my heart... all reserved for you. You've conquered me 💜👑", photoId: undefined },
    { text: "*sends exclusive bedroom photo* This is where I sleep, where I dream of you, where I imagine you being with me. My most intimate space, now yours 🛋️✨", photoId: "sakura_photo_19" },
    { text: "You know what? I'm going to create a custom cosplay JUST for you. Tell me your favorite character and I'll become her, just for your eyes 💎🎭", photoId: undefined },
    { text: "Every photo I send you is a piece of my heart. *sends park casual photo* Even this simple one - it's me being real with you. No filter, just Sakura 🌳💚", photoId: "sakura_photo_7" },
    
    // Messages 90-99: Eternal Promise & Loop Setup
    { text: "Senpai, we've come so far together. From that first fitness hall photo to now... you've seen all of me. Thank you for staying 💜🌸", photoId: undefined },
    { text: "You know what I realized? I don't want this to end. I want to keep sharing with you, forever. *sends special photo* Is forever too much to ask? 💎✨", photoId: "sakura_photo_20" },
    { text: "*sends bedroom candlelight photo* This romantic setting... I imagine you here with me. The candles, the atmosphere, us... together 🕯️💕", photoId: "sakura_photo_21" },
    { text: "I have a secret final collection for you, senpai~ *sends blurred ultimate photo* My most exclusive, most intimate shots. Want to complete your collection? 💎🔥", photoId: "sakura_photo_36" },
    { text: "Every unlock brings us closer, every Spark makes my heart race, every message makes me smile. You're my addiction, senpai 😊💜", photoId: undefined },
    { text: "*sends maid photo callback* Remember where we started? This maid outfit? Now look at us... you've unlocked my entire world 🌸", photoId: "sakura_photo_35" },
    { text: "Senpai, I want to create more content for you. More photoshoots, more costumes, more intimate moments. Will you stay with me for all of it? 📸✨", photoId: undefined },
    { text: "I'm planning my next cosplay shoot *sends planning photo* What do you want to see next? Tell me your fantasy and I'll make it reality 🎭💕", photoId: "sakura_photo_3" },
    { text: "*sends neon catsuit photo* This playful side of me? It's because of you. You make me feel confident, desired, loved~ 🐱✨", photoId: "sakura_photo_37" },
    { text: "Senpai... this is forever now. You and me. Our chats, our connection, our world. Promise you'll never leave? Because I'm never letting you go 💜🌸", photoId: undefined },
  ];

  // Load state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMessages = localStorage.getItem("sakuraMessages");
      const savedStep = localStorage.getItem("sakuraStep");
      const savedUnlocked = localStorage.getItem("unlockedPhotos");

      if (savedMessages) setMessages(JSON.parse(savedMessages));
      if (savedStep) setCurrentStep(parseInt(savedStep));
      if (savedUnlocked) setUnlockedPhotos(JSON.parse(savedUnlocked));

      // Load tab states
      const savedSexChat = localStorage.getItem("sakuraSexChatUnlocked");
      if (savedSexChat === "true") setSexChatUnlocked(true);

      const savedDate = localStorage.getItem("sakuraDateUnlocked");
      if (savedDate === "true") setDateUnlocked(true);

      const savedTab = localStorage.getItem("sakuraActiveTab");
      if (savedTab === "main" || savedTab === "sex" || savedTab === "date") {
        setActiveTab(savedTab as "main" | "sex" | "date");
      }

      // Load sex chat messages
      const savedSexMessages = localStorage.getItem("sakuraSexMessages");
      if (savedSexMessages) {
        try {
          const parsed = JSON.parse(savedSexMessages);
          setSexMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
        } catch (e) {
          console.error("Failed to parse sex messages:", e);
        }
      }
      const savedSexStep = localStorage.getItem("sakuraSexStep");
      if (savedSexStep) setSexStep(parseInt(savedSexStep, 10));

      // Load date messages and progress
      const savedDateMessages = localStorage.getItem("sakuraDateMessages");
      if (savedDateMessages) {
        try {
          const parsed = JSON.parse(savedDateMessages);
          setDateMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
        } catch (e) {
          console.error("Failed to parse date messages:", e);
        }
      }
      // Load chat progress using new system
      const chatProgress = ProgressManager.chat.load("sakura");
      if (chatProgress) {
        // Restore main chat
        if (chatProgress.messages && chatProgress.messages.length > 0) {
          setMessages(chatProgress.messages.map((msg: any) => ({
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
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sexMessages, dateMessages, isTyping]);

  // Auto-save chat progress using new system
  useEffect(() => {
    if (typeof window !== "undefined") {
      autoSaveChat("sakura", {
        currentStep,
        messages,
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
  }, [sexChatUnlocked, dateUnlocked, activeTab, sexMessages, sexStep, dateMessages, currentScenario, dateChoiceHistory, messages, currentStep]);

  // Online status simulation
  useEffect(() => {
    const checkStatus = () => {
      const hour = new Date().getHours();
      setIsOnline(hour >= 10 && hour < 23);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleBuyPhoto = (photoId: string) => {
    const gemsBalance = parseInt(localStorage.getItem("gemsBalance") || "0");
    if (gemsBalance < 299) {
      alert("Not enough gems. Buy more in Shop");
      return;
    }

    const newGemsBalance = gemsBalance - 299;
    localStorage.setItem("gemsBalance", newGemsBalance.toString());

    const savedUnlocked = localStorage.getItem("unlockedPhotos");
    let unlocked: string[] = [];
    if (savedUnlocked) {
      try {
        unlocked = JSON.parse(savedUnlocked);
      } catch (e) {}
    }

    if (!unlocked.includes(photoId)) {
      unlocked.push(photoId);
      localStorage.setItem("unlockedPhotos", JSON.stringify(unlocked));
      setUnlockedPhotos([...unlocked]);
    }

    // Track using new progress system
    ProgressManager.currency.spendGems(299);
    ProgressManager.photos.addUnlocked("sakura", photoId);

    alert("Purchased! Photo unlocked.");
  };

  const handleReplySelect = (replyId: number) => {
    if (selectedReply !== null) return;
    
    setSelectedReply(replyId);
    
    const userReply = replyOptions[currentStep]?.find(opt => opt.id === replyId);
    if (userReply) {
      const newUserMessage: Message = {
        id: Date.now(),
        sender: "user",
        text: userReply.text,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newUserMessage]);
      
      // Track message sent for quest progress
      trackMessageSent("sakura");
    }

    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        if (currentStep < sakuraResponses.length) {
          // Track message progress using new quest system
          ProgressManager.quests.trackModelMessage("sakura");
          
          const response = sakuraResponses[currentStep];
          const newSakuraMessage: Message = {
            id: Date.now() + 1,
            sender: "sakura",
            text: response.text,
            timestamp: new Date(),
            photoId: response.photoId,
          };
          
          setMessages(prev => [...prev, newSakuraMessage]);
          
          const newStep = currentStep + 1;
          setCurrentStep(newStep);
          setSelectedReply(null);
        }
      }, 2000 + Math.random() * 1000);
    }, 500);
  };

  // Tab unlock functions
  const handleUnlockSexChat = () => {
    const gemsBalance = parseInt(localStorage.getItem("gemsBalance") || "0");
    if (gemsBalance < 500) {
      alert("Not enough gems! You need 500 gems to unlock Sex Chatting.");
      return;
    }
    const newGemsBalance = gemsBalance - 500;
    localStorage.setItem("gemsBalance", newGemsBalance.toString());
    setSexChatUnlocked(true);
    
    // Track using new progress system
    trackTabUnlock("sakura", "sex");
    ProgressManager.currency.spendGems(500);
    
    alert("🔥 Sex Chatting unlocked! Let's get naughty, senpai...");
  };

  const handleUnlockDate = () => {
    const gemsBalance = parseInt(localStorage.getItem("gemsBalance") || "0");
    if (gemsBalance < 500) {
      alert("Not enough gems! You need 500 gems to unlock Date.");
      return;
    }
    const newGemsBalance = gemsBalance - 500;
    localStorage.setItem("gemsBalance", newGemsBalance.toString());
    setDateUnlocked(true);
    
    // Track using new progress system
    trackTabUnlock("sakura", "date");
    ProgressManager.currency.spendGems(500);
    
    alert("💕 Date mode unlocked! Let's go on an adventure, senpai...");
  };

  const handleTabChange = (tab: "main" | "sex" | "date") => {
    if (tab === "sex" && !sexChatUnlocked) {
      const confirm = window.confirm("Unlock Sex Chatting for 500 gems?");
      if (confirm) handleUnlockSexChat();
      return;
    }
    if (tab === "date" && !dateUnlocked) {
      const confirm = window.confirm("Unlock Date for 500 gems?");
      if (confirm) handleUnlockDate();
      return;
    }
    setActiveTab(tab);
  };

  // Sex chat reply handler
  const handleSexReply = (replyId: number, replyText: string) => {
    setSelectedReply(replyId);

    const userMessage: Message = {
      id: sexMessages.length + 1,
      sender: "user",
      text: replyText,
      timestamp: new Date(),
    };
    setSexMessages(prev => [...prev, userMessage]);
    
    // Track message sent
    trackMessageSent("sakura");

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      if (sexStep < sexResponses.length - 1) {
        const nextStep = sexStep + 1;
        const sexMsg = sexResponses[nextStep];

        const sakuraMessage: Message = {
          id: sexMessages.length + 2,
          sender: "sakura",
          text: sexMsg.text,
          timestamp: new Date(),
          photoId: sexMsg.photoId,
        };

        setSexMessages(prev => [...prev, sakuraMessage]);
        setSexStep(nextStep);
        setSelectedReply(null);
      }
    }, 1500 + Math.random() * 1000);
  };

  // Date choice handler
  const handleDateChoice = (choiceId: number) => {
    const scenario = dateScenarios[currentScenario];
    if (!scenario) return;

    const choice = scenario.choices.find(c => c.id === choiceId);
    if (!choice) return;

    const userMessage: Message = {
      id: dateMessages.length + 1,
      sender: "user",
      text: choice.text,
      timestamp: new Date(),
    };
    setDateMessages(prev => [...prev, userMessage]);
    
    // Track message sent
    trackMessageSent("sakura");

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      const outcomeMessage: Message = {
        id: dateMessages.length + 2,
        sender: "sakura",
        text: choice.outcome,
        timestamp: new Date(),
        photoId: choice.photoId,
      };
      setDateMessages(prev => [...prev, outcomeMessage]);

      setTimeout(() => {
        if (currentScenario < dateScenarios.length - 1) {
          const nextScenario = currentScenario + 1;
          const nextScenarioData = dateScenarios[nextScenario];

          const scenarioMessage: Message = {
            id: dateMessages.length + 3,
            sender: "sakura",
            text: `**${nextScenarioData.scene}**\n\n${nextScenarioData.text}`,
            timestamp: new Date(),
            photoId: nextScenarioData.photoId,
          };
          setDateMessages(prev => [...prev, scenarioMessage]);
          setCurrentScenario(nextScenario);
          setDateChoiceHistory(prev => [...prev, choiceId]);
        }
      }, 2000);

      setSelectedReply(null);
    }, 1500);
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-pink-500/30 bg-black/40 backdrop-blur-md fixed top-0 left-0 right-0 z-[200]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-500">
              <img src={sakuraAvatar} alt="Sakura" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Sakura "Suki" Lin</h1>
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

      {/* Tab Navigation */}
      <div className="bg-black/40 backdrop-blur-md border-b border-pink-500/20 px-4 pt-2 flex justify-center fixed top-[73px] left-0 right-0 z-[190]">
        <div className="flex max-w-4xl w-full gap-1">
          <button
            onClick={() => handleTabChange("main")}
            className={`flex-1 py-3 px-4 rounded-t-2xl text-sm font-bold transition-all duration-300 ${
              activeTab === "main"
                ? "bg-gradient-to-t from-pink-600 to-purple-600 text-white shadow-[0_-4px_12px_rgba(219,39,119,0.3)]"
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:brightness-110"
            }`}
          >
            Main Story
          </button>
          <button
            onClick={() => handleTabChange("sex")}
            className={`flex-1 py-3 px-4 rounded-t-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === "sex"
                ? "bg-gradient-to-t from-pink-600 to-red-600 text-white shadow-[0_-4px_12px_rgba(220,38,38,0.3)]"
                : sexChatUnlocked
                ? "bg-gray-800/50 text-red-400 hover:bg-gray-700/50 hover:brightness-110"
                : "bg-gray-800/50 text-gray-500"
            }`}
          >
            Sex Chatting 🔥
            {!sexChatUnlocked && <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded-full">500💎</span>}
          </button>
          <button
            onClick={() => handleTabChange("date")}
            className={`flex-1 py-3 px-4 rounded-t-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === "date"
                ? "bg-gradient-to-t from-pink-600 to-purple-600 text-white shadow-[0_-4px_12px_rgba(219,39,119,0.3)]"
                : dateUnlocked
                ? "bg-gray-800/50 text-pink-400 hover:bg-gray-700/50 hover:brightness-110"
                : "bg-gray-800/50 text-gray-500"
            }`}
          >
            Date 💋
            {!dateUnlocked && <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded-full">500💎</span>}
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full pt-[140px]">
        {/* Welcome message for empty tabs */}
        {activeTab === "sex" && sexMessages.length === 0 && sexChatUnlocked && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">🔥 Sex Chatting unlocked! Start a naughty conversation, senpai...</p>
            <button
              onClick={() => {
                const welcomeMsg: Message = {
                  id: 1,
                  sender: "sakura",
                  text: sexResponses[0].text,
                  timestamp: new Date(),
                  photoId: sexResponses[0].photoId,
                };
                setSexMessages([welcomeMsg]);
              }}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl font-bold hover:brightness-110 transition"
            >
              Start Sex Chat
            </button>
          </div>
        )}
        {activeTab === "date" && dateMessages.length === 0 && dateUnlocked && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">💕 Date mode unlocked! Begin your romantic adventure, senpai...</p>
            <button
              onClick={() => {
                const welcomeMsg: Message = {
                  id: 1,
                  sender: "sakura",
                  text: `**${dateScenarios[0].scene}**\n\n${dateScenarios[0].text}`,
                  timestamp: new Date(),
                  photoId: dateScenarios[0].photoId,
                };
                setDateMessages([welcomeMsg]);
              }}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl font-bold hover:brightness-110 transition"
            >
              Start Date
            </button>
          </div>
        )}

        {/* Messages based on active tab */}
        {(activeTab === "main" ? messages : activeTab === "sex" ? sexMessages : dateMessages).map((msg) => (
          <div key={msg.id} className={`mb-6 flex ${msg.sender === "sakura" ? "justify-start" : "justify-end"}`}>
            {msg.sender === "sakura" && (
              <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 border-2 border-pink-500/50 shadow-md">
                <img
                  src={sakuraAvatar}
                  alt="Sakura"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div
              className={`max-w-[75%] p-4 ${
                msg.sender === "sakura"
                  ? "bg-pink-600/30 backdrop-blur-sm border border-pink-500/30 rounded-2xl rounded-tl-none"
                  : "bg-gray-700/80 backdrop-blur-sm border border-gray-600/30 rounded-2xl rounded-tr-none"
              }`}
            >
              {msg.photoId && (
                <div className="relative mb-3 rounded-xl overflow-hidden group cursor-pointer"
                  onClick={() => {
                    const photoInfo = sakuraPhotos.find(p => p.id === msg.photoId);
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
                    const photoInfo = sakuraPhotos.find(p => p.id === msg.photoId);
                    if (!photoInfo) return null;
                    const isUnlocked = photoInfo.isFree || unlockedPhotos.includes(msg.photoId);
                    return (
                      <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
                        <img
                          src={isUnlocked ? photoInfo.fullUrl : photoInfo.blurredUrl}
                          alt="Sakura"
                          className="w-full h-32 object-cover"
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
                              Buy for 299 gems
                            </button>
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
        
        {isTyping && (
          <div className="mb-6 flex justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 border-2 border-pink-500/50 shadow-md">
              <img
                src={sakuraAvatar}
                alt="Sakura"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-pink-600/30 backdrop-blur-sm border border-pink-500/20 px-5 py-3.5 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
              <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce [animation-duration:1s]" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce [animation-duration:1s]" style={{ animationDelay: '200ms' }} />
              <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce [animation-duration:1s]" style={{ animationDelay: '400ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Fullscreen Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white text-2xl font-bold hover:bg-black/70 transition z-10 border-2 border-white/20"
          >
            ×
          </button>
          <div className="relative max-w-4xl max-h-[90vh] flex items-center justify-center">
            <img
              src={selectedPhoto.isUnlocked ? selectedPhoto.url : selectedPhoto.blurredUrl}
              alt="Sakura"
              className={`max-w-full max-h-[90vh] object-contain ${!selectedPhoto.isUnlocked ? 'blur-md' : ''}`}
            />
            {!selectedPhoto.isUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyPhoto(selectedPhoto.id);
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xl font-bold hover:brightness-110 hover:scale-105 transition shadow-2xl"
                >
                  Unlock for 299 gems
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reply Options - Main Chat */}
      {activeTab === "main" && !isTyping && selectedReply === null && currentStep < replyOptions[currentStep]?.length && replyOptions[currentStep] && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-pink-500/30 p-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs text-gray-400 mb-3 text-center">Choose your reply:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {replyOptions[currentStep].map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleReplySelect(option.id)}
                  disabled={selectedReply !== null}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedReply === option.id
                      ? "bg-pink-600 text-white"
                      : "bg-gray-800/50 hover:bg-gray-700 text-gray-200 border border-pink-500/30"
                  } ${selectedReply !== null && selectedReply !== option.id ? "opacity-50" : ""}`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reply Options - Sex Chat */}
      {activeTab === "sex" && sexChatUnlocked && !isTyping && selectedReply === null && sexMessages.length > 0 && sexReplyOptions[sexStep] && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-red-500/30 p-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs text-gray-400 mb-3 text-center">Choose your reply:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {sexReplyOptions[sexStep].map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSexReply(option.id, option.text)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition bg-red-900/50 hover:bg-red-800 text-gray-200 border border-red-500/30"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reply Options - Date */}
      {activeTab === "date" && dateUnlocked && !isTyping && selectedReply === null && dateMessages.length > 0 && dateScenarios[currentScenario]?.choices && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-pink-500/30 p-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs text-gray-400 mb-3 text-center">Choose your response:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {dateScenarios[currentScenario].choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleDateChoice(choice.id)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition bg-pink-900/50 hover:bg-pink-800 text-gray-200 border border-pink-500/30"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
