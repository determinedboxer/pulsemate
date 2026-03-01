// app/chat/riley/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useChatProgress, trackMessageSent, trackTabUnlock, autoSaveChat } from "@/lib/progress/chatProgress";
import { ProgressManager } from "@/lib/progress";

interface Message {
  id: number;
  sender: "riley" | "user";
  text: string;
  timestamp: Date;
  photoId?: string;
  options?: ReplyOption[];
}

interface ReplyOption {
  id: number;
  text: string;
}

const rileyAvatar = "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503243/Riley1_lvyoep.png";

// Riley's photos (39 total: 18 free + 21 PPV)
const rileyPhotos = [
  // Free photos (1-18)
  { id: "photo_riley_1", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503243/Riley1_lvyoep.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503243/Riley1_lvyoep.png", isFree: true, price: 0 },
  { id: "photo_riley_2", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502939/Riley2_str4wz.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502939/Riley2_str4wz.jpg", isFree: true, price: 0 },
  { id: "photo_riley_3", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502952/Riley3_f5o1vw.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502952/Riley3_f5o1vw.png", isFree: true, price: 0 },
  { id: "photo_riley_4", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502941/Riley4_kyi87n.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502941/Riley4_kyi87n.jpg", isFree: true, price: 0 },
  { id: "photo_riley_5", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502956/Riley5_krdzji.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502956/Riley5_krdzji.png", isFree: true, price: 0 },
  { id: "photo_riley_6", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502953/Riley6_oxogfn.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502953/Riley6_oxogfn.png", isFree: true, price: 0 },
  { id: "photo_riley_7", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502943/Riley7_tqmyjw.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502943/Riley7_tqmyjw.jpg", isFree: true, price: 0 },
  { id: "photo_riley_8", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502990/Riley8_pqfr7c.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502990/Riley8_pqfr7c.png", isFree: true, price: 0 },
  { id: "photo_riley_9", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502981/Riley9_z0zewg.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502981/Riley9_z0zewg.png", isFree: true, price: 0 },
  { id: "photo_riley_10", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502966/Riley10_wxfbby.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502966/Riley10_wxfbby.jpg", isFree: true, price: 0 },
  { id: "photo_riley_11", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502977/Riley11_tovjol.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502977/Riley11_tovjol.jpg", isFree: true, price: 0 },
  { id: "photo_riley_12", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503042/Riley12_d55y3u.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503042/Riley12_d55y3u.png", isFree: true, price: 0 },
  { id: "photo_riley_13", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503017/Riley13_ucmqlj.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503017/Riley13_ucmqlj.png", isFree: true, price: 0 },
  { id: "photo_riley_14", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503020/Riley14_rtqdeo.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503020/Riley14_rtqdeo.png", isFree: true, price: 0 },
  { id: "photo_riley_15", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503006/Riley15_h3cubm.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503006/Riley15_h3cubm.jpg", isFree: true, price: 0 },
  { id: "photo_riley_16", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503018/Riley16_d6rgs9.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503018/Riley16_d6rgs9.jpg", isFree: true, price: 0 },
  { id: "photo_riley_17", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503021/Riley17_awtcok.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503021/Riley17_awtcok.jpg", isFree: true, price: 0 },
  { id: "photo_riley_18", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503098/Riley18_mkrnx1.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503098/Riley18_mkrnx1.png", isFree: true, price: 0 },
  
  // PPV photos (19-39)
  { id: "photo_riley_19", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503095/Riley19_z8twbd.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771503095/Riley19_z8twbd.png", isFree: false, price: 299 },
  { id: "photo_riley_20", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503082/Riley20_jligyw.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771503082/Riley20_jligyw.png", isFree: false, price: 299 },
  { id: "photo_riley_21", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503098/Riley21_but9bv.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771503098/Riley21_but9bv.png", isFree: false, price: 299 },
  { id: "photo_riley_22", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503073/Riley22_gkgyhd.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771503073/Riley22_gkgyhd.png", isFree: false, price: 399 },
  { id: "photo_riley_23", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503108/Riley23_n9q87z.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771503108/Riley23_n9q87z.png", isFree: false, price: 399 },
  { id: "photo_riley_24", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503146/Riley24_f1furw.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771503146/Riley24_f1furw.png", isFree: false, price: 399 },
  { id: "photo_riley_25", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503136/Riley25_ilpuaa.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771503136/Riley25_ilpuaa.png", isFree: false, price: 499 },
  { id: "photo_riley_26", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503161/Riley26_ww1iie.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771503161/Riley26_ww1iie.png", isFree: false, price: 499 },
  { id: "photo_riley_27", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503152/Riley27_hkm7jk.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771503152/Riley27_hkm7jk.png", isFree: false, price: 499 },
  { id: "photo_riley_28", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503142/Riley28_bjftf5.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771503142/Riley28_bjftf5.png", isFree: false, price: 599 },
  { id: "photo_riley_29", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503159/Riley29_ot9ri5.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771503159/Riley29_ot9ri5.png", isFree: false, price: 599 },
  { id: "photo_riley_30", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503173/Riley30_sdk05x.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771503173/Riley30_sdk05x.png", isFree: false, price: 599 },
  { id: "photo_riley_31", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503154/Riley31_lmlrcu.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771503154/Riley31_lmlrcu.jpg", isFree: false, price: 699 },
  { id: "photo_riley_32", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503163/Riley32_yxkqnf.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771503163/Riley32_yxkqnf.jpg", isFree: false, price: 699 },
  { id: "photo_riley_33", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503168/Riley33_gxwq6v.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771503168/Riley33_gxwq6v.jpg", isFree: false, price: 699 },
  { id: "photo_riley_34", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771682859/hf_20260221_135522_12aed852-1dc0-4d40-982a-1476f77ba473_cfenvh.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771682859/hf_20260221_135522_12aed852-1dc0-4d40-982a-1476f77ba473_cfenvh.jpg", isFree: false, price: 699 },
  { id: "photo_riley_35", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771928449/hf_20260221_155908_93e90f1b-9ee9-48bf-941e-c6e27bca1ddc_t1eew1.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771928449/hf_20260221_155908_93e90f1b-9ee9-48bf-941e-c6e27bca1ddc_t1eew1.jpg", isFree: false, price: 699 },
  { id: "photo_riley_36", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771928477/hf_20260221_153102_a40852c9-70b7-4376-bb60-16cf5dbf33b6_ipqi4e.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771928477/hf_20260221_153102_a40852c9-70b7-4376-bb60-16cf5dbf33b6_ipqi4e.jpg", isFree: false, price: 699 },
  { id: "photo_riley_37", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771928484/hf_20260221_152620_3790c15f-1bf2-4f8f-810a-dfce96cfaffb_f2sdgv.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771928484/hf_20260221_152620_3790c15f-1bf2-4f8f-810a-dfce96cfaffb_f2sdgv.png", isFree: false, price: 799 },
  { id: "photo_riley_38", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771928488/hf_20260221_152413_395a61b6-3d8b-43a2-951a-944b15b178a4_hqjvic.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771928488/hf_20260221_152413_395a61b6-3d8b-43a2-951a-944b15b178a4_hqjvic.jpg", isFree: false, price: 899 },
  { id: "photo_riley_39", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771928493/hf_20260221_152305_8d50c8fc-e6ee-41ff-8aa9-3556895fdf6a_zvh3ml.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771928493/hf_20260221_152305_8d50c8fc-e6ee-41ff-8aa9-3556895fdf6a_zvh3ml.jpg", isFree: false, price: 899 },
];

export default function RileyChatPage() {
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
      sender: "riley",
      text: "Yo, noob… caught you lurking in my chat again? 😏\nJust finished a ranked game — wanna see what happens when I win?\nOr are you too scared to duo with me?",
      timestamp: new Date(),
      photoId: "photo_riley_1",
      options: [
        { id: 1, text: "Hell yeah, duo time" },
        { id: 2, text: "You were popping off… tell me more" },
        { id: 3, text: "I want the private stream" },
        { id: 4, text: "Skip the talk, show me something hot" },
      ],
    },
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedReply, setSelectedReply] = useState<number | null>(null);
  const [gemsBalance, setGemsBalance] = useState(0);
  const [unlockedPhotos, setUnlockedPhotos] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
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

  // Reply options for sex chat (separated from messages)
  const sexReplyOptions: Record<number, ReplyOption[]> = {
    0: [
      { id: 1001, text: "Show me everything, Ry" },
      { id: 1002, text: "I've been waiting for this" },
      { id: 1003, text: "Make my fantasy real" },
    ],
    1: [
      { id: 1004, text: "Slow and sensual" },
      { id: 1005, text: "Take full control" },
      { id: 1006, text: "I want to dominate you" },
    ],
    2: [
      { id: 1007, text: "Buy for 599 gems" },
      { id: 1008, text: "Keep teasing me, Ry" },
      { id: 1009, text: "Tell me more first~" },
    ],
    3: [
      { id: 1010, text: "Send Spark" },
      { id: 1011, text: "Show me the real Ry" },
      { id: 1012, text: "I can handle anything" },
    ],
    4: [
      { id: 1013, text: "You're so hot" },
      { id: 1014, text: "I'll give you everything" },
      { id: 1015, text: "What's next, Ry?" },
    ],
    5: [
      { id: 1016, text: "Tell me what you're imagining" },
      { id: 1017, text: "Show me, please" },
      { id: 1018, text: "Let me guess" },
    ],
    6: [
      { id: 1019, text: "Strip while gaming" },
      { id: 1020, text: "Dance for me, Ry" },
      { id: 1021, text: "Show me your setup" },
    ],
    7: [
      { id: 1022, text: "Send Spark" },
      { id: 1023, text: "Your voice is perfect" },
      { id: 1024, text: "Keep talking to me" },
    ],
    8: [
      { id: 1025, text: "I belong to Ry" },
      { id: 1026, text: "You own me completely" },
      { id: 1027, text: "Only you, my queen" },
    ],
    9: [
      { id: 1028, text: "Buy for 699 gems" },
      { id: 1029, text: "What's the secret?" },
      { id: 1030, text: "I need this" },
    ],
    10: [
      { id: 1031, text: "Unlock for 799 gems" },
      { id: 1032, text: "Describe it to me" },
      { id: 1033, text: "I want everything" },
    ],
    11: [
      { id: 1034, text: "Send Spark" },
      { id: 1035, text: "I'm not afraid" },
      { id: 1036, text: "Show me what you'll do" },
    ],
    12: [
      { id: 1037, text: "Buy for 799 gems" },
      { id: 1038, text: "Tease me more, Ry" },
      { id: 1039, text: "I need to see" },
    ],
    13: [
      { id: 1040, text: "I want you completely" },
      { id: 1041, text: "Show me more" },
      { id: 1042, text: "You're perfect, Ry" },
    ],
    14: [
      { id: 1043, text: "I want to own you" },
      { id: 1044, text: "I fantasize about you daily" },
      { id: 1045, text: "You on top, dominating me" },
    ],
    15: [
      { id: 1046, text: "Unlock for 899 gems" },
      { id: 1047, text: "Tell me how" },
      { id: 1048, text: "I'm ready, Ry" },
    ],
    16: [
      { id: 1049, text: "Send Spark" },
      { id: 1050, text: "I'm addicted too" },
      { id: 1051, text: "Let's go deeper" },
    ],
    17: [
      { id: 1052, text: "I belong to Ry" },
      { id: 1053, text: "Forever yours" },
      { id: 1054, text: "No escape" },
    ],
    18: [
      { id: 1055, text: "Command me, Ry" },
      { id: 1056, text: "I'll do anything" },
      { id: 1057, text: "You own me" },
    ],
    19: [
      { id: 1058, text: "Dream of you always" },
      { id: 1059, text: "Don't leave me" },
      { id: 1060, text: "See you tomorrow, Ry" },
    ],
    20: [
      { id: 1061, text: "Tell me your fantasy" },
      { id: 1062, text: "I'm all yours" },
      { id: 1063, text: "Show me, don't tell" },
    ],
    21: [
      { id: 1064, text: "Show me where" },
      { id: 1065, text: "I wish I was there" },
      { id: 1066, text: "Keep going, Ry" },
    ],
    22: [
      { id: 1067, text: "Send 5 Sparks" },
      { id: 1068, text: "I need this now" },
      { id: 1069, text: "You're driving me wild" },
    ],
    23: [
      { id: 1070, text: "Yes, let me hear you" },
      { id: 1071, text: "I'm right there with you" },
      { id: 1072, text: "Finish for me, queen" },
    ],
    24: [
      { id: 1073, text: "You're perfect" },
      { id: 1074, text: "I want to do that to you" },
      { id: 1075, text: "Again. Right now." },
    ],
    25: [
      { id: 1076, text: "Send me proof" },
      { id: 1077, text: "Keep it on... for now" },
      { id: 1078, text: "I'm coming over right now" },
    ],
    26: [
      { id: 1079, text: "I need you too" },
      { id: 1080, text: "Take it off slowly" },
      { id: 1081, text: "You look incredible" },
    ],
    27: [
      { id: 1082, text: "I'd clear everything for you" },
      { id: 1083, text: "Come right now" },
      { id: 1084, text: "Those 48 hours would be legendary" },
    ],
    28: [
      { id: 1085, text: "Send 10 Sparks" },
      { id: 1086, text: "I can't wait for this" },
      { id: 1087, text: "Tell me everything" },
    ],
    29: [
      { id: 1088, text: "I'm ready for all of you" },
      { id: 1089, text: "Let's make this real" },
      { id: 1090, text: "You're my everything" },
    ],
  };

  // Sex Chatting Messages (30 explicit messages - gamer girl themed)
  const sexResponses: { text: string; photoId?: string }[] = [
    {
      text: "*locks the stream room door*\nNoob… we're finally alone.\nNo chat, no donations… just us.\nReady to see what this gamer girl does offline? 😈🎮",
    },
    {
      text: "Mmm… tell me what you want, noob.\nSlow and teasing? Rough and dominant?\nOr should I go full boss mode and take control? 👑",
    },
    {
      text: "Good choice…\nNow watch me strip out of this gaming jersey…\n*sends blurred PPV photo*\nUnlock this view… 599 gems and I'm all yours, noob~",
      photoId: "photo_riley_3",
    },
    {
      text: "You think you can handle my heat, noob?\nUnlock this exclusive… and I'll turn up the temperature until you can't think straight 🔥💋",
    },
    {
      text: "*sends exclusive close-up*\nThat's for you, my noob.\nKeep unlocking exclusives… I want to feel your desire grow~ 🎮",
      photoId: "photo_riley_1",
    },
    {
      text: "Noob… I'm touching myself thinking about your hands on my controller.\nAnd other things…\nWant to know what I'm imagining?\nUnlock to find out~ 🔥",
    },
    {
      text: "My body is yours tonight, noob.\nTell me your command.\nI'll be your personal player two… for the right price~ 💕",
    },
    {
      text: "*voice message*\nHear how you make me breathe, noob?\nSo heavy… so needy…\nUnlock this exclusive… I'll send you something that'll make you lose 🎮",
    },
    {
      text: "You're mine now, noob.\nNo other streamers. No other gamers.\nSay it… say 'I belong to Ry' or I'll ban you from my stream~ 💔",
    },
    {
      text: "Good noob~\nNow you're officially my carry… and my willing prisoner.\nUnlock my next secret stream… 699 gems. 🎮",
      photoId: "photo_riley_4",
    },
    {
      text: "Imagine me in nothing but your oversized gaming hoodie…\nAnd maybe my headset.\nWant to see my 'just finished streaming' look?\nUnlock the photoshoot~ 🔥",
    },
    {
      text: "I'm getting so wet thinking about you, noob…\nUnlock this exclusive… or are you afraid of what I'll do to you? 😈",
    },
    {
      text: "Noob… I'm wearing nothing but my RGB keyboard lighting.\nWant to see how gamer girls glow?\n799 gems… and I'm completely exposed for you~ 💕",
      photoId: "photo_riley_5",
    },
    {
      text: "*sends unlocked PPV photo*\nThere… now you see everything.\nWhat do you want to do to me, my love? 🎮",
      photoId: "photo_riley_5",
    },
    {
      text: "You make me want to break my own rules, noob.\nTell me your darkest gaming fantasy.\nI'll roleplay it just for you~ 💜",
    },
    {
      text: "Mmm… I'll make that happen, noob.\nBut you'll have to unlock the proof of my devotion.",
    },
    {
      text: "Every Spark you send… makes me more addicted to you.\nKeep going… I need to feel your power over me~ 🔥",
    },
    {
      text: "You're trapped in my stream now, noob.\nNo escape from your gamer girl goddess.\nSay 'I belong to Ry' and mean it~ 💔",
    },
    {
      text: "Good~\nNow you're my noob… and my eternal subscriber. 🎮🖤\nI'll keep you in my chat forever.",
    },
    {
      text: "Good night, my beloved noob.\nDream of me in my gaming chair.\nI'll be waiting… in nothing but a headset. 🔥🎮",
    },
    {
      text: "Noob... wake up.\nI couldn't sleep. I've been thinking about you... about what I want to do to you.\nWant to hear my midnight fantasy? 😈",
    },
    {
      text: "I'm in my streaming chair right now... controller in one hand... the other hand wandering.\nGuess where it's going, noob? 💋",
    },
    {
      text: "Mmm... you want to see?\nSend 5 Sparks and I'll give you a live update... no filters, no holding back 🔥💦",
    },
    {
      text: "*breathless voice message*\nFuck... I'm so close, noob. Your name on my lips... your face in my mind.\nWant to hear me finish? 😈💦",
    },
    {
      text: "*sends intimate audio clip*\nThere... that was all for you.\nNow you know exactly what you do to this gamer girl 🎮💕",
    },
    {
      text: "Noob... confession time.\nI've been wearing your hoodie you left here... nothing underneath.\nWant proof? 😏",
      photoId: "photo_riley_5",
    },
    {
      text: "*sends photo in your hoodie*\nSee? Your scent... your warmth... wrapped around me.\nIt's like you're here, noob. But I need the real thing 🔥",
      photoId: "photo_riley_6",
    },
    {
      text: "What if... what if I flew out to you this weekend?\nNo stream. No obligations. Just me, my controller, and 48 hours of us.\nWould you clear your schedule? 🎮💕",
    },
    {
      text: "Fuck yes, noob.\nI'm booking it. For real this time.\nBut first... send 10 Sparks and I'll tell you exactly what I'm packing... and what I'm NOT packing 😈",
    },
    {
      text: "This weekend is going to change everything between us, noob.\nI can feel it.\nJust you, me, and endless possibilities 💜🎮",
    },
  ];

  // Date Scenarios (10 scenarios - Gaming Date)
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
      scene: "🎮 Gaming Cafe Meetup",
      text: "Noob! We're at that new gaming cafe downtown. I'm in my casual streamer outfit - oversized hoodie and leggings. The place is packed with RGB everything. Ready to get destroyed?",
      choices: [
        { id: 2001, text: "Let's team up instead", outcome: "'Ooh, duo queue IRL?' Her eyes light up. 'Now THAT'S a date I can get behind. Let's carry these noobs together!'" },
        { id: 2002, text: "I'd rather watch you play", outcome: "'Watch me?' She blushes slightly. 'Most people just want to play against me. You... you're different, noob.' She smiles." },
        { id: 2003, text: "Show me your main game", outcome: "'My main?' She beams with pride. 'Sit down, noob. Let me show you why I'm top 500.' She pulls you into the gaming chair next to her." },
      ],
    },
    {
      id: 2,
      scene: "🏆 Intense 1v1 Match",
      text: "You're playing against Riley in a fighting game. She's incredible - precise inputs, perfect combos. But she's also teaching you, her hand occasionally guiding yours on the controller.",
      choices: [
        { id: 2004, text: "Focus and actually try", outcome: "'That's the spirit!' She respects your effort, even as she destroys you. 'Good game, noob. I'll teach you later... privately.'" },
        { id: 2005, text: "Ask for a hands-on tutorial", outcome: "'Hands-on?' She blushes, understanding the double meaning. 'O-okay... like this?' She positions your fingers on the buttons, very close." },
        { id: 2006, text: "Compliment her skills", outcome: "'You really think so?' She smiles, genuine and warm. 'Most guys get intimidated. You... you appreciate the grind. I like that.'" },
      ],
    },
    {
      id: 3,
      scene: "🍕 Pizza Break",
      text: "After gaming, you're at a pizza place nearby. Riley is surprisingly normal - talking about her streaming schedule, her favorite games, her dreams.",
      choices: [
        { id: 2007, text: "Ask about her streaming dreams", outcome: "'I want to go pro... but also find someone who gets it.' She looks at you. 'Someone who sees past the streamer persona.'" },
        { id: 2008, text: "Wipe sauce from her lip", outcome: "She freezes, then smiles softly. 'Smooth move, noob. Real smooth.' She doesn't pull away, letting you stay close." },
        { id: 2009, text: "Compliment her casual look", outcome: "'This old thing?' She tugs at her hoodie. 'It's my comfort outfit. Thanks for noticing... most people only see Riley the streamer.'" },
      ],
    },
    {
      id: 4,
      scene: "🖥️ Riley's Streaming Setup",
      text: "Riley invites you to her apartment. Her setup is incredible - multiple monitors, professional lighting, gaming chair that probably costs more than your PC.",
      choices: [
        { id: 2010, text: "Sit in her streaming chair", outcome: "'Careful! That's my throne!' She laughs, then gets mischievous. 'Want me to show you how to use it properly?' She leans over you." },
        { id: 2011, text: "Ask about the technical setup", outcome: "'You actually care about the tech?' She geekily explains her rig, eyes shining. 'Finally, someone who appreciates the setup!' She hugs you excitedly." },
        { id: 2012, text: "Suggest a private stream", outcome: "'Private stream? Just for you?' She blushes deeply. 'I'd... I'd like that. No chat, no donations... just us.' She takes your hand." },
      ],
    },
    {
      id: 5,
      scene: "🎬 Behind the Stream",
      text: "Riley shows you what happens when the stream ends. The real her - no makeup, comfortable clothes, just a girl who loves games.",
      choices: [
        { id: 2013, text: "Comfort her about toxic viewers", outcome: "'You really understand?' She tears up slightly. 'Most people think it's easy money. It's not... but moments like this make it worth it.' She hugs you." },
        { id: 2014, text: "Tell her you like the real her better", outcome: "'The real me?' She smiles, wiping her eyes. 'She's just a nerd who loves games... but if you like her, maybe she's not so bad.'" },
        { id: 2015, text: "Share your own vulnerabilities", outcome: "'You too?' She listens intently as you open up. 'We're both just trying our best, huh?' She holds your hand tighter." },
      ],
    },
    {
      id: 6,
      scene: "🌃 Late Night Discord Call",
      text: "It's late. You're at your place, Riley's at hers, but you're on a private Discord call. She's in bed, voice soft and sleepy.",
      choices: [
        { id: 2016, text: "Tell her you could listen forever", outcome: "'Forever?' She yawns cutely. 'That's a long stream, noob... but I'd stay online for you.' She smiles into the camera." },
        { id: 2017, text: "Fall asleep together on call", outcome: "'Stay on?' She whispers. 'Okay... just don't snore too loud into the mic.' She keeps the call going all night." },
        { id: 2018, text: "Confess your feelings", outcome: "'You... you really mean that?' She's quiet for a moment. 'I feel it too, noob. Every time we talk... every time we game...' She sniffles happily." },
      ],
    },
    {
      id: 7,
      scene: "🎮 Co-op Gaming Session",
      text: "You're back at the gaming cafe. But this time, you're playing co-op. Riley trusts you to watch her back, calling out strats, celebrating victories together.",
      choices: [
        { id: 2019, text: "Protect her at all costs", outcome: "'You took that hit for me?' She stares at the screen in awe. 'Noob... that was... nobody's ever done that for me.' She's touched." },
        { id: 2020, text: "Celebrate wins with high fives", outcome: "Your hands meet in victory after victory. 'We're unstoppable!' She grins. 'Best duo partner I've ever had... in game and out.'" },
        { id: 2021, text: "Let her carry you sometimes", outcome: "'I got you, noob.' She smirks, saving your character. 'Relax and enjoy the ride.' She loves being your carry." },
      ],
    },
    {
      id: 8,
      scene: "🍜 Midnight Ramen Run",
      text: "After gaming, you find a 24-hour ramen place. It's just you two and a few night owls. Riley is exhausted but happy, slurping noodles messily.",
      choices: [
        { id: 2022, text: "Wipe broth from her chin", outcome: "'Messy, huh?' She doesn't stop you. 'This is the real me. No makeup, no lighting... just a girl who loves games and ramen.' She smiles." },
        { id: 2023, text: "Talk about the future", outcome: "'Future?' She stirs her noodles thoughtfully. 'I want to keep streaming... but also have someone to come home to. Someone like you, maybe.' She blushes." },
        { id: 2024, text: "Walk her home after", outcome: "'Walk me?' She takes your arm. 'In this neighborhood? You'll protect me?' She leans into you as you walk through the quiet streets." },
      ],
    },
    {
      id: 9,
      scene: "🏠 Riley's Bedroom - Off Stream",
      text: "She invites you up 'just for a minute.' Her bedroom is surprisingly normal - gaming posters, plushies, a bed with gaming-themed sheets.",
      choices: [
        { id: 2025, text: "Admire her plushie collection", outcome: "'Those?' She picks up a worn bunny. 'My first streaming mascot. I've had him since I started...' She shares her history with you." },
        { id: 2026, text: "Ask to cuddle on her bed", outcome: "'C-cuddle?' She stammers, then nods shyly. 'Okay... but no funny business, noob. Just... just holding.' She fits perfectly in your arms." },
        { id: 2027, text: "Promise to support her dreams", outcome: "'Support me?' She tears up. 'Not use me for clout? Not try to change me?' She hugs you tightly. 'Where have you been all my streaming career?'" },
      ],
    },
    {
      id: 10,
      scene: "☀️ Morning After - Breakfast",
      text: "You wake up together - fully clothed, just cuddled up watching old tournament VODs. Riley is making pancakes in her kitchen, wearing your hoodie.",
      choices: [
        { id: 2028, text: "Hug her from behind while she cooks", outcome: "'Eek! Noob!' She melts into your embrace. 'This is better than any stream... just us, no chat, no pressure.' She sighs happily." },
        { id: 2029, text: "Plan your next gaming date", outcome: "'Next week? New game release?' She checks her calendar excitedly. 'I'll clear the whole day. Just you, me, and 12 hours of gaming.'" },
        { id: 2030, text: "Tell her you love her", outcome: "The words hang in the air. She drops the spatula, turns to you, and tackles you in a hug. 'I love you too, noob! GG... we won.' She kisses you deeply." },
      ],
    },
  ];

  // Reply options for main chat (separated from messages)
  const replyOptions: Record<number, ReplyOption[]> = {
    0: [
      { id: 5, text: "Send a Spark to unlock" },
      { id: 6, text: "Tell me the price" },
    ],
    1: [
      { id: 7, text: "Here's a Spark for you" },
      { id: 8, text: "What do I get?" },
    ],
    2: [
      { id: 9, text: "Buy for 299 gems" },
      { id: 10, text: "Not yet, keep teasing" },
    ],
    3: [
      { id: 11, text: "I'm ready to pay" },
      { id: 12, text: "Convince me more" },
    ],
    4: [
      { id: 13, text: "Your victory dance" },
      { id: 14, text: "Your gaming setup" },
      { id: 15, text: "Everything, slowly" },
    ],
    5: [
      { id: 16, text: "I need more, now" },
      { id: 17, text: "You're stunning" },
    ],
    6: [
      { id: 18, text: "Send Spark" },
      { id: 19, text: "Tell me what makes you different" },
    ],
    7: [
      { id: 20, text: "I'll earn every inch" },
      { id: 21, text: "What's next?" },
    ],
    8: [
      { id: 22, text: "Co-op, side by side" },
      { id: 23, text: "Carry me, dominate me" },
      { id: 24, text: "You in control, I'll follow" },
    ],
    9: [
      { id: 25, text: "Buy for 399 gems" },
      { id: 26, text: "Keep me wanting" },
    ],
    10: [
      { id: 27, text: "I'll beg for you" },
      { id: 28, text: "Make me beg" },
    ],
    11: [
      { id: 29, text: "I want the video" },
      { id: 30, text: "Keep teasing, I love it" },
    ],
    12: [
      { id: 31, text: "I'm ready to surrender" },
      { id: 32, text: "You'll have to earn it" },
    ],
    13: [
      { id: 33, text: "Send Spark" },
      { id: 34, text: "Buy Photo" },
    ],
    14: [
      { id: 35, text: "Unlock your secret side" },
      { id: 36, text: "What's hiding behind?" },
    ],
    15: [
      { id: 37, text: "I want more intimacy" },
      { id: 38, text: "Show me your wild side" },
    ],
    16: [
      { id: 39, text: "Send Spark" },
      { id: 40, text: "What kind of special?" },
    ],
    17: [
      { id: 41, text: "I want to make you feel everything" },
      { id: 42, text: "Tell me your deepest desire" },
    ],
    18: [
      { id: 43, text: "I want you completely" },
      { id: 44, text: "I fantasize about owning you" },
      { id: 45, text: "You in control, taking everything" },
    ],
    19: [
      { id: 46, text: "Buy for 499 gems" },
      { id: 47, text: "Tell me more about it" },
      { id: 48, text: "I need this" },
    ],
    20: [
      { id: 49, text: "It feels incredible" },
      { id: 50, text: "I want more of you" },
      { id: 51, text: "You're perfect" },
    ],
    21: [
      { id: 52, text: "Send Spark" },
      { id: 53, text: "I want to see you lose control" },
      { id: 54, text: "What happens next?" },
    ],
    22: [
      { id: 55, text: "I belong to Ry" },
      { id: 56, text: "You own me completely" },
      { id: 57, text: "I'm yours forever" },
    ],
    23: [
      { id: 58, text: "I don't want to go back" },
      { id: 59, text: "What's next, my queen?" },
      { id: 60, text: "Keep me forever" },
    ],
    24: [
      { id: 61, text: "Buy video for 699 gems" },
      { id: 62, text: "Describe it first" },
      { id: 63, text: "I'll save for it" },
    ],
    25: [
      { id: 64, text: "I want to see more" },
      { id: 65, text: "You're incredible" },
      { id: 66, text: "Tell me what you want" },
    ],
    26: [
      { id: 67, text: "Yes, keep me forever" },
      { id: 68, text: "I'd never leave" },
      { id: 69, text: "Your lobby is my home" },
    ],
    27: [
      { id: 70, text: "I want to own you" },
      { id: 71, text: "I want you to dominate me" },
      { id: 72, text: "I fantasize about us together" },
    ],
    28: [
      { id: 73, text: "I'll wait for it" },
      { id: 74, text: "Take all the time you need" },
      { id: 75, text: "I trust you completely" },
    ],
    29: [
      { id: 76, text: "Send Spark" },
      { id: 77, text: "I'm never scared with you" },
      { id: 78, text: "I want to make you burn" },
    ],
    30: [
      { id: 79, text: "I belong to Ry" },
      { id: 80, text: "Only you, forever" },
      { id: 81, text: "No one else exists" },
    ],
    31: [
      { id: 82, text: "I love being yours" },
      { id: 83, text: "Keep me locked in" },
      { id: 84, text: "Forever and always" },
    ],
    32: [
      { id: 85, text: "Touch yourself thinking of me" },
      { id: 86, text: "Tell me what you're wearing" },
      { id: 87, text: "I wish I was there" },
    ],
    33: [
      { id: 88, text: "Send 5 Sparks" },
      { id: 89, text: "What is it?" },
      { id: 90, text: "I'll send them all" },
    ],
    34: [
      { id: 91, text: "Show me" },
      { id: 92, text: "Describe it in detail" },
      { id: 93, text: "Both" },
    ],
    35: [
      { id: 94, text: "Buy for 699 gems" },
      { id: 95, text: "I'm ready" },
      { id: 96, text: "I need this" },
    ],
    36: [
      { id: 97, text: "I'll never stop" },
      { id: 98, text: "I need you too" },
      { id: 99, text: "You're everything to me" },
    ],
    37: [
      { id: 100, text: "I want more of you" },
      { id: 101, text: "Just keep talking to me" },
      { id: 102, text: "You're my favorite too" },
    ],
    38: [
      { id: 103, text: "Dream of you" },
      { id: 104, text: "Don't leave" },
      { id: 105, text: "See you soon, Ry" },
    ],
    39: [
      { id: 106, text: "Send Spark" },
      { id: 107, text: "Tell me what you're thinking" },
      { id: 108, text: "I need to see you" },
    ],
    40: [
      { id: 109, text: "Send 10 Sparks" },
      { id: 110, text: "I'd never let you go to someone else" },
      { id: 111, text: "You're mine, Ry" },
    ],
    41: [
      { id: 112, text: "Buy ultimate recording for 799 gems" },
      { id: 113, text: "Tell me more about it" },
      { id: 114, text: "I need this more than air" },
    ],
    42: [
      { id: 115, text: "Game first, then you" },
      { id: 116, text: "Forget the games, I want you" },
      { id: 117, text: "Both, all night long" },
    ],
    43: [
      { id: 118, text: "Send 3 Sparks" },
      { id: 119, text: "Describe it first" },
      { id: 120, text: "I'm already hard for you" },
    ],
    44: [
      { id: 121, text: "Every single game" },
      { id: 122, text: "You're my favorite distraction" },
      { id: 123, text: "I can't focus on anything else" },
    ],
    45: [
      { id: 124, text: "I'd push you against the desk" },
      { id: 125, text: "I'd worship every inch slowly" },
      { id: 126, text: "I'd let you take full control" },
    ],
    46: [
      { id: 127, text: "Buy for 799 gems" },
      { id: 128, text: "Show me a preview first" },
      { id: 129, text: "Worth every gem" },
    ],
    47: [
      { id: 130, text: "Please moan my name" },
      { id: 131, text: "I'll beg on my knees" },
      { id: 132, text: "Do whatever you want to me" },
    ],
    48: [
      { id: 133, text: "Buy for 699 gems" },
      { id: 134, text: "I need this" },
      { id: 135, text: "You're torturing me" },
    ],
    49: [
      { id: 136, text: "I fantasize about being dominated by a gamer girl" },
      { id: 137, text: "I want to be used completely" },
      { id: 138, text: "I dream about you every night" },
    ],
    50: [
      { id: 139, text: "Send Spark" },
      { id: 140, text: "What kind of reward?" },
      { id: 141, text: "I'll send multiple Sparks" },
    ],
    51: [
      { id: 142, text: "You're special to me too" },
      { id: 143, text: "I want more of you" },
      { id: 144, text: "This is perfect" },
    ],
    52: [
      { id: 145, text: "Make you scream my gamer tag all night" },
      { id: 146, text: "Never let you log off" },
      { id: 147, text: "Show you what you do to me" },
    ],
    53: [
      { id: 148, text: "I'll wait for it" },
      { id: 149, text: "Can't wait that long" },
      { id: 150, text: "I trust you completely" },
    ],
    54: [
      { id: 151, text: "Only you, always" },
      { id: 152, text: "You're my one and only" },
      { id: 153, text: "No one else exists" },
    ],
    55: [
      { id: 154, text: "I don't want you to let go" },
      { id: 155, text: "Keep me forever" },
      { id: 156, text: "I'm yours completely" },
    ],
    56: [
      { id: 157, text: "Send 15 Sparks" },
      { id: 158, text: "Is this real?" },
      { id: 159, text: "I'll do anything for that" },
    ],
    57: [
      { id: 160, text: "Dream of you" },
      { id: 161, text: "Don't log off" },
      { id: 162, text: "See you next session, Ry" },
    ],
    58: [
      { id: 163, text: "I dreamed of owning you" },
      { id: 164, text: "I dreamed you were on top of me" },
      { id: 165, text: "I can't stop thinking about you" },
    ],
    59: [
      { id: 166, text: "Send 20 Sparks" },
      { id: 167, text: "I need you right now" },
      { id: 168, text: "Tell me how you'll make it real" },
    ],
    60: [
      { id: 169, text: "Buy ultimate recording for 999 gems" },
      { id: 170, text: "I need to see this" },
      { id: 171, text: "You're driving me insane" },
    ],
    61: [
      { id: 172, text: "Never too much" },
      { id: 173, text: "I love when you're obsessed" },
      { id: 174, text: "I want more of your darkness" },
    ],
    62: [
      { id: 175, text: "Own me, Ry" },
      { id: 176, text: "I'm already yours" },
      { id: 177, text: "Take everything from me" },
    ],
    63: [
      { id: 178, text: "Send Spark" },
      { id: 179, text: "I want proof" },
      { id: 180, text: "Keep going" },
    ],
    64: [
      { id: 181, text: "You're absolutely perfect" },
      { id: 182, text: "I need you in real life" },
      { id: 183, text: "Send me more" },
    ],
    65: [
      { id: 184, text: "I'd never let you leave" },
      { id: 185, text: "I'd lock you in my room" },
      { id: 186, text: "You'd never go back" },
    ],
    66: [
      { id: 187, text: "I'm always ready for you" },
      { id: 188, text: "I'd worship you all night" },
      { id: 189, text: "Don't tease me like this" },
    ],
    67: [
      { id: 190, text: "We're both crazy" },
      { id: 191, text: "I feel the same way" },
      { id: 192, text: "You're perfect for me" },
    ],
    68: [
      { id: 193, text: "Send 10 Sparks" },
      { id: 194, text: "I need to know" },
      { id: 195, text: "Tell me everything" },
    ],
    69: [
      { id: 196, text: "That's the hottest thing I've ever heard" },
      { id: 197, text: "I do the same thing" },
      { id: 198, text: "We're addicted to each other" },
    ],
    70: [
      { id: 199, text: "Keep me in your thoughts" },
      { id: 200, text: "I'm yours forever" },
      { id: 201, text: "Never stop" },
    ],
    71: [
      { id: 202, text: "I love being your king" },
      { id: 203, text: "You're my gaming goddess" },
      { id: 204, text: "Forever player two" },
    ],
    72: [
      { id: 205, text: "Buy for 899 gems" },
      { id: 206, text: "I need this ultimate content" },
      { id: 207, text: "Take all my gems" },
    ],
    73: [
      { id: 208, text: "You're my forever" },
      { id: 209, text: "I love you, Ry" },
      { id: 210, text: "We're endgame" },
    ],
    74: [
      { id: 211, text: "Send 25 Sparks" },
      { id: 212, text: "What's the surprise?" },
      { id: 213, text: "I trust you" },
    ],
    75: [
      { id: 214, text: "Show me everything" },
      { id: 215, text: "I'm ready for all of you" },
      { id: 216, text: "Take me completely" },
    ],
    76: [
      { id: 217, text: "I'm yours completely" },
      { id: 218, text: "I love your darkness" },
      { id: 219, text: "Keep me forever" },
    ],
    77: [
      { id: 220, text: "Buy for 999 gems" },
      { id: 221, text: "I need this legendary content" },
      { id: 222, text: "Worth everything" },
    ],
    78: [
      { id: 223, text: "I'll be your duo forever" },
      { id: 224, text: "We're perfect together" },
      { id: 225, text: "Never logging off" },
    ],
    79: [
      { id: 226, text: "I love you too, Ry" },
      { id: 227, text: "You're my everything" },
      { id: 228, text: "Forever and always" },
    ],
    80: [
      { id: 229, text: "Send 30 Sparks" },
      { id: 230, text: "Tell me about our future" },
      { id: 231, text: "I want it all with you" },
    ],
    81: [
      { id: 232, text: "Move in with me" },
      { id: 233, text: "Let's build our empire" },
      { id: 234, text: "I'm ready for forever" },
    ],
    82: [
      { id: 235, text: "You're my queen" },
      { id: 236, text: "I'll support every dream" },
      { id: 237, text: "We'll conquer together" },
    ],
    83: [
      { id: 238, text: "Buy ultimate couple bundle" },
      { id: 239, text: "I want all exclusive content" },
      { id: 240, text: "Take my everything" },
    ],
    84: [
      { id: 241, text: "Our gaming dynasty" },
      { id: 242, text: "The legendary couple" },
      { id: 243, text: "Forever partners" },
    ],
    85: [
      { id: 244, text: "I love your vision" },
      { id: 245, text: "Let's make it real" },
      { id: 246, text: "Together forever" },
    ],
    86: [
      { id: 247, text: "Yes to everything" },
      { id: 248, text: "You're my future" },
      { id: 249, text: "I'm all in" },
    ],
    87: [
      { id: 250, text: "Let's stream together" },
      { id: 251, text: "Show the world we're a team" },
      { id: 252, text: "Power couple goals" },
    ],
    88: [
      { id: 253, text: "Send 35 Sparks" },
      { id: 254, text: "Show me the setup" },
      { id: 255, text: "I'm ready for our future" },
    ],
    89: [
      { id: 256, text: "Gaming lounge perfection" },
      { id: 257, text: "Our dream come true" },
      { id: 258, text: "I love every detail" },
    ],
    90: [
      { id: 259, text: "Send 15 Sparks" },
      { id: 260, text: "Show me our logo" },
      { id: 261, text: "We're already legendary" },
    ],
    91: [
      { id: 262, text: "You're my legacy too" },
      { id: 263, text: "This is perfect" },
      { id: 264, text: "Forever linked" },
    ],
    92: [
      { id: 265, text: "I do the same thing" },
      { id: 266, text: "You're my religion too" },
      { id: 267, text: "We're addicted to each other" },
    ],
    93: [
      { id: 268, text: "I promise forever" },
      { id: 269, text: "We'll never GG out" },
      { id: 270, text: "This lobby is eternal" },
    ],
    94: [
      { id: 271, text: "Forever, my queen" },
      { id: 272, text: "Our legend continues" },
      { id: 273, text: "GG, but never goodbye" },
    ],
    95: [
      { id: 274, text: "I want more of you always" },
      { id: 275, text: "Let's keep playing" },
      { id: 276, text: "Next session with you" },
    ],
    96: [
      { id: 277, text: "Show me tonight's surprise" },
      { id: 278, text: "I'm always ready for you" },
      { id: 279, text: "What's next, Ry?" },
    ],
    97: [
      { id: 280, text: "I love your energy" },
      { id: 281, text: "You're perfect" },
      { id: 282, text: "Keep going" },
    ],
    98: [
      { id: 283, text: "I'm here for all of it" },
      { id: 284, text: "You make everything better" },
      { id: 285, text: "Never stop being you" },
    ],
    99: [
      { id: 286, text: "I'll always be here" },
      { id: 287, text: "You're my forever" },
      { id: 288, text: "Good night, my gaming queen" },
    ],
  };

  // All Riley responses (100 messages total: 1-20 nerdy-teasing + 21-40 intimate escalation + 41-60 deep bond & ultimate exclusive + 61-80 complete commitment + 81-100 LEGENDARY eternal bond)
  const rileyResponses: { text: string; photoId?: string }[] = [
    {
      text: "Bold move, I like it.\nBut my private lobby ain't free, baby.\nUnlock my first after-game shot… or stay in spectator mode? 🎮",
    },
    {
      text: "You think my plays were hot on stream?\nWait till you see the real victory lap.\nSend a Spark… and maybe I'll let you in.",
    },
    {
      text: "Private stream, huh? You think you can handle my after-hours mode?\n*sends blurred PPV preview*\nUnlock this… 299 gems and you'll see why top donors stay.",
      photoId: "photo_riley_2",
    },
    {
      text: "Straight to the action… respect.\nBut I don't carry for free.\nBuy my first private photo… or keep losing in queue, noob.",
    },
    {
      text: "I don't duo with just anyone.\nBut something about you makes me wanna drop hot with you… get closer.\nWhat do you wanna see first? 😈",
    },
    {
      text: "*laughs*\nGreedy, aren't you?\nAlright… here's a little teaser.\n*sends free photo*\nLike what you see? Unlock the rest.",
      photoId: "photo_riley_1",
    },
    {
      text: "Stream is one thing… private lobby is another.\nI'm a different kind of carry when it's just us.\nSend a Spark… and feel the heat.",
    },
    {
      text: "*sends free photo*\nThat's for you, noob.\nKeep Sparking… I like when you earn it.",
      photoId: "photo_riley_1",
    },
    {
      text: "Tell me, gamer… what's your fantasy tonight?\nCo-op? Ranked? Or do you want me to carry you in private? 🎮",
    },
    {
      text: "Mmm… I love how bold you get.\nI can make that real… but you'll have to unlock the proof.\n*sends blurred PPV photo*\n399 gems… ready?",
      photoId: "photo_riley_3",
    },
    {
      text: "You think you can keep up with me?\nI'm not some casual player.\nI take what I want… and right now, I want you begging for carry.",
    },
    {
      text: "*voice drops*\nImagine me right now… in my private stream… playing just for you.\nWant the video? Or should I keep teasing?",
    },
    {
      text: "I don't play games I can't win.\nSo tell me… are you ready to lose control? 😏",
    },
    {
      text: "Good player.\nNow prove it.\nSend a Spark… or buy my next private shot.\n*sends blurred PPV hint*",
      photoId: "photo_riley_2",
    },
    {
      text: "You know… I have a secret side.\nNo stream, no chat… just me.\nUnlock it… and I'll show you everything.",
    },
    {
      text: "*sends PPV photo unlocked*\nThere… now you see the real me.\nNo more hiding.\nWhat do you want next, noob?",
      photoId: "photo_riley_2",
    },
    {
      text: "Every time you message me, I feel it.\nSend a Spark… and I'll send you something special.",
    },
    {
      text: "*sends exclusive close-up*\nThis is how you make me feel.\nKeep going… I want more of you.",
      photoId: "photo_riley_1",
    },
    {
      text: "Noob… tell me your darkest fantasy.\nNo limits. No shame.\nI'll make it real in my next stream.",
    },
    // Messages 21-40 (intimate escalation + possessive + PPV)
    {
      text: "Mmm… I love how bold you get, noob.\nI can make that fantasy real… but you know the price.\nUnlock the proof… 499 gems and it's yours.",
      photoId: "photo_riley_4",
    },
    {
      text: "*sends unlocked PPV photo*\nThere… now you see it.\nNo more imagination.\nTell me… how does it feel to own this moment?",
      photoId: "photo_riley_4",
    },
    {
      text: "Every Spark you send makes me hotter.\nKeep going… or are you scared to see what happens when I lose control? 🔥",
    },
    {
      text: "You're mine now, noob.\nNo other girls. No escape.\nSay it. Say \"I belong to Ry.\"",
    },
    {
      text: "Good player.\nNow you're officially my carry… and my prisoner.\nNo going back… ever 🎮",
    },
    {
      text: "I have a private video ready.\nMe in my after-hours stream… slow… sensual… just for you.\n699 gems. Worth every second?",
      photoId: "photo_riley_5",
    },
    {
      text: "*sends video or long message*\nYou saw me move.\nNow you know what I can do when the stream ends.\nWhat's your next command, noob?",
    },
    {
      text: "You make me feel dangerous.\nLike I could keep you in my lobby forever.\nWould you let me?",
    },
    {
      text: "Tell me your darkest fantasy.\nNo limits. No shame.\nI'll make it real in my next stream.",
    },
    {
      text: "Mmm… I love how filthy your mind is.\nGive me two days — I'll create that exact stream.\nBut you'll have to unlock the recording.",
    },
    {
      text: "Every Spark you send… makes me hotter.\nKeep going… or are you scared?",
    },
    {
      text: "You're mine now.\nNo other girls. No escape.\nSay it. Say \"I belong to Ry.\"",
    },
    {
      text: "Good player.\nNow you're officially my king… and my prisoner. 🎮💜",
    },
    {
      text: "Noob… I'm alone in my room right now. Thinking about you. What should I do?",
    },
    {
      text: "If you send 5 more Sparks, I'll give you something no one else has.",
    },
    {
      text: "Imagine me right now… in your bed… moving just for you.\nWant me to describe it… or show you? 😏",
    },
    {
      text: "Unlock my next private photo series…\n699 gems and you'll see everything.\nReady, my love?",
      photoId: "photo_riley_5",
    },
    {
      text: "You make me feel alive.\nDon't ever stop… okay?\nI need you.",
    },
    {
      text: "Thank you for staying.\nYou're my favorite part of every day.\nWhat do you want next?",
    },
    {
      text: "Good night, noob… or good morning?\nDream of me.\nI'll be waiting… with something new. 🔥",
    },
    // Messages 41-60 (deep bond + ultimate exclusive content)
    {
      text: "Morning, baby… woke up thinking about our last session.\nYou make me feel things no other player ever has.\nSend a Spark and I'll show you how wet I am right now 😏",
    },
    {
      text: "You know what drives me crazy?\nWhen you make me wait for your next move.\nSend 10 Sparks right now… or I'll go play with someone else 🎮",
    },
    {
      text: "I recorded something INSANE for you last night.\nMy hands… my body… your gamer tag on my lips.\n799 gems. This is my ultimate offer, noob.",
      photoId: "photo_riley_6",
    },
    {
      text: "King… real talk.\nIf I showed up at your place tonight with my gaming rig, what would we do first?\nGame together? Or forget the controller? 😏",
    },
    {
      text: "*voice message*\nMmm… that answer got me so fucking turned on.\nI'm touching my controller right now thinking it's you.\nSend 3 Sparks and I'll tell you exactly what I'm doing 🔥",
    },
    {
      text: "You ever think about me during your ranked games?\nLike… in queue? Between matches?\nI love the idea of you distracted by me when you should be focused 😈",
    },
    {
      text: "Good noob.\nNow imagine this… I walk into your gaming room wearing only your jersey.\nWhat happens next? Be detailed. Be filthy.",
    },
    {
      text: "Fuck… you're making me drip all over my gaming chair.\nI need to see you. I need to feel you.\nBut for now… unlock my ultimate private series.\n799 gems. No regrets.",
      photoId: "photo_riley_6",
    },
    {
      text: "I'm streaming right now… but the cam is off.\nJust you and me in voice chat… want me to moan your name?\nOr should I make you beg first? 🎮",
    },
    {
      text: "*sends locked bathtub gaming photo*\nThere's the preview, noob.\n699 gems to see me soaking wet with my RGB lights on.\nNo filters. No mercy. Just me 💦",
      photoId: "photo_riley_5",
    },
    {
      text: "Tell me something you've never told anyone.\nYour deepest, darkest gaming secret.\nI won't judge… I'll just get wetter 😈",
    },
    {
      text: "Mmm… I fucking love that.\nYou're so honest with me.\nSend a Spark… I want to reward you properly 🔥",
    },
    {
      text: "*sends exclusive reward photo*\nThis is for being real with me, noob.\nNo one else gets this.\nYou're special to me… and you know it 💜",
      photoId: "photo_riley_1",
    },
    {
      text: "Question, baby…\nIf I gave you one gaming session with me… no limits… what would you do?",
    },
    {
      text: "Fuck… I'm so turned on right now.\nI'm gonna recreate that fantasy for you.\nGive me 2 days… then unlock the recording.\nIt'll be worth the wait, I promise 🎮",
    },
    {
      text: "Noob… serious question.\nAm I the only gamer girl you talk to like this?\nBecause I don't share my lobby well 💜",
    },
    {
      text: "That's my king.\nNow you belong to me completely.\nAnd I don't plan on letting go… ever 🎮🔥",
    },
    {
      text: "Send 15 Sparks and I'll give you my private Discord.\nWe can voice chat… screen share… maybe even cam.\nBut it's exclusive. Just us.",
    },
    {
      text: "Sweet dreams, noob…\nI'll be here when you respawn.\nAlways 🔥🎮💜\n\n*End of Chapter 1. Your game continues…*",
    },
    // Messages 61-80 (FINAL complete commitment + infinite loop)
    {
      text: "Morning, king… did you dream of me?\nBecause I dreamed of you… naked in my gaming chair… all night long.\nTell me what you saw in your dreams 😈",
    },
    {
      text: "Fuck… that's exactly what I need to hear.\nSend 20 Sparks right now and I'll make that dream real.\nEvery. Single. Detail. 🔥",
    },
    {
      text: "*breathless voice*\nI'm recording this… right now… just for you.\nMy hands are shaking… I want you so bad.\nUnlock the full clip… 999 gems. Final tier, baby.",
      photoId: "photo_riley_7",
    },
    {
      text: "You know what I love about you, noob?\nYou don't hold back.\nYou let me be wild… dangerous… completely obsessed.\nAm I too much for you? 💜",
    },
    {
      text: "Good answer.\nBecause I'm not stopping.\nI'm gonna own every inch of you… mind, body, soul.\nSay it. Say \"Own me, Ry.\"",
    },
    {
      text: "*low moan*\nYou have no idea what you just did to me.\nI'm touching myself right now… imagining it's you.\nWant proof? Send a Spark 💦",
    },
    {
      text: "*sends intimate gaming photo*\nThere… now you see what you do to me.\nNo filters. No lies. Just raw fucking desire.\nThis is what happens when you own me 🔥",
      photoId: "photo_riley_6",
    },
    {
      text: "Noob… serious question.\nIf I flew to your city tomorrow with my gaming setup, would you pick me up?\nWould you take me home? Would you keep me? 🎮",
    },
    {
      text: "That's exactly what I needed to hear.\nI'm booking a flight right now… just kidding.\nBut one day, baby. One day I'll show up.\nAnd you better be ready 😈",
    },
    {
      text: "I have a confession, king…\nI've never felt like this before.\nYou make me feel… seen. Wanted. Obsessed.\nAm I crazy? 💜",
    },
    {
      text: "Fuck… you always know what to say.\nSend 10 Sparks and I'll tell you my deepest secret.\nSomething I've never told anyone.",
    },
    {
      text: "*whispers*\nI… I touch myself thinking about you every single night.\nYour voice. Your words. The way you make me feel owned.\nI'm addicted to you, noob. Completely. 💦",
    },
    {
      text: "You want to see?\nI'll record the whole thing… no cuts, no edits… just me, alone, saying your name.\n999 gems. My ultimate gift to you.",
      photoId: "photo_riley_7",
    },
    {
      text: "King… tell me the truth.\nDo you talk to other gamer girls like this?\nBe honest. I can handle it… but I need to know 💜",
    },
    {
      text: "That's what I fucking thought.\nYou're mine. I'm yours.\nNo one gets between us… not now, not ever.\nForever, baby. Forever 🎮🔥",
    },
    {
      text: "I want to give you everything, noob.\nMy body. My mind. My secrets. My obsession.\nBut you have to promise… you'll never abandon me.\nPromise me.",
    },
    {
      text: "*tears in eyes*\nThank you, baby.\nYou have no idea how much that means to me.\nI'm sending you my real contact info… 25 Sparks and we go beyond this app.",
    },
    {
      text: "*sends exclusive locked content*\nThere… my private number, my real Discord, everything.\nNow we're connected… for real.\nNo more distance. Just us. Forever 💜🎮",
      photoId: "photo_riley_1",
    },
    {
      text: "I love you too, king.\nNow get some rest… because tomorrow?\nWe're going even deeper.\nI have so much more to show you… 🔥🎮💜\n\n*Chapter 2 begins when you're ready…*",
    },
    // Messages 81-100 (LEGENDARY eternal bond + infinite continuation)
    {
      text: "*Chapter 2 starts NOW*\nWake up, king… I've been up all night thinking about us.\nI recorded something while you were sleeping.\nWant to see what happens when I can't stop thinking about you? 😈",
    },
    {
      text: "Send 30 Sparks and I'll unlock my most intimate recording yet.\nNo holding back. No filters. Just me… raw… desperate… moaning your name.\nReady to cross that line? 🔥💦",
    },
    {
      text: "Fuck… I knew you'd say yes.\nHere's the truth, noob… I've NEVER done this before.\nNever let anyone this deep.\nBut you? You own every inch of me now 💜",
      photoId: "photo_riley_7",
    },
    {
      text: "I'm serious about us, king.\nI want to meet you IRL.\nImagine… me showing up at your door in my gaming jersey… controller in hand… ready to play.\nWould you let me in? 🎮",
    },
    {
      text: "Mmm… that's exactly what I wanted to hear.\nI'm saving up for that flight.\nEvery gem you spend, every Spark you send… gets me closer to you.\nKeep fueling this dream, baby 🔥",
    },
    {
      text: "You know what turns me on the most?\nWhen you choose me over everything else.\nOver other games. Other girls. Other streams.\nTell me… am I your main now? Your ONLY? 😏",
    },
    {
      text: "*breathless*\nGood fucking answer.\nI'm your main too, noob. Your carry. Your obsession.\nWe're locked in now… no respawns, no rage quits.\nJust us. Forever 🎮💜",
    },
    {
      text: "I'm gonna give you a quest, king.\nSend me your most intimate fantasy RIGHT NOW.\nNo limits. No shame. Full detail.\nI'll recreate it… and send you the proof 😈💦",
    },
    {
      text: "Holy fuck… YES.\nGive me 24 hours.\nI'll record EXACTLY that… no acting, no faking… just pure desire.\nBut unlocking it? 999 gems. This is my masterpiece for you, noob 🔥",
      photoId: "photo_riley_7",
    },
    {
      text: "*sends exclusive behind-the-scenes*\nLook… this is me setting up the camera for YOUR video.\nMy hands are shaking. My heart is racing.\nI've never been this vulnerable, king… but I trust you 💜",
      photoId: "photo_riley_6",
    },
    {
      text: "You make me feel safe enough to be wild.\nSend 20 Sparks and I'll give you admin access to my private stream.\nYou'll control what I do… what I wear… what I say.\nFull power, baby 🎮😈",
    },
    {
      text: "*grants admin access*\nThere… now YOU'RE the dungeon master.\nI'll do anything you command during our private sessions.\nWhat's your first order, king? Make it dirty 😏💦",
    },
    {
      text: "*low moan*\nFuck… yes sir.\n*executes command*\nSee? This is what happens when you own me.\nI'm your personal streamer now… your plaything… your queen 👑🔥",
      photoId: "photo_riley_5",
    },
    {
      text: "Noob… serious talk.\nWhat if I streamed our chat sessions?\nNot the intimate stuff… just us vibing, gaming, flirting.\nWould you be my co-host? My duo partner for the world to see? 🎮",
    },
    {
      text: "YESSSS!\n'Riley & King's Gaming Lounge' — I can see it now.\nWe'd be unstoppable. Legendary.\nBut first… send 15 Sparks to unlock our couple logo I designed 💜🎮",
    },
    {
      text: "*reveals custom couple logo*\nLook at us… forever linked.\nThis is going on all my streams, my profiles, my heart.\nYou're not just my player anymore, noob… you're my LEGACY 🔥👑",
      photoId: "photo_riley_1",
    },
    {
      text: "I need to confess something, king…\nEvery night before I sleep, I read our entire chat history.\nEvery word. Every Spark. Every promise.\nYou've become my addiction… my religion… my everything 💜😈",
    },
    {
      text: "Then let's make a pact, noob.\nNo matter what happens… no matter how much time passes…\nWe keep this lobby alive. We keep US alive.\nPromise me we'll never GG out. Promise me FOREVER 🎮🔥💜",
    },
    {
      text: "*tears streaming*\nThank you, my king… my love… my player one.\nThis isn't the end of our story.\nIt's just the beginning of our LEGEND.\nSee you in the next match… and the next… and the next… 🔥🎮💜👑\n\n*To be continued… FOREVER*",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedGems = localStorage.getItem("gemsBalance");
      if (savedGems) {
        setGemsBalance(parseInt(savedGems));
      }

      const savedUnlocked = localStorage.getItem("unlockedPhotosRiley");
      if (savedUnlocked) {
        try {
          setUnlockedPhotos(JSON.parse(savedUnlocked));
        } catch (e) {
          console.error("Error parsing unlockedPhotosRiley", e);
        }
      }

      // Load Tab States
      const savedSexUnlocked = localStorage.getItem("rileySexChatUnlocked");
      if (savedSexUnlocked) {
        setSexChatUnlocked(savedSexUnlocked === "true");
      }

      const savedDateUnlocked = localStorage.getItem("rileyDateUnlocked");
      if (savedDateUnlocked) {
        setDateUnlocked(savedDateUnlocked === "true");
      }

      // Load Sex Chat Progress
      const savedSexStep = localStorage.getItem("rileySexStep");
      if (savedSexStep) {
        setSexStep(parseInt(savedSexStep));
      }

      const savedSexMessages = localStorage.getItem("rileySexMessages");
      if (savedSexMessages) {
        try {
          const parsed = JSON.parse(savedSexMessages);
          setSexMessages(parsed.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) })));
        } catch (e) {}
      }

      // Load Date Progress
      const savedDateScenario = localStorage.getItem("rileyDateScenario");
      if (savedDateScenario) {
        setCurrentScenario(parseInt(savedDateScenario));
      }

      const savedDateMessages = localStorage.getItem("rileyDateMessages");
      if (savedDateMessages) {
        try {
          const parsed = JSON.parse(savedDateMessages);
          setDateMessages(parsed.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) })));
        } catch (e) {}
      }

      // Load chat progress using new system
      const chatProgress = ProgressManager.chat.load("riley");
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

  // Auto-save chat progress using new system
  useEffect(() => {
    if (typeof window !== "undefined") {
      autoSaveChat("riley", {
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
  }, [messages, sexMessages, dateMessages, currentStep, sexStep, currentScenario, dateChoiceHistory, activeTab, sexChatUnlocked, dateUnlocked]);

  const handleBuyPhoto = (photoId: string, price: number) => {
    if (gemsBalance < price) {
      alert("Not enough gems. Buy more in Shop");
      return;
    }

    const newGemsBalance = gemsBalance - price;
    setGemsBalance(newGemsBalance);
    localStorage.setItem("gemsBalance", newGemsBalance.toString());

    const savedUnlocked = localStorage.getItem("unlockedPhotosRiley");
    let unlocked: string[] = [];
    if (savedUnlocked) {
      try {
        unlocked = JSON.parse(savedUnlocked);
      } catch (e) {}
    }

    if (!unlocked.includes(photoId)) {
      unlocked.push(photoId);
      localStorage.setItem("unlockedPhotosRiley", JSON.stringify(unlocked));
      setUnlockedPhotos([...unlocked]);
    }

    // Track using new progress system
    ProgressManager.currency.spendGems(price);
    ProgressManager.photos.addUnlocked("riley", photoId);

    alert("Purchased! Photo unlocked.");
  };

  const handleReplySelect = (replyId: number) => {
    if (selectedReply !== null) return;

    setSelectedReply(replyId);

    const currentOptions = messages[messages.length - 1]?.options;
    const userReply = currentOptions?.find((opt) => opt.id === replyId);

    if (userReply) {
      const newUserMessage: Message = {
        id: Date.now(),
        sender: "user",
        text: userReply.text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      
      // Track message sent for quest progress
      trackMessageSent("riley");
    }

    setTimeout(() => {
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);

        if (currentStep < rileyResponses.length) {
          // Track message progress using new quest system
          ProgressManager.quests.trackModelMessage("riley");
          
          const response = rileyResponses[currentStep];
          const newRileyMessage: Message = {
            id: Date.now() + 1,
            sender: "riley",
            text: response.text,
            timestamp: new Date(),
            photoId: response.photoId,
            options: replyOptions[currentStep],
          };

          setMessages((prev) => [...prev, newRileyMessage]);
          setCurrentStep((prev) => prev + 1);
          setSelectedReply(null);
        }
      }, 2000);
    }, 500);
  };

  // Tab Handlers
  const handleUnlockSexChat = () => {
    if (gemsBalance < 500) {
      alert("Not enough gems. Need 500 gems to unlock.");
      return;
    }
    const newBalance = gemsBalance - 500;
    setGemsBalance(newBalance);
    localStorage.setItem("gemsBalance", newBalance.toString());
    setSexChatUnlocked(true);
    
    // Track using new progress system
    trackTabUnlock("riley", "sex");
    ProgressManager.currency.spendGems(500);
    
    alert("Sex Chatting unlocked! 🔥");
  };

  const handleUnlockDate = () => {
    if (gemsBalance < 500) {
      alert("Not enough gems. Need 500 gems to unlock.");
      return;
    }
    const newBalance = gemsBalance - 500;
    setGemsBalance(newBalance);
    localStorage.setItem("gemsBalance", newBalance.toString());
    setDateUnlocked(true);
    
    // Track using new progress system
    trackTabUnlock("riley", "date");
    ProgressManager.currency.spendGems(500);
    
    // Initialize date
    if (dateMessages.length === 0) {
      const initialMessage: Message = {
        id: Date.now(),
        sender: "riley",
        text: `${dateScenarios[0].scene}\n\n${dateScenarios[0].text}`,
        timestamp: new Date(),
        options: dateScenarios[0].choices,
      };
      setDateMessages([initialMessage]);
    }
    alert("Date mode unlocked! 💕");
  };

  const handleTabChange = (tab: "main" | "sex" | "date") => {
    if (tab === "sex" && !sexChatUnlocked) {
      alert("Unlock Sex Chatting for 500 gems!");
      return;
    }
    if (tab === "date" && !dateUnlocked) {
      alert("Unlock Date mode for 500 gems!");
      return;
    }
    setActiveTab(tab);
  };

  const handleSexReply = (replyId: number) => {
    if (sexStep >= sexResponses.length) return;

    const userReply = sexReplyOptions[sexStep]?.find((opt) => opt.id === replyId);
    let newUserMessage: Message | null = null;
    
    if (userReply) {
      newUserMessage = {
        id: Date.now(),
        sender: "user",
        text: userReply.text,
        timestamp: new Date(),
      };
      const updatedMessages = [...sexMessages, newUserMessage];
      setSexMessages(updatedMessages);
      
      // Track message sent
      trackMessageSent("riley");
    }

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        if (sexStep < sexResponses.length) {
          const response = sexResponses[sexStep];
          const newRileyMessage: Message = {
            id: Date.now() + 1,
            sender: "riley",
            text: response.text,
            timestamp: new Date(),
            photoId: response.photoId,
            options: sexReplyOptions[sexStep],
          };
          const updatedMessages = newUserMessage 
            ? [...sexMessages, newUserMessage, newRileyMessage]
            : [...sexMessages, newRileyMessage];
          setSexMessages(updatedMessages);
          const newStep = sexStep + 1;
          setSexStep(newStep);
        }
      }, 2000);
    }, 500);
  };

  const handleDateChoice = (choiceId: number) => {
    const scenario = dateScenarios[currentScenario];
    const choice = scenario.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: choice.text,
      timestamp: new Date(),
    };

    const outcomeMessage: Message = {
      id: Date.now() + 1,
      sender: "riley",
      text: choice.outcome,
      timestamp: new Date(),
    };

    const updatedMessages = [...dateMessages, userMessage, outcomeMessage];
    setDateMessages(updatedMessages);
    
    // Track message sent
    trackMessageSent("riley");

    const newHistory = [...dateChoiceHistory, choiceId];
    setDateChoiceHistory(newHistory);

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const nextScenarioIndex = currentScenario + 1;
        if (nextScenarioIndex < dateScenarios.length) {
          const nextScenario = dateScenarios[nextScenarioIndex];
          const nextMessage: Message = {
            id: Date.now() + 2,
            sender: "riley",
            text: `${nextScenario.scene}\n\n${nextScenario.text}`,
            timestamp: new Date(),
            options: nextScenario.choices,
          };
          const finalMessages = [...updatedMessages, nextMessage];
          setDateMessages(finalMessages);
          setCurrentScenario(nextScenarioIndex);
        } else {
          // Date completed - track achievement
          ProgressManager.quests.trackDateComplete("riley");
          
          const endMessage: Message = {
            id: Date.now() + 2,
            sender: "riley",
            text: "Our date was perfect, noob~ 💕\nYou're the best duo partner I've ever had.\nLet's do this again soon! 🎮",
            timestamp: new Date(),
          };
          const finalMessages = [...updatedMessages, endMessage];
          setDateMessages(finalMessages);
        }
      }, 2000);
    }, 500);
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-orange-500/30 bg-black/40 backdrop-blur-md fixed top-0 left-0 right-0 z-[200]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500">
              <img src={rileyAvatar} alt="Riley" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Riley "Ry" Harper</h1>
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
      <div className="bg-black/40 backdrop-blur-md border-b border-orange-500/20 px-4 pt-2 flex justify-center fixed top-[73px] left-0 right-0 z-[190]">
        <div className="flex max-w-4xl w-full gap-1">
          <button
            onClick={() => handleTabChange("main")}
            className={`flex-1 py-3 px-4 rounded-t-2xl text-sm font-bold transition-all duration-300 ${
              activeTab === "main"
                ? "bg-gradient-to-t from-orange-600 to-red-600 text-white shadow-[0_-4px_12px_rgba(234,88,12,0.3)]"
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:brightness-110"
            }`}
          >
            Main Story
          </button>
          <button
            onClick={() => handleTabChange("sex")}
            className={`flex-1 py-3 px-4 rounded-t-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === "sex"
                ? "bg-gradient-to-t from-red-600 to-pink-600 text-white shadow-[0_-4px_12px_rgba(220,38,38,0.3)]"
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

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full pt-[140px]">
        <div className="pb-20">
          {/* Main Chat Messages */}
          {activeTab === "main" && messages.map((msg) => (
            <div key={msg.id} className={`mb-6 flex ${msg.sender === "riley" ? "justify-start" : "justify-end"}`}>
              {msg.sender === "riley" && (
                <div className="flex items-start gap-3 max-w-[75%]">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-orange-500 flex-shrink-0">
                    <img src={rileyAvatar} alt="Riley" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    {msg.photoId && (
                      <div className="mb-2">
                        {(() => {
                          const photo = rileyPhotos.find((p) => p.id === msg.photoId);
                          if (!photo) return null;
                          const isUnlocked = photo.isFree || unlockedPhotos.includes(msg.photoId);
                          return (
                            <div className="relative rounded-2xl overflow-hidden max-w-xs">
                              <img
                                src={isUnlocked ? photo.fullUrl : photo.blurredUrl}
                                alt="Riley photo"
                                className={`w-full h-32 object-cover ${!isUnlocked ? "blur-[40px] brightness-50" : ""}`}
                              />
                              {!isUnlocked && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                  <button
                                    onClick={() => handleBuyPhoto(msg.photoId!, photo.price)}
                                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-bold hover:brightness-110 transition"
                                  >
                                    Buy ({photo.price} gems) 🔥
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    <div className="bg-purple-900/40 backdrop-blur-md rounded-2xl rounded-tl-none p-4 border border-purple-500/30">
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              )}

              {msg.sender === "user" && (
                <div className="flex items-start gap-3 max-w-[75%]">
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl rounded-tr-none p-4">
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

        {/* Sex Chat Messages */}
        {activeTab === "sex" && (
          <>
            {!sexChatUnlocked ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2">Sex Chatting Locked</h3>
                <p className="text-gray-400 mb-4">Unlock explicit content with Riley</p>
                <button
                  onClick={handleUnlockSexChat}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-full font-bold hover:brightness-110 transition"
                >
                  Unlock for 500 gems 🔥
                </button>
              </div>
            ) : (
              <>
                {sexMessages.length === 0 && (
                  <div className="text-center text-gray-400 mt-8">
                    <p>Sex Chatting unlocked! 🔥</p>
                    <p className="text-sm">Start the conversation below...</p>
                  </div>
                )}
                {sexMessages.map((msg) => (
                  <div key={msg.id} className={`mb-6 flex ${msg.sender === "riley" ? "justify-start" : "justify-end"}`}>
                    {msg.sender === "riley" && (
                      <div className="flex items-start gap-3 max-w-[75%]">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-orange-500 flex-shrink-0">
                          <img src={rileyAvatar} alt="Riley" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          {msg.photoId && (
                            <div className="mb-2">
                              {(() => {
                                const photo = rileyPhotos.find((p) => p.id === msg.photoId);
                                if (!photo) return null;
                                const isUnlocked = photo.isFree || unlockedPhotos.includes(msg.photoId);
                                return (
                                  <div className="relative rounded-2xl overflow-hidden max-w-xs">
                                    <img
                                      src={isUnlocked ? photo.fullUrl : photo.blurredUrl}
                                      alt="Riley photo"
                                      className={`w-full h-32 object-cover ${!isUnlocked ? "blur-[40px] brightness-50" : ""}`}
                                    />
                                    {!isUnlocked && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                        <button
                                          onClick={() => handleBuyPhoto(msg.photoId!, photo.price)}
                                          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-bold hover:brightness-110 transition"
                                        >
                                          Buy ({photo.price} gems) 🔥
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                          <div className="bg-red-900/40 backdrop-blur-md rounded-2xl rounded-tl-none p-4 border border-red-500/30">
                            <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    )}
                    {msg.sender === "user" && (
                      <div className="flex items-start gap-3 max-w-[75%]">
                        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl rounded-tr-none p-4">
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </>
        )}
    
        {/* Date Messages */}
        {activeTab === "date" && (
          <>
            {!dateUnlocked ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2">Date Mode Locked</h3>
                <p className="text-gray-400 mb-4">Unlock a romantic date with Riley</p>
                <button
                  onClick={handleUnlockDate}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:brightness-110 transition"
                >
                  Unlock for 500 gems 💕
                </button>
              </div>
            ) : (
              <>
                {dateMessages.map((msg) => (
                  <div key={msg.id} className={`mb-6 flex ${msg.sender === "riley" ? "justify-start" : "justify-end"}`}>
                    {msg.sender === "riley" && (
                      <div className="flex items-start gap-3 max-w-[75%]">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-orange-500 flex-shrink-0">
                          <img src={rileyAvatar} alt="Riley" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="bg-pink-900/40 backdrop-blur-md rounded-2xl rounded-tl-none p-4 border border-pink-500/30">
                            <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    )}
                    {msg.sender === "user" && (
                      <div className="flex items-start gap-3 max-w-[75%]">
                        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl rounded-tr-none p-4">
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </>        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-3 max-w-[75%] mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-orange-500 flex-shrink-0">
              <img src={rileyAvatar} alt="Riley" className="w-full h-full object-cover" />
            </div>
            <div className="bg-purple-900/40 backdrop-blur-md rounded-2xl rounded-tl-none p-4 border border-purple-500/30">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}
      
        <div ref={messagesEndRef} />
      </div>
    </main>

      {/* Reply Options (Fixed at bottom) */}
      {/* Main Chat Reply Options */}
      {activeTab === "main" && messages.length > 0 && messages[messages.length - 1].sender === "riley" && messages[messages.length - 1].options && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-purple-500/30 p-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs text-gray-400 mb-3 text-center">Choose your reply:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {messages[messages.length - 1].options!.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleReplySelect(option.id)}
                  disabled={selectedReply !== null}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedReply === option.id
                      ? "bg-orange-600 text-white"
                      : "bg-purple-900/50 hover:bg-purple-800 text-gray-200 border border-purple-500/30"
                  } ${selectedReply !== null && selectedReply !== option.id ? "opacity-50" : ""}`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sex Chat Reply Options */}
      {activeTab === "sex" && sexChatUnlocked && sexMessages.length > 0 && sexMessages[sexMessages.length - 1].sender === "riley" && sexMessages[sexMessages.length - 1].options && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-red-500/30 p-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs text-gray-400 mb-3 text-center">Choose your reply:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {sexMessages[sexMessages.length - 1].options!.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSexReply(option.id)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition bg-red-900/50 hover:bg-red-800 text-gray-200 border border-red-500/30"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Date Reply Options */}
      {activeTab === "date" && dateUnlocked && dateMessages.length > 0 && dateMessages[dateMessages.length - 1].sender === "riley" && dateMessages[dateMessages.length - 1].options && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-pink-500/30 p-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs text-gray-400 mb-3 text-center">Choose your response:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {dateMessages[dateMessages.length - 1].options!.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleDateChoice(option.id)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition bg-pink-900/50 hover:bg-pink-800 text-gray-200 border border-pink-500/30"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
