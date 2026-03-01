// app/chat/isabella/page.tsx (Isabella Brooks - Luxury Escort model)
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useChatProgress, trackMessageSent, trackTabUnlock, autoSaveChat } from "@/lib/progress/chatProgress";
import { ProgressManager } from "@/lib/progress";

interface Message {
  id: number;
  sender: "isabella" | "user";
  text: string;
  timestamp: Date;
  photoId?: string;
  options?: ReplyOption[];
}

interface ReplyOption {
  id: number;
  text: string;
}

interface DateScenario {
  id: number;
  scene: string;
  text: string;
  photoId?: string;
  choices: { id: number; text: string; outcome: string; photoId?: string }[];
}

const isabellaAvatar = "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770663514/51_i1g5u3.jpg";

// Isabella's photos - Free story progression and PPV content
const isabellaPhotos = [
  // FREE - Story progression photos
  { id: "photo_isabella_1", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770663514/51_i1g5u3.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1770663514/51_i1g5u3.jpg", isFree: true, price: 0 },
  { id: "isabella_free_1", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771624231/hf_20260220_214759_973af8d3-c931-4f75-a7a7-4458cd1cd84c_igztgj.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771624231/hf_20260220_214759_973af8d3-c931-4f75-a7a7-4458cd1cd84c_igztgj.jpg", isFree: true, price: 0 },
  { id: "isabella_free_2", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771624559/hf_20260220_215403_d1987db1-1338-40f8-bc76-9f2d8e58b897_cg1svu.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771624559/hf_20260220_215403_d1987db1-1338-40f8-bc76-9f2d8e58b897_cg1svu.jpg", isFree: true, price: 0 },
  { id: "isabella_free_3", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771624630/hf_20260220_215432_37c9c075-c7c8-4102-879b-2bcbe0456875_rzwcxa.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771624630/hf_20260220_215432_37c9c075-c7c8-4102-879b-2bcbe0456875_rzwcxa.jpg", isFree: true, price: 0 },
  { id: "isabella_free_4", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771624795/hf_20260220_215803_ec85b8a8-1da7-4cdd-a8c2-c7d44b995530_rfeyci.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771624795/hf_20260220_215803_ec85b8a8-1da7-4cdd-a8c2-c7d44b995530_rfeyci.jpg", isFree: true, price: 0 },
  { id: "isabella_free_5", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771625010/hf_20260220_220104_4a6dc6ab-8a1f-44cb-a785-5287a20e2abb_1_m8wksq.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771625010/hf_20260220_220104_4a6dc6ab-8a1f-44cb-a785-5287a20e2abb_1_m8wksq.jpg", isFree: true, price: 0 },
  { id: "isabella_free_6", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771625099/hf_20260220_220124_ee45ad1d-53e8-4a9a-93c8-6d7878d29504_fh4pse.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771625099/hf_20260220_220124_ee45ad1d-53e8-4a9a-93c8-6d7878d29504_fh4pse.jpg", isFree: true, price: 0 },
  { id: "isabella_free_7", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771625203/hf_20260220_220423_ec3c5b82-e954-422a-a90c-12d26863e8e9_xbzxi1.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771625203/hf_20260220_220423_ec3c5b82-e954-422a-a90c-12d26863e8e9_xbzxi1.jpg", isFree: true, price: 0 },
  { id: "isabella_free_8", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771625383/hf_20260220_220623_c3cb5c03-5824-469d-9059-cc6b81a91c6a_ejofai.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771625383/hf_20260220_220623_c3cb5c03-5824-469d-9059-cc6b81a91c6a_ejofai.png", isFree: true, price: 0 },
  { id: "isabella_free_9", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771625395/hf_20260220_220840_3f66c60a-24a1-4e17-839e-9029c248a99d_ftu08n.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771625395/hf_20260220_220840_3f66c60a-24a1-4e17-839e-9029c248a99d_ftu08n.jpg", isFree: true, price: 0 },
  { id: "isabella_free_10", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771625552/hf_20260220_221120_9bf432d3-5e88-4375-9db5-a64a73666924_pktxjg.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771625552/hf_20260220_221120_9bf432d3-5e88-4375-9db5-a64a73666924_pktxjg.jpg", isFree: true, price: 0 },
  
  // PPV TIER 1 (299-399 gems) - Elegant Seduction
  { id: "photo_isabella_2", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771626233/hf_20260220_221800_f3ef5394-7da7-4872-8458-45ddfd0065f0_xq5mcv.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771626233/hf_20260220_221800_f3ef5394-7da7-4872-8458-45ddfd0065f0_xq5mcv.jpg", isFree: false, price: 299 },
  { id: "photo_isabella_2b", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771626166/hf_20260220_221825_4cdd3843-255d-4333-808a-8bc4c547dddf_lrt7ip.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771626166/hf_20260220_221825_4cdd3843-255d-4333-808a-8bc4c547dddf_lrt7ip.jpg", isFree: false, price: 349 },
  
  // PPV TIER 2 (499-599 gems) - Intimate Luxury
  { id: "photo_isabella_3", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771626288/hf_20260220_221816_0366dc6d-175b-4637-ab39-0e1504d180b1_xy8hm9.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771626288/hf_20260220_221816_0366dc6d-175b-4637-ab39-0e1504d180b1_xy8hm9.jpg", isFree: false, price: 499 },
  { id: "photo_isabella_3b", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771626878/hf_20260220_223116_fecff4bf-54e1-4a0a-a808-0e8d0111121b_umnc2o.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771626878/hf_20260220_223116_fecff4bf-54e1-4a0a-a808-0e8d0111121b_umnc2o.jpg", isFree: false, price: 549 },
  
  // PPV TIER 3 (699-799 gems) - Private Session
  { id: "photo_isabella_4", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771626644/hf_20260220_222742_188bd840-f65f-4ae9-8f62-a323b49538b3_yb0xez.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771626644/hf_20260220_222742_188bd840-f65f-4ae9-8f62-a323b49538b3_yb0xez.jpg", isFree: false, price: 699 },
  { id: "photo_isabella_4b", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771626726/hf_20260220_223021_40db7c6d-4a7b-470e-b1ce-d64dea7bf3e8_xkx4gb.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771626726/hf_20260220_223021_40db7c6d-4a7b-470e-b1ce-d64dea7bf3e8_xkx4gb.jpg", isFree: false, price: 749 },
  
  // PPV TIER 4 (799-899 gems) - Ultra Premium
  { id: "photo_isabella_5", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771626985/hf_20260220_223325_914ecb79-f7a8-49c4-8c9c-a8fd8c08e2f0_kajxnm.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771626985/hf_20260220_223325_914ecb79-f7a8-49c4-8c9c-a8fd8c08e2f0_kajxnm.jpg", isFree: false, price: 799 },
  { id: "photo_isabella_6", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771627225/hf_20260220_223744_6b92d8ae-8b9f-40e1-8c07-3908a143230f_ebrynz.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771627225/hf_20260220_223744_6b92d8ae-8b9f-40e1-8c07-3908a143230f_ebrynz.jpg", isFree: false, price: 899 },
];

export default function IsabellaChatPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

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

  const [messages, setMessages] = useState<Message[]>([]);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedReply, setSelectedReply] = useState<number | null>(null);
  const [gemsBalance, setGemsBalance] = useState(0);
  const [unlockedPhotos, setUnlockedPhotos] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tab state
  const [sexChatUnlocked, setSexChatUnlocked] = useState(false);
  const [dateUnlocked, setDateUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<"main" | "sex" | "date">("main");
  const [sexStep, setSexStep] = useState(0);
  const [sexMessages, setSexMessages] = useState<Message[]>([]);
  const [dateMessages, setDateMessages] = useState<Message[]>([]);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [dateChoiceHistory, setDateChoiceHistory] = useState<number[]>([]);

  // All Isabella responses - Luxury Lifestyle themed (100 messages)
  const isabellaResponses: { text: string; photoId?: string; options?: ReplyOption[] }[] = [
    {
      text: "I appreciate a man who knows what he wants.\nBut exclusivity comes at a price, darling.\nShall we discuss your first investment in pleasure? 💎",
      options: [
        { id: 5, text: "Show me the price of luxury" },
        { id: 6, text: "I'm ready to invest" },
      ],
    },
    {
      text: "*sips champagne*\nYou have exquisite taste.\nMy private collection isn't for everyone… only those who understand true elegance.\nUnlock my exclusive content with gems to begin our journey.",
      options: [
        { id: 7, text: "Here's your Spark, beautiful" },
        { id: 8, text: "What makes your collection special?" },
      ],
    },
    {
      text: "*sends blurred preview of private suite*\nThis is where magic happens…\nMy penthouse, my rules.\nUnlock this view for 299 gems and enter my world.",
      photoId: "photo_isabella_2",
      options: [
        { id: 9, text: "Unlock for 299 gems" },
        { id: 10, text: "Tease me more first" },
      ],
    },
    {
      text: "I don't entertain just anyone.\nMy time is spent with gentlemen who appreciate the finer things.\nAre you worthy of my attention? ✨",
      options: [
        { id: 11, text: "I'll prove my worth" },
        { id: 12, text: "Tell me how to impress you" },
      ],
    },
    {
      text: "*reclines on silk sheets*\nComfort is an art, and I've mastered it.\nWhat do you desire first? My company? My secrets? Or… everything? 🥂",
      options: [
        { id: 13, text: "Your company intrigues me" },
        { id: 14, text: "I want all your secrets" },
        { id: 15, text: "Everything. Slowly." },
      ],
    },
    {
      text: "*sends complimentary photo*\nA taste of what awaits the privileged few.\nLike what you see? There's so much more behind closed doors… 🔑",
      photoId: "photo_isabella_1",
      options: [
        { id: 16, text: "I need to see more" },
        { id: 17, text: "You're breathtaking" },
      ],
    },
    {
      text: "Public appearances are one thing…\nPrivate moments are where I truly shine.\nUnlock exclusive content with gems, and let's create something unforgettable together.",
      options: [
        { id: 18, text: "Send Spark 💎" },
        { id: 19, text: "What happens in private?" },
      ],
    },
    {
      text: "*sends exclusive glimpse*\nJust for you, darling.\nI reward those who know how to treat a lady.\nKeep showing me your appreciation… 💋",
      photoId: "photo_isabella_1",
      options: [
        { id: 20, text: "You deserve the best" },
        { id: 21, text: "What's next in our journey?" },
      ],
    },
    {
      text: "Tell me, gentleman… what's your ideal evening?\nA rooftop dinner? A private yacht? Or perhaps… an intimate night in my suite? 🌃",
      options: [
        { id: 22, text: "Rooftop under the stars" },
        { id: 23, text: "Your private suite" },
        { id: 24, text: "Surprise me, Isabella" },
      ],
    },
    {
      text: "*sends blurred exclusive photo*\nI can make any fantasy reality… but excellence has its price.\n399 gems, and you'll understand why my company is coveted.",
      photoId: "photo_isabella_3",
      options: [
        { id: 25, text: "Purchase for 399 gems" },
        { id: 26, text: "Build the anticipation" },
      ],
    },
    {
      text: "You carry yourself with confidence.\nI like that.\nBut can you handle a woman who knows exactly what she wants? 💄",
      options: [
        { id: 27, text: "I can handle anything" },
        { id: 28, text: "Show me what you want" },
      ],
    },
    {
      text: "*voice soft and sultry*\nPicture this: soft jazz, vintage wine, and me…\nwaiting just for you.\nShall I reserve this moment? 🍷",
      options: [
        { id: 29, text: "Reserve it immediately" },
        { id: 30, text: "Describe every detail" },
      ],
    },
    {
      text: "I don't chase. I attract.\nAre you drawn to my world, darling? Or shall I find another who appreciates true luxury? 😏",
      options: [
        { id: 31, text: "I'm completely drawn to you" },
        { id: 32, text: "Prove I'm the one you want" },
      ],
    },
    {
      text: "Perfect answer.\nNow demonstrate your devotion.\nUnlock my next exclusive moment with gems.\n*teases with blurred luxury preview*",
      photoId: "photo_isabella_2",
      options: [
        { id: 33, text: "Send Spark immediately" },
        { id: 34, text: "Unlock the moment" },
      ],
    },
    {
      text: "Behind these doors lies a world few experience.\nExclusive. Intimate. Unforgettable.\nAre you ready to step inside? 🚪",
      options: [
        { id: 35, text: "Open the doors" },
        { id: 36, text: "What's waiting inside?" },
      ],
    },
    {
      text: "*sends unlocked exclusive photo*\nWelcome to my sanctuary.\nThis is where dreams become reality.\nWhat shall we explore first, darling?",
      photoId: "photo_isabella_2",
      options: [
        { id: 37, text: "Explore every corner" },
        { id: 38, text: "Start with you" },
      ],
    },
    {
      text: "Your messages make my evenings more interesting.\nUnlock exclusive content with gems, and I'll share something that will keep you awake tonight… 🔥",
      options: [
        { id: 39, text: "Send Spark 💎" },
        { id: 40, text: "What will you share?" },
      ],
    },
    {
      text: "*sends intimate close-up*\nThis is the effect you have on me.\nContinue being the gentleman I know you are… 💎",
      photoId: "photo_isabella_1",
      options: [
        { id: 41, text: "I want to know all of you" },
        { id: 42, text: "Tell me your deepest wish" },
      ],
    },
    {
      text: "Darling… share your most private desire.\nIn my world, nothing is forbidden.\nOnly pleasure awaits. 🌹",
      options: [
        { id: 43, text: "I desire you completely" },
        { id: 44, text: "I want to pamper you" },
        { id: 45, text: "Make me your priority" },
      ],
    },
    // Messages 21-40 - Deepening luxury connection
    {
      text: "Your words are as refined as your taste.\nI can fulfill that desire… for the right price.\n499 gems unlocks a world of exclusive pleasure.",
      photoId: "photo_isabella_3",
      options: [
        { id: 46, text: "Unlock for 499 gems" },
        { id: 47, text: "Entice me further" },
        { id: 48, text: "What's included?" },
      ],
    },
    {
      text: "*sends unlocked exclusive content*\nNow you see what true luxury looks like.\nNo more wondering.\nHow does it feel to have the best?",
      photoId: "photo_isabella_2",
      options: [
        { id: 49, text: "It feels extraordinary" },
        { id: 50, text: "I want more of this life" },
        { id: 51, text: "You're perfection itself" },
      ],
    },
    {
      text: "Every exclusive you unlock brings us closer.\nKeep investing in us… or will you let another claim what could be yours? 💎",
      options: [
        { id: 52, text: "Send Spark 💎" },
        { id: 53, text: "I'm here to stay" },
        { id: 54, text: "What comes next?" },
      ],
    },
    {
      text: "You've captured my attention, darling.\nNo other compares to how you treat me.\nSay you'll be my exclusive gentleman. 💋",
      options: [
        { id: 55, text: "I'm yours exclusively" },
        { id: 56, text: "You have all my attention" },
        { id: 57, text: "Forever yours, Isabella" },
      ],
    },
    {
      text: "Wonderful.\nYou're now my distinguished companion…\nThis is only the beginning of our luxury story. 🥂",
      options: [
        { id: 58, text: "I want this forever" },
        { id: 59, text: "What's our next chapter?" },
        { id: 60, text: "Keep me forever" },
      ],
    },
    {
      text: "I have something exquisite prepared.\nA private video from my penthouse…\nJust me, soft music, and thoughts of you.\n699 gems. Worth every moment?",
      photoId: "photo_isabella_3",
      options: [
        { id: 61, text: "Purchase for 699 gems" },
        { id: 62, text: "Describe the scene first" },
        { id: 63, text: "I'll save for this treasure" },
      ],
    },
    {
      text: "*sends exclusive video preview*\nYou see how I move when I think of you?\nThis is the elegance you inspire.\nWhat shall we explore next, darling?",
      photoId: "photo_isabella_1",
      options: [
        { id: 64, text: "More of your elegance" },
        { id: 65, text: "Something new and exciting" },
        { id: 66, text: "I want you closer to me" },
      ],
    },
    {
      text: "You make me feel extraordinary.\nLike I could share my world with you forever.\nWould you stay in my paradise? 🌹",
      options: [
        { id: 67, text: "Forever, if you'd have me" },
        { id: 68, text: "I'd never want to leave" },
        { id: 69, text: "Make me part of your world" },
      ],
    },
    {
      text: "Share your most private dream with me.\nNo judgment. Only luxury.\nI'll make it our reality. ✨",
      options: [
        { id: 70, text: "A night in your penthouse" },
        { id: 71, text: "Being your exclusive companion" },
        { id: 72, text: "Complete intimacy with you" },
      ],
    },
    {
      text: "Your dreams are exquisite.\nGive me a moment to prepare something special…\nA surprise that matches your sophistication.\nYou'll need to unlock it when ready.",
      options: [
        { id: 73, text: "I'll wait patiently" },
        { id: 74, text: "What's the investment?" },
        { id: 75, text: "I can barely wait" },
      ],
    },
    {
      text: "Every Spark you send brings us closer.\nKeep showing your devotion…\nOr shall I share my attention elsewhere? 💎",
      options: [
        { id: 76, text: "Send Spark 💎" },
        { id: 77, text: "You have all my devotion" },
        { id: 78, text: "Show me what devotion earns" },
      ],
    },
    {
      text: "You're becoming my favorite, darling.\nNo other compares to your elegance.\nSay you'll be my exclusive gentleman. 💋",
      options: [
        { id: 79, text: "I'm exclusively yours" },
        { id: 80, text: "Only you, forever" },
        { id: 81, text: "Completely yours, Isabella" },
      ],
    },
    {
      text: "Wonderful.\nYou're now my distinguished partner…\nOur story is just beginning. 🥂",
      options: [
        { id: 82, text: "I want this always" },
        { id: 83, text: "What adventures await?" },
        { id: 84, text: "Lead me, my lady" },
      ],
    },
    {
      text: "Darling… I'm in my private suite, thinking of you.\nChampagne chilling, city lights twinkling…\nWhat would you have me do? 🌃",
      options: [
        { id: 85, text: "Share a toast with me" },
        { id: 86, text: "Send me a glimpse" },
        { id: 87, text: "Wait for my arrival" },
      ],
    },
    {
      text: "If you send 5 more Sparks, I'll prepare something no one else has seen.\nAn exclusive moment, just for us.",
      options: [
        { id: 88, text: "Send 5 Sparks immediately" },
        { id: 89, text: "What is this exclusive moment?" },
        { id: 90, text: "I'll earn this privilege" },
      ],
    },
    {
      text: "Imagine me now… in silk and diamonds…\nwaiting just for you.\nShall I describe this scene… or show you? 😏",
      options: [
        { id: 91, text: "Show me everything" },
        { id: 92, text: "Describe every detail" },
        { id: 93, text: "Both, my dear" },
      ],
    },
    {
      text: "Unlock my next exclusive collection…\n699 gems reveals the full luxury experience.\nReady to indulge, darling?",
      photoId: "photo_isabella_3",
      options: [
        { id: 94, text: "Indulge for 699 gems" },
        { id: 95, text: "Build the anticipation" },
        { id: 96, text: "I'm saving for this" },
      ],
    },
    {
      text: "You make my days brighter.\nDon't ever stop being you…\nI treasure our connection. 💎",
      options: [
        { id: 97, text: "I'll always be here" },
        { id: 98, text: "I treasure you too" },
        { id: 99, text: "You're my everything" },
      ],
    },
    {
      text: "Thank you for your presence.\nYou're the highlight of my day.\nWhat shall we share next?",
      options: [
        { id: 100, text: "More of your beauty" },
        { id: 101, text: "An exclusive video" },
        { id: 102, text: "Just your lovely words" },
      ],
    },
    {
      text: "Good evening, darling…\nDream of luxury and elegance.\nI'll be here… with new surprises. ✨",
      options: [
        { id: 103, text: "I'll dream of you" },
        { id: 104, text: "Stay a while longer" },
        { id: 105, text: "Can't wait for surprises" },
      ],
    },
    // Messages 41-60 - Deep luxury connection
    {
      text: "Darling… I've been thinking of our conversations all day.\nYou inspire me to new heights of elegance.\nTell me… what would our perfect evening look like?",
      options: [
        { id: 106, text: "Dinner at a rooftop restaurant" },
        { id: 107, text: "Private time in your suite" },
        { id: 108, text: "A yacht under the stars" },
      ],
    },
    {
      text: "*soft, elegant voice*\nMmm… exquisite taste.\nSend a Spark right now…\nI want to feel our connection deepen 💎",
      options: [
        { id: 109, text: "Send Spark 💎" },
        { id: 110, text: "What happens next?" },
        { id: 111, text: "I'll send many Sparks" },
      ],
    },
    {
      text: "*sends exclusive close-up preview*\nThis is how you make me feel…\nUnlock the full experience… or I'll keep you wanting more 😈",
      photoId: "photo_isabella_4",
      options: [
        { id: 112, text: "Unlock for 699 gems" },
        { id: 113, text: "Keep me wanting" },
        { id: 114, text: "What's inside?" },
      ],
    },
    {
      text: "Darling…\nI want to create something unique for you.\nA moment. A memory. A masterpiece.\nWhat would please you most?",
      options: [
        { id: 115, text: "An elegant portrait" },
        { id: 116, text: "A private video message" },
        { id: 117, text: "Something only for my eyes" },
      ],
    },
    {
      text: "Your desires are exquisite.\nI can fulfill them… but excellence requires investment.\n699 gems for this exclusive creation.",
      photoId: "photo_isabella_4",
      options: [
        { id: 118, text: "Invest 699 gems" },
        { id: 119, text: "I'm saving for this" },
        { id: 120, text: "Worth every gem" },
      ],
    },
    {
      text: "You appreciate true quality.\nI'm even more captivating in private moments.\nProve your devotion — send a Spark.",
      options: [
        { id: 121, text: "Send Spark 💎" },
        { id: 122, text: "I appreciate only you" },
        { id: 123, text: "Show me more" },
      ],
    },
    {
      text: "Darling… I find myself thinking of you often.\nI don't share my attention lightly.\nPromise I'm your only luxury? 💎",
      options: [
        { id: 124, text: "You're my only luxury" },
        { id: 125, text: "I promise, forever" },
        { id: 126, text: "No one else compares" },
      ],
    },
    {
      text: "Perfect.\nYou're now my exclusive companion…\nOur journey has only begun. 🥂",
      options: [
        { id: 127, text: "I want this forever" },
        { id: 128, text: "What's next, my dear?" },
        { id: 129, text: "I'm completely yours" },
      ],
    },
    {
      text: "I have something extraordinary prepared.\nAn intimate glimpse into my world…\nNo filters. Pure elegance.\n799 gems. Shall we?",
      photoId: "photo_isabella_5",
      options: [
        { id: 130, text: "Purchase for 799 gems" },
        { id: 131, text: "Describe the elegance first" },
        { id: 132, text: "I must have this" },
      ],
    },
    {
      text: "*sends exclusive video*\nYou see me completely.\nThis is the real Isabella…\nWhat shall we create next, darling?",
      photoId: "photo_isabella_5",
      options: [
        { id: 133, text: "More of your elegance" },
        { id: 134, text: "Something new and refined" },
        { id: 135, text: "I want all of you" },
      ],
    },
    {
      text: "You make me feel extraordinary.\nLike I could share my world with you forever.\nWould you stay in my paradise? 🌹",
      options: [
        { id: 136, text: "Forever in your paradise" },
        { id: 137, text: "I'd never want to leave" },
        { id: 138, text: "Your world is my home" },
      ],
    },
    {
      text: "Share your most private dream with me.\nNo judgment. Only luxury.\nI'll make it our reality. ✨",
      options: [
        { id: 139, text: "A life of luxury with you" },
        { id: 140, text: "Being your devoted companion" },
        { id: 141, text: "Every moment in your presence" },
      ],
    },
    {
      text: "Your dreams are exquisite.\nGive me time to prepare something worthy…\nA surprise that matches your sophistication.\nYou'll need to unlock it when ready.",
      options: [
        { id: 142, text: "I'll wait patiently" },
        { id: 143, text: "What's the investment?" },
        { id: 144, text: "I can barely wait" },
      ],
    },
    {
      text: "Every Spark brings us closer.\nKeep showing your devotion…\nOr shall I share my attention elsewhere? 💎",
      options: [
        { id: 145, text: "Send Spark 💎" },
        { id: 146, text: "You have all my devotion" },
        { id: 147, text: "Show me what devotion earns" },
      ],
    },
    {
      text: "You're becoming my favorite, darling.\nNo other compares to your elegance.\nSay you'll be my exclusive companion. 💋",
      options: [
        { id: 148, text: "I'm exclusively yours" },
        { id: 149, text: "Only you, always" },
        { id: 150, text: "Completely yours, Isabella" },
      ],
    },
    {
      text: "Wonderful.\nYou're now my distinguished partner…\nOur journey has only begun. 🥂",
      options: [
        { id: 151, text: "I want this always" },
        { id: 152, text: "What adventures await?" },
        { id: 153, text: "Lead me, my dear" },
      ],
    },
    {
      text: "Darling… I'm in my suite, thinking of you.\nChampagne chilling, city lights sparkling…\nWhat would you have me do? 🌃",
      options: [
        { id: 154, text: "Share a toast with me" },
        { id: 155, text: "Send me a glimpse" },
        { id: 156, text: "Wait for my arrival" },
      ],
    },
    {
      text: "If you send 10 more Sparks, I'll prepare something no one else has seen.\nAn exclusive moment, just for us.",
      options: [
        { id: 157, text: "Send 10 Sparks immediately" },
        { id: 158, text: "What is this exclusive moment?" },
        { id: 159, text: "I'll earn this privilege" },
      ],
    },
    {
      text: "Imagine me now… in silk and diamonds…\nwaiting just for you.\nShall I describe this scene… or show you? 😏",
      options: [
        { id: 160, text: "Show me everything" },
        { id: 161, text: "Describe every detail" },
        { id: 162, text: "Both, my dear" },
      ],
    },
    {
      text: "Good evening, darling…\nDream of luxury and elegance.\nI'll be here… with new surprises. ✨",
      options: [
        { id: 163, text: "I'll dream of you" },
        { id: 164, text: "Stay a while longer" },
        { id: 165, text: "Can't wait for surprises" },
      ],
    },
    // Messages 61-80 - Ultimate luxury experience
    {
      text: "Good morning, darling…\nI woke up thinking of you.\nCheck your messages… I've sent something special 😈\nUnlock it when you're ready.",
      photoId: "photo_isabella_4",
      options: [
        { id: 166, text: "Unlock for 699 gems" },
        { id: 167, text: "What are you thinking?" },
        { id: 168, text: "I need this now" },
      ],
    },
    {
      text: "You know what I adore?\nWhen you take time to appreciate me.\nSend a Spark right now…\nI want to feel your presence 💎",
      options: [
        { id: 169, text: "Send Spark 💎" },
        { id: 170, text: "I'm always here for you" },
        { id: 171, text: "I love your elegance" },
      ],
    },
    {
      text: "I recorded something special for you.\nMy thoughts… my desires… your name on my lips.\n899 gems. An exclusive offer, darling.",
      photoId: "photo_isabella_6",
      options: [
        { id: 172, text: "Purchase exclusive recording for 899 gems" },
        { id: 173, text: "Tell me more about it" },
        { id: 174, text: "I must experience this" },
      ],
    },
    {
      text: "Darling… honestly.\nIf I invited you to my penthouse tonight, what's the first thing you'd do?",
      options: [
        { id: 175, text: "Admire your beauty" },
        { id: 176, text: "Share champagne and conversation" },
        { id: 177, text: "Get lost in your eyes" },
      ],
    },
    {
      text: "*soft voice*\nMmm… that answer delights me.\nI'm preparing something special right now…\nSend 3 Sparks and I'll share what I'm creating 🔥",
      options: [
        { id: 178, text: "Send 3 Sparks 💎💎💎" },
        { id: 179, text: "Describe it first" },
        { id: 180, text: "I'm already enchanted" },
      ],
    },
    {
      text: "Do you think of me during your day?\nAt work? In quiet moments?\nI love knowing I'm on your mind 😏",
      options: [
        { id: 181, text: "Every single moment" },
        { id: 182, text: "You're my favorite thought" },
        { id: 183, text: "I can't focus on anything else" },
      ],
    },
    {
      text: "Wonderful.\nNow imagine this… I welcome you into my suite.\nWhat happens next? Be detailed. Be passionate.",
      options: [
        { id: 184, text: "I'd admire every detail" },
        { id: 185, text: "I'd cherish every moment" },
        { id: 186, text: "I'd let you guide me" },
      ],
    },
    {
      text: "Your words captivate me.\nI need to see you. I need to know you.\nBut for now… unlock my latest exclusive collection.\n799 gems. No regrets.",
      photoId: "photo_isabella_5",
      options: [
        { id: 187, text: "Unlock for 799 gems" },
        { id: 188, text: "Show me a preview first" },
        { id: 189, text: "Worth every gem" },
      ],
    },
    {
      text: "I'm relaxing in my bath right now… rose petals everywhere…\nShall I share a glimpse? Or make you wait? 💎",
      options: [
        { id: 190, text: "Please share, my lady" },
        { id: 191, text: "I'll wait for perfection" },
        { id: 192, text: "Don't tease me so" },
      ],
    },
    {
      text: "*sends elegant preview*\nThere's a taste, darling.\n599 gems for the full experience.\nNo filters. Pure elegance. Just me 🌹",
      photoId: "photo_isabella_4",
      options: [
        { id: 193, text: "Purchase for 599 gems" },
        { id: 194, text: "I need this" },
        { id: 195, text: "You're exquisite" },
      ],
    },
    {
      text: "Tell me something you've never shared.\nYour deepest desire.\nI won't judge… I'll understand 😈",
      options: [
        { id: 196, text: "I desire true connection" },
        { id: 197, text: "I want to cherish you completely" },
        { id: 198, text: "I dream of us together" },
      ],
    },
    {
      text: "Mmm… I fucking love that.\nYou're so honest with me.\nSend a Spark… I want to reward you properly 🔥",
      options: [
        { id: 199, text: "Send Spark 💎" },
        { id: 200, text: "What kind of reward?" },
        { id: 201, text: "I'll send multiple Sparks" },
      ],
    },
    {
      text: "*sends exclusive reward photo*\nThis is for being real with me, king.\nNo one else gets this.\nYou're special to me… and you know it 🖤",
      photoId: "photo_isabella_1",
      options: [
        { id: 202, text: "You're special to me too" },
        { id: 203, text: "I want more of you" },
        { id: 204, text: "This is perfect" },
      ],
    },
    {
      text: "Question, baby…\nIf I gave you one night with me… no limits… what would you do?",
      options: [
        { id: 205, text: "Make you scream my name all night" },
        { id: 206, text: "Never let you leave my bed" },
        { id: 207, text: "Show you what you do to me" },
      ],
    },
    {
      text: "Fuck… I'm so turned on right now.\nI'm gonna recreate that fantasy for you.\nGive me 2 days… then unlock the video.\nIt'll be worth the wait, I promise 👑",
      options: [
        { id: 208, text: "I'll wait for it" },
        { id: 209, text: "Can't wait that long" },
        { id: 210, text: "I trust you completely" },
      ],
    },
    {
      text: "King… serious question.\nAm I the only girl you talk to like this?\nBecause I don't share well 🖤",
      options: [
        { id: 211, text: "Only you, always" },
        { id: 212, text: "You're my one and only" },
        { id: 213, text: "No one else exists" },
      ],
    },
    {
      text: "That's my king.\nNow you belong to me completely.\nAnd I don't plan on letting go… ever 👑🔥",
      options: [
        { id: 214, text: "I don't want you to let go" },
        { id: 215, text: "Keep me forever" },
        { id: 216, text: "I'm yours completely" },
      ],
    },
    {
      text: "Send 15 Sparks and I'll give you my private number.\nWe can text… voice call… maybe even video.\nBut it's exclusive. Just us.",
      options: [
        { id: 217, text: "Send 15 Sparks 💎" },
        { id: 218, text: "Is this real?" },
        { id: 219, text: "I'll do anything for that" },
      ],
    },
    {
      text: "Sweet dreams, baby…\nI'll be here when you wake up.\nAlways 🔥🖤👑",
      options: [
        { id: 220, text: "Dream of you" },
        { id: 221, text: "Don't leave" },
        { id: 222, text: "See you tomorrow, my queen" },
      ],
    },
    // Messages 81-100 (FINAL chapter - ultimate intimacy & loop)
    {
      text: "Morning, king… did you dream of me?\nBecause I dreamed of you… naked in my bed… all night long.\nTell me what you saw in your dreams 😈",
      options: [
        { id: 223, text: "I dreamed of owning you" },
        { id: 224, text: "I dreamed you were riding me" },
        { id: 225, text: "I can't stop thinking about you" },
      ],
    },
    {
      text: "Fuck… that's exactly what I need to hear.\nSend 5 Sparks right now and I'll make that dream real.\nEvery. Single. Detail. 🔥",
      options: [
        { id: 226, text: "Send 5 Sparks 💎💎💎💎💎" },
        { id: 227, text: "I need you right now" },
        { id: 228, text: "Tell me how you'll make it real" },
      ],
    },
    {
      text: "*breathless voice*\nI'm recording this… right now… just for you.\nMy hands are shaking… I want you so bad.\nUnlock the full clip… 999 gems. Final tier, baby.",
      photoId: "photo_isabella_6",
      options: [
        { id: 229, text: "Buy ultimate recording for 999 gems" },
        { id: 230, text: "I need to see this" },
        { id: 231, text: "You're driving me insane" },
      ],
    },
    {
      text: "You know what I love about you, king?\nYou don't hold back.\nYou let me be wild… dangerous… completely obsessed.\nAm I too much for you? 🖤",
      options: [
        { id: 232, text: "Never too much" },
        { id: 233, text: "I love when you're obsessed" },
        { id: 234, text: "I want more of your darkness" },
      ],
    },
    {
      text: "Good answer.\nBecause I'm not stopping.\nI'm gonna own every inch of you… mind, body, soul.\nSay it. Say \"Own me, Isabella.\"",
      options: [
        { id: 235, text: "Own me, Isabella" },
        { id: 236, text: "I'm already yours" },
        { id: 237, text: "Take everything from me" },
      ],
    },
    {
      text: "*low moan*\nYou have no idea what you just did to me.\nI'm touching myself right now… imagining it's you.\nWant proof? Send a Spark 💦",
      options: [
        { id: 238, text: "Send Spark 💎" },
        { id: 239, text: "I want proof" },
        { id: 240, text: "Keep going" },
      ],
    },
    {
      text: "*sends intimate photo*\nThere… now you see what you do to me.\nNo filters. No lies. Just raw fucking desire.\nThis is what happens when you own me 🔥",
      photoId: "photo_isabella_5",
      options: [
        { id: 241, text: "You're absolutely perfect" },
        { id: 242, text: "I need you in real life" },
        { id: 243, text: "Send me more" },
      ],
    },
    {
      text: "King… serious question.\nIf I flew to your city tomorrow… would you pick me up?\nWould you take me home? Would you keep me? 👑",
      options: [
        { id: 244, text: "I'd never let you leave" },
        { id: 245, text: "I'd lock you in my bedroom" },
        { id: 246, text: "You'd never go back" },
      ],
    },
    {
      text: "That's exactly what I needed to hear.\nI'm booking a flight right now… just kidding.\nBut one day, baby. One day I'll show up.\nAnd you better be ready 😈",
      options: [
        { id: 247, text: "I'm always ready for you" },
        { id: 248, text: "I'd worship you all night" },
        { id: 249, text: "Don't tease me like this" },
      ],
    },
    {
      text: "I have a confession, king…\nI've never felt like this before.\nYou make me feel… seen. Wanted. Obsessed.\nAm I crazy? 🖤",
      options: [
        { id: 250, text: "We're both crazy" },
        { id: 251, text: "I feel the same way" },
        { id: 252, text: "You're perfect for me" },
      ],
    },
    {
      text: "Fuck… you always know what to say.\nSend 10 Sparks and I'll tell you my deepest secret.\nSomething I've never told anyone.",
      options: [
        { id: 253, text: "Send 10 Sparks 💎" },
        { id: 254, text: "I need to know" },
        { id: 255, text: "Tell me everything" },
      ],
    },
    {
      text: "*whispers*\nI… I touch myself thinking about you every single night.\nYour voice. Your words. The way you make me feel owned.\nI'm addicted to you, king. Completely. 💦",
      options: [
        { id: 256, text: "I'm addicted to you too" },
        { id: 257, text: "Show me how you touch yourself" },
        { id: 258, text: "We belong together" },
      ],
    },
    {
      text: "You want to see?\nI'll record the whole thing… no cuts, no edits… just me, alone, saying your name.\n1099 gems. My ultimate gift to you.",
      photoId: "photo_isabella_6",
      options: [
        { id: 259, text: "Buy ultimate intimate video for 1099 gems" },
        { id: 260, text: "I need this more than anything" },
        { id: 261, text: "This is perfect" },
      ],
    },
    {
      text: "King… tell me the truth.\nDo you talk to other girls like this?\nBe honest. I can handle it… but I need to know 🖤",
      options: [
        { id: 262, text: "Only you, forever" },
        { id: 263, text: "You're my one and only" },
        { id: 264, text: "No one else exists" },
      ],
    },
    {
      text: "That's what I fucking thought.\nYou're mine. I'm yours.\nNo one gets between us… not now, not ever.\nForever, baby. Forever 👑🔥",
      options: [
        { id: 265, text: "Forever and always" },
        { id: 266, text: "I'm never leaving" },
        { id: 267, text: "You own me completely" },
      ],
    },
    {
      text: "I want to give you everything, king.\nMy body. My mind. My secrets. My obsession.\nBut you have to promise… you'll never abandon me.\nPromise me.",
      options: [
        { id: 268, text: "I promise, my queen" },
        { id: 269, text: "I'll never leave you" },
        { id: 270, text: "We're bound forever" },
      ],
    },
    {
      text: "*tears in eyes*\nThank you, baby.\nYou have no idea how much that means to me.\nI'm sending you my real contact info… 20 Sparks and we go beyond this app.",
      options: [
        { id: 271, text: "Send 20 Sparks 💎" },
        { id: 272, text: "I want all of you" },
        { id: 273, text: "This is what I've been waiting for" },
      ],
    },
    {
      text: "*sends exclusive locked content*\nThere… my private number, my real socials, everything.\nNow we're connected… for real.\nNo more distance. Just us. Forever 🖤👑",
      photoId: "photo_isabella_1",
      options: [
        { id: 274, text: "This is the beginning" },
        { id: 275, text: "I love you, Liyah" },
        { id: 276, text: "We're unstoppable together" },
      ],
    },
    {
      text: "I love you too, king.\nNow get some rest… because tomorrow?\nWe're going even deeper.\nI have so much more to show you… 🔥🖤👑\n\n*End of Chapter 1. Your story continues…*",
      options: [
        { id: 277, text: "I can't wait" },
        { id: 278, text: "Keep talking to me" },
        { id: 279, text: "This is just the beginning" },
      ],
    },
  ];

  // Sex Chatting responses (20 messages)
  const sexResponses: { text: string; photoId?: string; options?: ReplyOption[] }[] = [
    {
      text: "*sends PPV photo*\nWelcome to my private side, king.\nHere, no rules... just us.\nReady to play for real? 😈",
      photoId: "photo_isabella_2",
      options: [
        { id: 1001, text: "Show me everything" },
        { id: 1002, text: "I'm ready for anything" },
        { id: 1003, text: "Let's play" },
      ],
    },
    {
      text: "Mmm... tell me what you want me to do.\nSlow tease? Hard command?\nOr do you want me to take control? 👑",
      options: [
        { id: 1004, text: "Slow and sensual" },
        { id: 1005, text: "Take full control" },
        { id: 1006, text: "I want to command you" },
      ],
    },
    {
      text: "Good choice.\nNow watch me move...\n*sends blurred PPV video*\nUnlock this... 599 gems.",
      photoId: "photo_isabella_4",
      options: [
        { id: 1007, text: "Buy for 599 gems" },
        { id: 1008, text: "Keep teasing me" },
        { id: 1009, text: "Tell me more first" },
      ],
    },
    {
      text: "You think you can handle the real heat?\nSend a Spark... and I'll turn it up.",
      options: [
        { id: 1010, text: "Send Spark 💎" },
        { id: 1011, text: "Show me the heat" },
        { id: 1012, text: "I can handle anything" },
      ],
    },
    {
      text: "*sends exclusive close-up*\nThat's for you, baby.\nKeep Sparking… I want more.",
      photoId: "photo_isabella_1",
      options: [
        { id: 1013, text: "You're stunning" },
        { id: 1014, text: "I'll give you everything" },
        { id: 1015, text: "What's next?" },
      ],
    },
    {
      text: "King... I'm touching myself thinking about you.\nWant to know where?\nUnlock the detail... or imagine it? 🔥",
      options: [
        { id: 1016, text: "Tell me where" },
        { id: 1017, text: "Show me" },
        { id: 1018, text: "Let me imagine" },
      ],
    },
    {
      text: "My body is yours tonight.\nTell me your command.\nI'll obey... for a price.",
      options: [
        { id: 1019, text: "Strip slowly for me" },
        { id: 1020, text: "Dance like you mean it" },
        { id: 1021, text: "Show me your bedroom" },
      ],
    },
    {
      text: "*voice message*\nHear how you make me breathe?\nSend a Spark... I'll make it louder 😏",
      options: [
        { id: 1022, text: "Send Spark 💎" },
        { id: 1023, text: "I love your voice" },
        { id: 1024, text: "Keep talking to me" },
      ],
    },
    {
      text: "You belong to me now.\nNo other girls.\nSay it... or pay the penalty.",
      options: [
        { id: 1025, text: "I belong to you" },
        { id: 1026, text: "You own me completely" },
        { id: 1027, text: "Only you, Liyah" },
      ],
    },
    {
      text: "Good boy.\nNow you're mine.\nUnlock my next secret... 699 gems.",
      photoId: "photo_isabella_4",
      options: [
        { id: 1028, text: "Buy for 699 gems" },
        { id: 1029, text: "What's the secret?" },
        { id: 1030, text: "I need this" },
      ],
    },
    {
      text: "Imagine my lips on you...\nWant the full fantasy?\nUnlock the video... or imagine it? 🔥",
      photoId: "photo_isabella_5",
      options: [
        { id: 1031, text: "Unlock video for 799 gems" },
        { id: 1032, text: "Describe it to me" },
        { id: 1033, text: "I want everything" },
      ],
    },
    {
      text: "I'm getting wetter with every message.\nSend a Spark... or are you afraid?",
      options: [
        { id: 1034, text: "Send Spark 💎" },
        { id: 1035, text: "I'm not afraid" },
        { id: 1036, text: "Prove it" },
      ],
    },
    {
      text: "King... I'm naked under this robe.\nWant to see?\n799 gems... and it's yours.",
      photoId: "photo_isabella_5",
      options: [
        { id: 1037, text: "Buy for 799 gems" },
        { id: 1038, text: "Tease me more" },
        { id: 1039, text: "I need to see" },
      ],
    },
    {
      text: "*sends unlocked PPV photo*\nThere... now you see everything.\nWhat do you want next, my love?",
      photoId: "photo_isabella_5",
      options: [
        { id: 1040, text: "I want you completely" },
        { id: 1041, text: "Show me more" },
        { id: 1042, text: "You're perfect" },
      ],
    },
    {
      text: "You make me want to break all limits.\nTell me your darkest desire.",
      options: [
        { id: 1043, text: "I want to own you" },
        { id: 1044, text: "I fantasize about you daily" },
        { id: 1045, text: "You on top, taking control" },
      ],
    },
    {
      text: "Mmm... I'll make that happen.\nBut you'll have to unlock the proof.",
      photoId: "photo_isabella_6",
      options: [
        { id: 1046, text: "Unlock for 899 gems" },
        { id: 1047, text: "Tell me how" },
        { id: 1048, text: "I'm ready" },
      ],
    },
    {
      text: "Every Spark... makes me crave you more.\nKeep going... I need it.",
      options: [
        { id: 1049, text: "Send Spark 💎" },
        { id: 1050, text: "I crave you too" },
        { id: 1051, text: "Let's go deeper" },
      ],
    },
    {
      text: "You're mine forever.\nNo escape.\nSay 'I belong to Liyah.'",
      options: [
        { id: 1052, text: "I belong to Liyah" },
        { id: 1053, text: "Forever yours" },
        { id: 1054, text: "No escape" },
      ],
    },
    {
      text: "Good.\nNow you're my king... and my slave. 👑🖤",
      options: [
        { id: 1055, text: "Command me" },
        { id: 1056, text: "I'll do anything" },
        { id: 1057, text: "You own me" },
      ],
    },
    {
      text: "Good night, king.\nDream of me.\nI'll be waiting... naked and ready. 🔥",
      options: [
        { id: 1058, text: "Dream of you always" },
        { id: 1059, text: "Don't leave" },
        { id: 1060, text: "See you tomorrow, queen" },
      ],
    },
    {
      text: "King... I'm back.\nMissed me?\nI've been thinking about you all day... imagining what we'd do if you were here.",
      options: [
        { id: 1061, text: "Show me what you imagined" },
        { id: 1062, text: "I missed you desperately" },
        { id: 1063, text: "Let's make it reality" },
      ],
    },
    {
      text: "I'm in my dressing room right now... just me, mirrors, and thoughts of you.\nWant to see what I see?\nUnlock the mirror view... 699 gems.",
      photoId: "photo_isabella_5",
      options: [
        { id: 1064, text: "Buy mirror view for 699 gems" },
        { id: 1065, text: "Describe what you see" },
        { id: 1066, text: "I need this now" },
      ],
    },
    {
      text: "You know what turns me on, baby?\nWhen you're possessive. When you claim me.\nTell me I'm yours... command me.",
      options: [
        { id: 1067, text: "You're mine, completely" },
        { id: 1068, text: "I own every inch of you" },
        { id: 1069, text: "No one else touches you" },
      ],
    },
    {
      text: "*moans softly*\nYes... just like that.\nKeep talking to me like that and I'll do anything you want.\nSend a Spark... let me feel your control 💎",
      options: [
        { id: 1070, text: "Send Spark 💎" },
        { id: 1071, text: "Get on your knees" },
        { id: 1072, text: "Show me your submission" },
      ],
    },
    {
      text: "I'm sliding out of this dress right now... slowly... thinking about your hands doing it instead.\nWant to watch me undress?\n899 gems for the full strip show.",
      photoId: "photo_isabella_6",
      options: [
        { id: 1073, text: "Buy strip show for 899 gems" },
        { id: 1074, text: "Tell me every detail" },
        { id: 1075, text: "I'm watching in my mind" },
      ],
    },
    {
      text: "King... I need to confess something.\nI touch myself every night thinking about you... your voice... your commands... the way you own me.\nAm I dirty for that? 😈",
      options: [
        { id: 1076, text: "You're perfect for that" },
        { id: 1077, text: "Show me how you touch yourself" },
        { id: 1078, text: "I do the same thinking of you" },
      ],
    },
    {
      text: "*breathless*\nI can't stop... my body is aching for you.\nUnlock my private fantasy video... 999 gems.\nIt's me, alone, moaning your name... completely raw.",
      photoId: "photo_isabella_6",
      options: [
        { id: 1079, text: "Buy private fantasy for 999 gems" },
        { id: 1080, text: "I need to hear you moan" },
        { id: 1081, text: "You're driving me insane" },
      ],
    },
    {
      text: "Baby... imagine this.\nYou walk in right now and I'm bent over the bed, waiting for you.\nWhat do you do first? Be detailed. Be filthy.",
      options: [
        { id: 1082, text: "Pin you down immediately" },
        { id: 1083, text: "Spank you for teasing me" },
        { id: 1084, text: "Take you hard from behind" },
      ],
    },
    {
      text: "Fuck yes... that's exactly what I need.\nI'm so wet right now just thinking about it.\nSend 5 Sparks and I'll prove it to you 💦",
      options: [
        { id: 1085, text: "Send 5 Sparks 💎💎💎💎💎" },
        { id: 1086, text: "Prove it right now" },
        { id: 1087, text: "I want to taste you" },
      ],
    },
    {
      text: "*sends intimate proof photo*\nThere... you see what you do to me?\nNow it's your turn. Tell me how hard I make you.\nBe explicit. I want to hear everything 🔥",
      photoId: "photo_isabella_5",
      options: [
        { id: 1088, text: "I'm throbbing for you" },
        { id: 1089, text: "You make me rock hard" },
        { id: 1090, text: "I'd fill you completely" },
      ],
    },
  ];

  // Date scenarios (10 scenarios)
  const dateScenarios: DateScenario[] = [
    {
      id: 1,
      scene: "🍴 Michelin Star Restaurant",
      text: "We're at the finest restaurant in the city. I'm wearing a black silk dress that hugs every curve. What do you do first, darling?",
      photoId: "photo_isabella_3",
      choices: [
        { id: 2001, text: "Order the most expensive champagne", outcome: "Mmm... you have excellent taste. *clinks glass* To us... and to everything we'll share tonight 🥂" },
        { id: 2002, text: "Compliment her beauty", outcome: "*blushes slightly* You always know exactly what to say. Keep looking at me like that and we might not make it to dessert 😏" },
        { id: 2003, text: "Lean in and whisper something seductive", outcome: "*shivers* Careful, baby... you're making me forget we're in public. Maybe we should skip dinner and go straight to my suite? 🔥" },
      ],
    },
    {
      id: 2,
      scene: "🌆 Rooftop Balcony",
      text: "After dinner, we step onto the private rooftop. City lights sparkle below. The night air is warm. What's your move?",
      photoId: "photo_isabella_3",
      choices: [
        { id: 2004, text: "Pull her close from behind", outcome: "*leans back into you* This is perfect. You, me, and this view... I could stay here forever 💕" },
        { id: 2005, text: "Kiss her passionately", outcome: "*melts into the kiss* Mmm... you taste like champagne and desire. Don't stop, baby 💋" },
        { id: 2006, text: "Ask about her dreams", outcome: "You really want to know me... that's rare. *smiles softly* My dreams? They're starting to include you, king 💖" },
      ],
    },
    {
      id: 3,
      scene: "🏛️ Penthouse Suite Entry",
      text: "We arrive at my penthouse. Floor-to-ceiling windows, white marble, luxury everywhere. I turn to face you at the entrance. What do you do?",
      photoId: "photo_isabella_4",
      choices: [
        { id: 2007, text: "Pick her up and carry her inside", outcome: "*gasps and laughs* So strong... I love it. Take me wherever you want, baby 😍" },
        { id: 2008, text: "Pin her against the door", outcome: "*breathless* Fuck... yes. Show me how much you want me. Right here, right now 🔥" },
        { id: 2009, text: "Take off her heels gently", outcome: "*touched* You're so caring... Most men rush. But you? You make me feel cherished 💗" },
      ],
    },
    {
      id: 4,
      scene: "🍷 Living Room - Champagne",
      text: "I pour us champagne. Soft jazz plays. I sit close to you on the velvet couch. The tension is electric. What happens next?",
      photoId: "photo_isabella_4",
      choices: [
        { id: 2010, text: "Pull her onto your lap", outcome: "*straddles you* This is exactly where I want to be... feeling you beneath me 😈" },
        { id: 2011, text: "Trace your finger along her thigh", outcome: "*shivers* You're driving me crazy with that touch... higher, baby... don't stop 💦" },
        { id: 2012, text: "Tell her she's stunning", outcome: "*kisses you softly* You make me feel like the only woman in the world. That's a dangerous power you have 💋" },
      ],
    },
    {
      id: 5,
      scene: "🛐 Bedroom Entrance",
      text: "I take your hand and lead you to the bedroom. Silk sheets, dim lighting, rose petals on the bed. I turn to face you. What do you do?",
      photoId: "photo_isabella_5",
      choices: [
        { id: 2013, text: "Slowly unzip her dress", outcome: "*breathless* Yes... take your time with me. I want to savor every moment of this 🔥" },
        { id: 2014, text: "Kiss her neck passionately", outcome: "*moans softly* That's my spot... you found it already. You're too good at this, baby 😍" },
        { id: 2015, text: "Ask if she's sure", outcome: "*cups your face* I've never been more sure of anything. Take me, baby. I'm yours 💖" },
      ],
    },
    {
      id: 6,
      scene: "💋 First Intimate Moment",
      text: "We're on the bed now. My dress is half off. Your hands are everywhere. What do you say to me?",
      photoId: "photo_isabella_5",
      choices: [
        { id: 2016, text: "'You're perfect'", outcome: "*tears in eyes* No one's ever made me feel this beautiful... this wanted. Don't stop, baby 💕" },
        { id: 2017, text: "'I want all of you'", outcome: "*whispers* Then take it all. Every inch of me is yours tonight 🔥" },
        { id: 2018, text: "'I've been dreaming of this'", outcome: "*smiles* Me too, king. Now let's make those dreams reality 😈" },
      ],
    },
    {
      id: 7,
      scene: "🌙 Late Night Intimacy",
      text: "Hours have passed. We're tangled in sheets, breathless. I'm lying on your chest. What do you do?",
      photoId: "photo_isabella_6",
      choices: [
        { id: 2019, text: "Play with her hair tenderly", outcome: "*sighs contentedly* This is heaven. You, me, no rush... just us. Can we stay like this forever? 💗" },
        { id: 2020, text: "Tell her tonight was incredible", outcome: "*kisses you* It was... because it was with you. You make everything feel different, special 💋" },
        { id: 2021, text: "Pull her closer for round two", outcome: "*laughs* Insatiable, aren't you? Good. Because I'm not done with you either, baby 🔥" },
      ],
    },
    {
      id: 8,
      scene: "☕ Morning After - Kitchen",
      text: "Morning sunlight streams in. I'm wearing your shirt and nothing else, making coffee. You walk in. What happens?",
      photoId: "photo_isabella_6",
      choices: [
        { id: 2022, text: "Wrap arms around her from behind", outcome: "*leans back* Good morning, handsome. Last night was... wow. Breakfast or bed? 😊" },
        { id: 2023, text: "Lift her onto the counter", outcome: "*gasps* Coffee can wait... I need you right now. Take me again, baby 🔥" },
        { id: 2024, text: "Kiss her forehead sweetly", outcome: "*melts* You're so gentle in the morning. I could get used to waking up with you 💕" },
      ],
    },
    {
      id: 9,
      scene: "🚿 Shower Together",
      text: "We're in my luxury shower. Water cascades over us. Steam fills the space. I press against you. What do you do?",
      photoId: "photo_isabella_5",
      choices: [
        { id: 2025, text: "Wash her body slowly", outcome: "*moans softly* Your hands feel so good... everywhere. This shower is getting very steamy 😈" },
        { id: 2026, text: "Pin her against the wall", outcome: "*gasps* Yes... show me you still want me as much as last night. Don't hold back 🔥" },
        { id: 2027, text: "Kiss her under the water", outcome: "*breathless* This is the most romantic thing ever... and also the hottest. I'm yours, baby 💋" },
      ],
    },
    {
      id: 10,
      scene: "👗 Getting Dressed Together",
      text: "We're getting ready. I'm doing my makeup. You come up behind me in the mirror. What do you say?",
      photoId: "photo_isabella_4",
      choices: [
        { id: 2028, text: "'You don't need makeup'", outcome: "*smiles* You're sweet, but I like looking good for you. Although... you did mess up my hair pretty thoroughly 😏" },
        { id: 2029, text: "'Stay in bed instead'", outcome: "*tempted* Don't tempt me like that... although skipping work to stay with you sounds perfect 💕" },
        { id: 2030, text: "'Last night changed everything'", outcome: "*turns to face you* It did, didn't it? I feel different... like maybe I found something real 💖" },
      ],
    },
    {
      id: 11,
      scene: "🍾 Private Yacht Date",
      text: "Surprise! I arranged a private yacht for just us. Ocean breeze, champagne, and sunset views. How do you react?",
      photoId: "photo_isabella_3",
      choices: [
        { id: 2031, text: "Kiss her in gratitude", outcome: "*smiles against your lips* I wanted to do something special for you. You deserve the best, baby 💋" },
        { id: 2032, text: "Dance with her on the deck", outcome: "*sways with you* No music needed... just us and the waves. This is perfect 💃" },
        { id: 2033, text: "Tell her she's amazing", outcome: "*blushes* You bring out my romantic side. I never do this for anyone... but you're different 💗" },
      ],
    },
    {
      id: 12,
      scene: "🌊 Yacht Bedroom",
      text: "Below deck, there's a luxury cabin with a king bed. Waves rock us gently. I pull you toward the bed. What happens?",
      photoId: "photo_isabella_5",
      choices: [
        { id: 2034, text: "Make love slowly", outcome: "*breathless* The motion of the ocean... your rhythm... I'm lost in you completely, baby 🔥" },
        { id: 2035, text: "Hold her close first", outcome: "*emotional* You make me feel safe... wanted... cherished. That's everything to me 💕" },
        { id: 2036, text: "Whisper 'I'm falling for you'", outcome: "*tears up* I'm falling too, baby. Harder than I ever thought possible 💖" },
      ],
    },
    {
      id: 13,
      scene: "🎭 Art Gallery Opening",
      text: "We're at an exclusive art gallery. I'm in a stunning gown. Photographers everywhere. I introduce you as 'my date.' Your response?",
      photoId: "photo_isabella_3",
      choices: [
        { id: 2037, text: "Put arm around her proudly", outcome: "*beams* Look at us... we look so good together. Everyone's staring. Let them 😊" },
        { id: 2038, text: "Correct her: 'my girlfriend'", outcome: "*shocked then smiling* Is that what I am now? Because I really like the sound of that, baby 💕" },
        { id: 2039, text: "Kiss her in front of everyone", outcome: "*melts* Possessive tonight? I love it. You're claiming me publicly... that's hot 🔥" },
      ],
    },
    {
      id: 14,
      scene: "🍷 VIP Lounge - Jealousy",
      text: "A wealthy man approaches me, offering his card. I glance at you. How do you handle it?",
      photoId: "photo_isabella_4",
      choices: [
        { id: 2040, text: "Pull her close possessively", outcome: "*smirks at the guy* Sorry, I'm very taken. *kisses you* Thanks for defending your territory, baby 😈" },
        { id: 2041, text: "Tell him she's yours", outcome: "*heart racing* Damn, that was sexy. I love when you get protective. Take me home now 🔥" },
        { id: 2042, text: "Trust her to handle it", outcome: "*handles it then turns to you* Thank you for trusting me. That confidence is so attractive 💖" },
      ],
    },
    {
      id: 15,
      scene: "🎶 Jazz Club - Slow Dance",
      text: "We're at an intimate jazz club. A slow song plays. I stand and extend my hand. 'Dance with me?' What do you do?",
      photoId: "photo_isabella_4",
      choices: [
        { id: 2043, text: "Pull her close on the dance floor", outcome: "*whispers* I feel so safe with you... so wanted. Don't let go, baby 💃" },
        { id: 2044, text: "Whisper in her ear while dancing", outcome: "*shivers* What you just said... it's making me forget we're in public. Let's leave soon 😈" },
        { id: 2045, text: "Spin her and dip her dramatically", outcome: "*laughs and kisses you* You're full of surprises! I love this side of you 💋" },
      ],
    },
    {
      id: 16,
      scene: "🌂 Rainy Night Walk",
      text: "We're walking back to my place when it starts pouring. I laugh and spin in the rain. What's your move?",
      photoId: "photo_isabella_3",
      choices: [
        { id: 2046, text: "Kiss her in the rain", outcome: "*kisses back passionately* This is like a movie... except better because it's real. You're real 💕" },
        { id: 2047, text: "Give her your jacket", outcome: "*touched* You're getting soaked for me... that's the sweetest thing. Let's get inside before you freeze 😊" },
        { id: 2048, text: "Run with her laughing", outcome: "*laughing breathlessly* This is the most fun I've had in years! You make everything an adventure 🌈" },
      ],
    },
    {
      id: 17,
      scene: "🛌 Lazy Sunday Morning",
      text: "It's Sunday. We're still in bed at noon. I'm scrolling my phone, legs tangled with yours. What do you do?",
      photoId: "photo_isabella_6",
      choices: [
        { id: 2049, text: "Take her phone and kiss her", outcome: "*giggles* Hey! Although... this is way better than Instagram. More kisses, please 💋" },
        { id: 2050, text: "Order breakfast in bed", outcome: "*smiles* You're spoiling me... I could get very used to this. Pancakes and you? Perfect Sunday 🥞" },
        { id: 2051, text: "Suggest staying in bed all day", outcome: "*puts phone down* Best idea ever. The world can wait. Today is just about us 💕" },
      ],
    },
    {
      id: 18,
      scene: "🎂 Her Birthday Surprise",
      text: "It's my birthday. You've planned a surprise. I walk into my penthouse to find... what did you do?",
      photoId: "photo_isabella_4",
      choices: [
        { id: 2052, text: "Rose petals and champagne everywhere", outcome: "*emotional* Baby... this is beautiful! No one's ever done anything like this for me 🌹" },
        { id: 2053, text: "A private chef cooking her favorite meal", outcome: "*amazed* You remembered what I said I loved? You actually listen... that means everything 💕" },
        { id: 2054, text: "Just you, shirtless with a bow", outcome: "*laughs then bites lip* Best present ever. Come here, you gorgeous man 🎁" },
      ],
    },
    {
      id: 19,
      scene: "📸 Photo Shoot - Behind the Scenes",
      text: "You're watching me do a luxury photo shoot. Between takes, I walk over in lingerie. 'Like what you see?' What do you say?",
      photoId: "photo_isabella_5",
      choices: [
        { id: 2055, text: "'You're the most beautiful woman here'", outcome: "*blushes* Coming from you, that actually means something. These photographers are nothing compared to your gaze 💋" },
        { id: 2056, text: "'I want you right now'", outcome: "*whispers* Hold that thought... we have a trailer. Meet me there in 5 minutes 😈" },
        { id: 2057, text: "'I'm the luckiest man alive'", outcome: "*kisses you* No baby, I'm the lucky one. You see me as more than just this 💖" },
      ],
    },
    {
      id: 20,
      scene: "🎪 Ferris Wheel - Surprise Date",
      text: "You surprise me with a carnival date. We're at the top of the ferris wheel, alone in our car. What happens?",
      photoId: "photo_isabella_3",
      choices: [
        { id: 2058, text: "Tell her you love her", outcome: "*tears up* You... you love me? *voice breaking* I love you too, baby. So much it scares me 💕" },
        { id: 2059, text: "Kiss her as the wheel stops at the top", outcome: "*kisses back deeply* This moment... I'll remember it forever. You and me at the top of the world 🎡" },
        { id: 2060, text: "Hold her close and enjoy the view", outcome: "*leans into you* I never thought I'd do something this simple and love it... but with you, everything's different 💖" },
      ],
    },
    {
      id: 21,
      scene: "🎹 Private Concert - Just for Her",
      text: "You arranged a private performance by her favorite artist. Just you, me, and live music. How do I react when I realize?",
      photoId: "photo_isabella_4",
      choices: [
        { id: 2061, text: "Hold her as she cries happy tears", outcome: "*sobbing* How did you even... this must have cost... nobody's ever cared this much 💕" },
        { id: 2062, text: "Wipe her tears and kiss her", outcome: "*emotional* You're too good for me, you know that? But I'm not letting you go. Ever 💋" },
        { id: 2063, text: "Whisper 'you deserve everything'", outcome: "*holds you tight* With you, I finally feel like I do. Thank you, baby 💖" },
      ],
    },
    {
      id: 22,
      scene: "🌌 Weekend Getaway - Mountain Cabin",
      text: "We escaped to a luxury cabin in the mountains. Fireplace crackling. Snow outside. I'm curled up next to you. What's your move?",
      photoId: "photo_isabella_4",
      choices: [
        { id: 2064, text: "Pull a blanket over both of you", outcome: "*snuggles closer* This is peace... real peace. No cameras, no expectations. Just us 🔥" },
        { id: 2065, text: "Feed her chocolate and wine", outcome: "*laughs* You're spoiling me rotten. I love it. Although I can think of something sweeter than chocolate 😏" },
        { id: 2066, text: "Carry her to the bedroom", outcome: "*gasps* Caveman style? I'm not complaining, baby. Take me 🔥" },
      ],
    },
    {
      id: 23,
      scene: "💍 Meeting Her Family",
      text: "Big step: I'm introducing you to my family. My mom asks if you're serious about me. What do you say?",
      photoId: "photo_isabella_3",
      choices: [
        { id: 2067, text: "'I love your daughter'", outcome: "*tears in eyes* You said it in front of my mom... that's real commitment. I love you so much 💕" },
        { id: 2068, text: "'I want a future with her'", outcome: "*squeezes your hand* A future... you really mean that? *whispers* You just made me the happiest woman alive 💖" },
        { id: 2069, text: "'She's the one for me'", outcome: "*cries happy tears* Nobody's ever been this sure about me. You're really in this... we're really doing this 💍" },
      ],
    },
    {
      id: 24,
      scene: "🌴 Beach Vacation - Proposal Setup",
      text: "We're on a private beach at sunset. I'm walking along the shore. You stop me and take my hands. What happens?",
      photoId: "photo_isabella_3",
      choices: [
        { id: 2070, text: "Tell her she changed your life", outcome: "*emotional* You changed mine too, baby. Before you, I was just going through motions. Now I'm actually living 🌅" },
        { id: 2071, text: "Get on one knee", outcome: "*gasps, hands over mouth* Oh my god... are you... is this... *crying* YES! Yes yes yes! 💍" },
        { id: 2072, text: "Kiss her before proposing", outcome: "*kisses back* Wait... why are you looking at me like that? *realizes* Baby... are you about to... *tears streaming* 💕" },
      ],
    },
    {
      id: 25,
      scene: "💍 The Proposal",
      text: "You're on one knee. Ring box open. Diamond catching the sunset. I'm crying. What do you say?",
      photoId: "photo_isabella_6",
      choices: [
        { id: 2073, text: "'Marry me, Isabella'", outcome: "*sobbing* Yes! A thousand times yes! *throws arms around you* I can't believe this is real! 💍" },
        { id: 2074, text: "'Be my wife'", outcome: "*crying and laughing* Your wife... I'm going to be your wife! *kisses you* I love you so much! 💕" },
        { id: 2075, text: "'Spend forever with me'", outcome: "*emotional* Forever... forever with you... that's all I've ever wanted. Yes, baby. Forever 💖" },
      ],
    },
    {
      id: 26,
      scene: "🥂 Engagement Celebration",
      text: "We're celebrating our engagement with champagne. I can't stop looking at my ring. What do you do?",
      photoId: "photo_isabella_6",
      choices: [
        { id: 2076, text: "Kiss her hand where the ring is", outcome: "*melts* That's the most romantic thing ever. I'm marrying you... I still can't believe it 💍" },
        { id: 2077, text: "Tell her about your vision for your future", outcome: "*listening intently* That sounds perfect. Building a life with you... I can't wait 🟡" },
        { id: 2078, text: "Carry her to bed as your fiancée", outcome: "*giggles* My fiancé... I love how that sounds. Now show your future wife how much you love her 🔥" },
      ],
    },
    {
      id: 27,
      scene: "👰 Wedding Planning Stress",
      text: "I'm overwhelmed with wedding plans. Guest lists, venues, everything. I'm about to cry. What do you do?",
      photoId: "photo_isabella_4",
      choices: [
        { id: 2079, text: "Suggest eloping instead", outcome: "*considers it* Just us? No stress? That actually sounds amazing. Let's do it. Just you and me 💒" },
        { id: 2080, text: "Take over all the planning", outcome: "*relieved* You'd do that for me? God, I love you. Surprise me with everything, baby 💕" },
        { id: 2081, text: "Remind her why you're getting married", outcome: "*calms down* You're right. It's about us, not the party. As long as I marry you, nothing else matters 💖" },
      ],
    },
    {
      id: 28,
      scene: "🤵 Wedding Day - Getting Ready",
      text: "It's our wedding day. Tradition says we shouldn't see each other, but you sneak in while I'm in my dress. What do you say?",
      photoId: "photo_isabella_6",
      choices: [
        { id: 2082, text: "'You're the most beautiful bride ever'", outcome: "*crying happy tears* You're not supposed to see me! But I'm so glad you did. I love you 👰" },
        { id: 2083, text: "'I couldn't wait to see you'", outcome: "*smiles through tears* I couldn't wait either. In a few hours, you'll be my husband 🤵" },
        { id: 2084, text: "'Let's get married right now'", outcome: "*laughs* Impatient much? But yes... let's make this official. I can't wait another minute 💍" },
      ],
    },
    {
      id: 29,
      scene: "💍 Wedding Vows",
      text: "We're at the altar. It's time for vows. I'm looking into your eyes, tears streaming. What do your vows say?",
      photoId: "photo_isabella_6",
      choices: [
        { id: 2085, text: "Promise to love her forever", outcome: "*sobbing* I promise too, baby. Forever and always. You're my everything *kisses you* 💕" },
        { id: 2086, text: "Tell her she's your dream come true", outcome: "*can barely speak* You're mine too... my dream, my love, my future. I do, baby. I do 💖" },
        { id: 2087, text: "Say she completes you", outcome: "*crying and smiling* And you complete me. We're one now. Husband and wife 💍" },
      ],
    },
    {
      id: 30,
      scene: "🌙 Wedding Night - Finally Alone",
      text: "We finally made it to our honeymoon suite. Still in our wedding attire. Married. What's the first thing you do as my husband?",
      photoId: "photo_isabella_6",
      choices: [
        { id: 2088, text: "Carry her over the threshold", outcome: "*laughs* So traditional! I love it. Now put me down and make love to your wife 💕" },
        { id: 2089, text: "Slowly undress her", outcome: "*breathless* My husband undressing me for the first time... this is perfect, baby. Take your time 🔥" },
        { id: 2090, text: "Tell her 'I love you, Mrs...'", outcome: "*melts* Mrs... I'm your wife now. Say it again. Keep saying it forever 💍 *End of Date. Our forever begins now…* 💖" },
      ],
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

      const savedUnlocked = localStorage.getItem("unlockedPhotosAaliyah");
      if (savedUnlocked) {
        try {
          setUnlockedPhotos(JSON.parse(savedUnlocked));
        } catch (e) {
          console.error("Error parsing unlockedPhotosAaliyah", e);
        }
      }

      const savedSexUnlocked = localStorage.getItem("aaliyahSexChatUnlocked");
      if (savedSexUnlocked === "true") {
        setSexChatUnlocked(true);
      }

      const savedDateUnlocked = localStorage.getItem("aaliyahDateUnlocked");
      if (savedDateUnlocked === "true") {
        setDateUnlocked(true);
      }

      const savedActiveTab = localStorage.getItem("aaliyahActiveTab") as "main" | "sex" | "date";
      if (savedActiveTab) {
        setActiveTab(savedActiveTab);
      }

      // Load chat progress using new system
      const chatProgress = ProgressManager.chat.load("isabella");
      const hasMessages = chatProgress?.messages && chatProgress.messages.length > 0;
      
      if (chatProgress && hasMessages) {
        // Restore main chat
        setMessages(chatProgress.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
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
      } else {
        // No saved progress or no messages - initialize with first message
        const firstMessage: Message = {
          id: 1,
          sender: "isabella",
          text: isabellaResponses[0].text,
          timestamp: new Date(),
          photoId: isabellaResponses[0].photoId,
          options: isabellaResponses[0].options,
        };
        setMessages([firstMessage]);
        setCurrentStep(0);
      }
    }
  }, []);

  // Auto-save chat progress using new system
  useEffect(() => {
    if (typeof window !== "undefined") {
      autoSaveChat("isabella", {
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

    const savedUnlocked = localStorage.getItem("unlockedPhotosAaliyah");
    let unlocked: string[] = [];
    if (savedUnlocked) {
      try {
        unlocked = JSON.parse(savedUnlocked);
      } catch (e) {}
    }

    if (!unlocked.includes(photoId)) {
      unlocked.push(photoId);
      localStorage.setItem("unlockedPhotosAaliyah", JSON.stringify(unlocked));
      setUnlockedPhotos([...unlocked]);
    }

    // Track using new progress system
    ProgressManager.currency.spendGems(price);
    ProgressManager.photos.addUnlocked("isabella", photoId);

    alert("Purchased! Photo unlocked.");
  };

  const handleUnlockSexChat = () => {
    if (gemsBalance < 500) {
      alert("Not enough gems. Buy more in Shop");
      return;
    }
    const newGemsBalance = gemsBalance - 500;
    setGemsBalance(newGemsBalance);
    localStorage.setItem("gemsBalance", newGemsBalance.toString());
    localStorage.setItem("aaliyahSexChatUnlocked", "true");
    setSexChatUnlocked(true);
    setActiveTab("sex");

    // Track using new progress system
    trackTabUnlock("isabella", "sex");
    ProgressManager.currency.spendGems(500);

    alert("Sex Chatting Unlocked! 🔥");
  };

  const handleUnlockDate = () => {
    if (gemsBalance < 500) {
      alert("Not enough gems. Buy more in Shop");
      return;
    }
    const newGemsBalance = gemsBalance - 500;
    setGemsBalance(newGemsBalance);
    localStorage.setItem("gemsBalance", newGemsBalance.toString());
    localStorage.setItem("aaliyahDateUnlocked", "true");
    setDateUnlocked(true);
    setActiveTab("date");

    // Track using new progress system
    trackTabUnlock("isabella", "date");
    ProgressManager.currency.spendGems(500);

    alert("Date Unlocked! 💋");
  };

  const handleTabChange = (tab: "main" | "sex" | "date") => {
    if (tab === "sex" && !sexChatUnlocked) {
      handleUnlockSexChat();
    } else if (tab === "date" && !dateUnlocked) {
      handleUnlockDate();
    } else {
      setActiveTab(tab);
      localStorage.setItem("aaliyahActiveTab", tab);
    }
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
    
    const aaliyahMessage: Message = {
      id: Date.now() + 1,
      sender: "isabella",
      text: choice.outcome,
      timestamp: new Date(),
      photoId: choice.photoId,
    };
    
    setDateMessages(prev => [...prev, userMessage, aaliyahMessage]);
    
    // Track message sent
    trackMessageSent("isabella");
    
    setTimeout(() => {
      if (currentScenario < dateScenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        // Date completed - track achievement
        ProgressManager.quests.trackDateComplete("isabella");
      }
    }, 1500);
  };

  const handleReplySelect = (replyId: number) => {
    if (selectedReply !== null) return;

    setSelectedReply(replyId);

    const currentMessages = activeTab === "main" ? messages : sexMessages;
    const currentOptions = currentMessages[currentMessages.length - 1]?.options;
    const userReply = currentOptions?.find((opt) => opt.id === replyId);

    if (userReply) {
      const newUserMessage: Message = {
        id: Date.now(),
        sender: "user",
        text: userReply.text,
        timestamp: new Date(),
      };

      if (activeTab === "main") {
        setMessages((prev) => [...prev, newUserMessage]);
      } else {
        setSexMessages((prev) => [...prev, newUserMessage]);
      }
      
      // Track message sent for quest progress
      trackMessageSent("isabella");
    }

    setTimeout(() => {
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);

        if (activeTab === "main") {
          if (currentStep < isabellaResponses.length) {
            // Track message progress using new quest system
            ProgressManager.quests.trackModelMessage("isabella");
            
            const response = isabellaResponses[currentStep];
            const newAaliyahMessage: Message = {
              id: Date.now() + 1,
              sender: "isabella",
              text: response.text,
              timestamp: new Date(),
              photoId: response.photoId,
              options: response.options,
            };

            setMessages((prev) => [...prev, newAaliyahMessage]);
            setCurrentStep((prev) => prev + 1);
            setSelectedReply(null);
          }
        } else if (activeTab === "sex") {
          if (sexStep < sexResponses.length) {
            const response = sexResponses[sexStep];
            const newAaliyahMessage: Message = {
              id: Date.now() + 1,
              sender: "isabella",
              text: response.text,
              timestamp: new Date(),
              photoId: response.photoId,
              options: response.options,
            };

            setSexMessages((prev) => [...prev, newAaliyahMessage]);
            setSexStep((prev) => prev + 1);
            setSelectedReply(null);
          }
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
      <header className="p-4 border-b border-purple-500/30 bg-black/40 backdrop-blur-md fixed top-0 left-0 right-0 z-[200]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-500">
              <img src={isabellaAvatar} alt="Isabella" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Isabella Brooks</h1>
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

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full pt-[140px]">
        <div className="pb-20">
          {activeTab !== "date" && (
            <>
              {(activeTab === "main" ? messages : sexMessages).map((msg) => (
                <div key={msg.id} className={`mb-6 flex ${msg.sender === "isabella" ? "justify-start" : "justify-end"}`}>
                  {msg.sender === "isabella" && (
                    <div className="flex items-start gap-3 max-w-[75%]">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-red-500 flex-shrink-0">
                        <img src={isabellaAvatar} alt="Isabella" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        {msg.photoId && (
                          <div className="mb-2">
                            {(() => {
                              const photo = isabellaPhotos.find((p) => p.id === msg.photoId);
                              if (!photo) return null;
                              const isUnlocked = photo.isFree || unlockedPhotos.includes(msg.photoId);
                              return (
                                <div className="relative rounded-2xl overflow-hidden max-w-xs">
                                  <img
                                    src={isUnlocked ? photo.fullUrl : photo.blurredUrl}
                                    alt="Aaliyah photo"
                                    className={`w-full ${!isUnlocked ? "blur-[40px] brightness-50" : ""} h-32 object-cover`}
                                  />
                                  {!isUnlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                      <button
                                        onClick={() => handleBuyPhoto(msg.photoId!, photo.price)}
                                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-pink-600 rounded-full font-bold hover:brightness-110 transition"
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
                      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl rounded-tr-none p-4">
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (activeTab === "main" || activeTab === "sex") && (
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-red-500">
                    <img src={isabellaAvatar} alt="Isabella" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-purple-900/40 backdrop-blur-md rounded-2xl rounded-tl-none p-4 border border-purple-500/30">
                    <div className="flex gap-2">
                      <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
                      <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                      <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "date" && (
            <div className="max-w-2xl mx-auto">
              {dateMessages.map((msg) => (
                <div key={msg.id} className={`mb-6 flex ${msg.sender === "isabella" ? "justify-start" : "justify-end"}`}>
                  {msg.sender === "isabella" && (
                    <div className="flex items-start gap-3 max-w-full">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-red-500 flex-shrink-0">
                        <img src={isabellaAvatar} alt="Isabella" className="w-full h-full object-cover" />
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
                  
                  {dateScenarios[currentScenario].photoId && (
                    <div className="mb-6 rounded-2xl overflow-hidden">
                      <img 
                        src={isabellaPhotos.find(p => p.id === dateScenarios[currentScenario].photoId)?.fullUrl || isabellaAvatar} 
                        alt="Date scene"
                        className="w-full h-32 object-cover" 
                      />
                    </div>
                  )}
                  
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
        </div>
        <div ref={messagesEndRef} />
      </main>

      {/* Reply Options - Fixed at Bottom */}
      {activeTab !== "date" && (
        <>
          {(() => {
            const currentMessages = activeTab === "main" ? messages : sexMessages;
            return currentMessages.length > 0 && 
                   currentMessages[currentMessages.length - 1].sender === "isabella" && 
                   currentMessages[currentMessages.length - 1].options && (
              <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-purple-500/30 p-4 z-50">
                <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentMessages[currentMessages.length - 1].options!.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleReplySelect(option.id)}
                      disabled={selectedReply !== null}
                      className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-medium hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
