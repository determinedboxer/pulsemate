// app/chat/aaliyah/page.tsx (Aaliyah "Liyah" - Exotic Dancer/Fitness Model)
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useChatProgress, trackMessageSent, trackTabUnlock, autoSaveChat } from "@/lib/progress/chatProgress";
import { ProgressManager } from "@/lib/progress";
import { useSupabase } from "@/components/SupabaseProvider";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";

interface Message {
  id: number;
  sender: "aaliyah" | "user";
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

const aaliyahAvatar = "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497563/Isabella1_pvijrq.png";

const aaliyahPhotos = [
  // Main Avatar & FREE Chat Photos
  { id: "aaliyah_main", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497563/Isabella1_pvijrq.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497563/Isabella1_pvijrq.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_1", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497352/Aaliyah1_c2mitb.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497352/Aaliyah1_c2mitb.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_4", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497336/Aaliyah4_qebaax.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497336/Aaliyah4_qebaax.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_7", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497393/Aaliyah7_asspas.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497393/Aaliyah7_asspas.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_9", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497403/Aaliyah9_lc8qci.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497403/Aaliyah9_lc8qci.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_10", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497395/Aaliyah10_xm10da.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497395/Aaliyah10_xm10da.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_12", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497368/Aaliyah12_spntjh.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497368/Aaliyah12_spntjh.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_13", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497396/Aaliyah13_l81xd2.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497396/Aaliyah13_l81xd2.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_15", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497448/Aaliyah15_ciakdi.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497448/Aaliyah15_ciakdi.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_17", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497438/Aaliyah17_vajctw.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497438/Aaliyah17_vajctw.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_19", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497462/Aaliyah19_rvlbxp.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497462/Aaliyah19_rvlbxp.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_38", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497556/Isabella4_mlnyfp.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497556/Isabella4_mlnyfp.jpg", isFree: true, price: 0 },
  
  // PPV Sex Chat Photos
  { id: "aaliyah_photo_26", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497515/Aaliyah26_pevxsp.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771497515/Aaliyah26_pevxsp.png", isFree: false, price: 299 },
  { id: "aaliyah_photo_27", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497524/Aaliyah27_mr88bi.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771497524/Aaliyah27_mr88bi.png", isFree: false, price: 299 },
  { id: "aaliyah_photo_28", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497534/Aaliyah28_ngzqz1.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771497534/Aaliyah28_ngzqz1.png", isFree: false, price: 399 },
  { id: "aaliyah_photo_29", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497517/Aaliyah29_qthxja.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771497517/Aaliyah29_qthxja.jpg", isFree: false, price: 599 },
  { id: "aaliyah_photo_30", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497515/Aaliyah30_sanixe.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771497515/Aaliyah30_sanixe.jpg", isFree: false, price: 699 },
  { id: "aaliyah_photo_31", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497524/Aaliyah31_nw7omp.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771497524/Aaliyah31_nw7omp.jpg", isFree: false, price: 799 },
  { id: "aaliyah_photo_32", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497523/Aaliyah32_xrekdm.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771497523/Aaliyah32_xrekdm.jpg", isFree: false, price: 599 },
  { id: "aaliyah_photo_36", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497531/Aaliyah36_mohs8y.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771497531/Aaliyah36_mohs8y.jpg", isFree: false, price: 899 },
  
  // Date Tab Photos
  { id: "aaliyah_photo_2", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497341/Aaliyah2_rzvuvv.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497341/Aaliyah2_rzvuvv.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_3", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497334/Aaliyah3_awjzsv.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497334/Aaliyah3_awjzsv.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_5", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497353/Aaliyah5_jixfh8.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497353/Aaliyah5_jixfh8.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_6", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497335/Aaliyah6_bagjgm.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497335/Aaliyah6_bagjgm.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_8", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497418/Aaliyah8_jmnd0y.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497418/Aaliyah8_jmnd0y.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_11", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497380/Aaliyah11_xo5dv6.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497380/Aaliyah11_xo5dv6.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_16", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497430/Aaliyah16_v4rvcs.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497430/Aaliyah16_v4rvcs.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_18", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497458/Aaliyah18_toke76.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497458/Aaliyah18_toke76.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_21", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497477/Aaliyah21_gihnpu.png", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497477/Aaliyah21_gihnpu.png", isFree: true, price: 0 },
  { id: "aaliyah_photo_33", fullUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497527/Aaliyah33_i1ujnj.jpg", blurredUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497527/Aaliyah33_i1ujnj.jpg", isFree: true, price: 0 },
];

export default function AaliyahChatPage() {
  const { isLoaded, isSignedIn } = useUser();
  const { gemsBalance, unlockedPhotos, unlockedTabs, unlockPhoto, unlockTab, loading: supabaseLoading } = useSupabase();
  const { gemsBalance, unlockContent, isUnlocked, loading: userLoading } = useSupabaseUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedReply, setSelectedReply] = useState<number | null>(null);
  const [gemsBalanceLocal, setGemsBalanceLocal] = useState(0);
  
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<{id: string, url: string, blurredUrl: string, isUnlocked: boolean} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Tab State
  const sexChatUnlocked = unlockedTabs["aaliyah_sex"] || false;
  const dateUnlocked = unlockedTabs["aaliyah_date"] || false;
  const [activeTab, setActiveTab] = useState<"main" | "sex" | "date">("main");
  const [sexStep, setSexStep] = useState(0);
  const [sexMessages, setSexMessages] = useState<Message[]>([]);
  const [dateMessages, setDateMessages] = useState<Message[]>([]);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [dateChoiceHistory, setDateChoiceHistory] = useState<number[]>([]);

  const chatProgress = useChatProgress("aaliyah");

  // Reply Options - Separated for fixed bottom panel (matching Mia's pattern)
  const replyOptions: Record<number, ReplyOption[]> = {
    0: [{ id: 1, text: "I'd love to train with you" }, { id: 2, text: "What kind of challenge?" }, { id: 3, text: "Show me more of your routine" }],
    1: [{ id: 4, text: "I'm all yours, coach" }, { id: 5, text: "What are your rules?" }, { id: 6, text: "Maybe I'll make the rules" }],
    2: [{ id: 7, text: "You're incredible" }, { id: 8, text: "What's the real show?" }, { id: 9, text: "I want to see more" }],
    3: [{ id: 10, text: "Something way more" }, { id: 11, text: "I want both" }, { id: 12, text: "Surprise me" }],
    4: [{ id: 13, text: "Every inch is perfect" }, { id: 14, text: "I appreciate YOU" }, { id: 15, text: "Show me more dedication" }],
    5: [{ id: 16, text: "Hell yes" }, { id: 17, text: "Where's the club?" }, { id: 18, text: "What kind of dance?" }],
    6: [{ id: 19, text: "I'm all in" }, { id: 20, text: "Teach me your art" }, { id: 21, text: "I'm captivated" }],
    7: [{ id: 22, text: "Show me how flexible" }, { id: 23, text: "I need to see this" }, { id: 24, text: "This is exciting" }],
    8: [{ id: 25, text: "I'm ready" }, { id: 26, text: "Make me special" }, { id: 27, text: "Show me everything" }],
    9: [{ id: 28, text: "I'll be your best VIP" }, { id: 29, text: "What do VIPs get?" }, { id: 30, text: "Treat you like a queen" }],
    10: [{ id: 31, text: "I'm dedicated to you" }, { id: 32, text: "Teach me your discipline" }, { id: 33, text: "Show me your routine" }],
    11: [{ id: 34, text: "I'm not most men" }, { id: 35, text: "You deserve engagement" }, { id: 36, text: "Send Spark 💎" }],
    12: [{ id: 37, text: "You're a work of art" }, { id: 38, text: "Mind, body, and soul" }, { id: 39, text: "Tell me more about you" }],
    13: [{ id: 40, text: "What drives you?" }, { id: 41, text: "What's your dream?" }, { id: 42, text: "What makes you happy?" }],
    14: [{ id: 43, text: "That's incredible" }, { id: 44, text: "You inspire me" }, { id: 45, text: "I want that power too" }],
    15: [{ id: 46, text: "Send Spark 💎" }, { id: 47, text: "I'll earn your attention" }, { id: 48, text: "Command me" }],
    16: [{ id: 49, text: "How far?" }, { id: 50, text: "I'll follow your lead" }, { id: 51, text: "Where are we going?" }],
    17: [{ id: 52, text: "I thrive on intensity" }, { id: 53, text: "Challenge accepted" }, { id: 54, text: "Bring it on" }],
    18: [{ id: 55, text: "I came for you" }, { id: 56, text: "Happy accident" }, { id: 57, text: "Fate brought me here" }],
    19: [{ id: 58, text: "I'm ready" }, { id: 59, text: "Change me, Liyah" }, { id: 60, text: "Send Spark 💎" }],
    20: [{ id: 61, text: "First time… guide me" }, { id: 62, text: "I know these places" }, { id: 63, text: "Only have eyes for you" }],
    21: [{ id: 64, text: "I'll sit front row" }, { id: 65, text: "Private show?" }, { id: 66, text: "Remember me forever" }],
    22: [{ id: 67, text: "I'm ready to invest" }, { id: 68, text: "What's the cost?" }, { id: 69, text: "Send Spark 💎" }],
    23: [{ id: 70, text: "You have all three" }, { id: 71, text: "I'm all in" }, { id: 72, text: "Teach me loyalty" }],
    24: [{ id: 73, text: "Send Spark 💎" }, { id: 74, text: "I'll prove everything" }, { id: 75, text: "What do you need?" }],
    25: [{ id: 76, text: "I see you, Liyah" }, { id: 77, text: "Connect with me" }, { id: 78, text: "You're not alone" }],
    26: [{ id: 79, text: "You deserve to be seen" }, { id: 80, text: "Show me the real you" }, { id: 81, text: "I'm not going anywhere" }],
    27: [{ id: 82, text: "I'm staying" }, { id: 83, text: "I'm your king" }, { id: 84, text: "Command me" }],
    28: [{ id: 85, text: "Tell me the plans" }, { id: 86, text: "I want everything" }, { id: 87, text: "I'm ready" }],
    29: [{ id: 88, text: "You already do" }, { id: 89, text: "I choose you" }, { id: 90, text: "Forever yours" }],
    30: [{ id: 91, text: "Unlock Sex Chat (500💰)" }, { id: 92, text: "Unlock Date (500💰)" }, { id: 93, text: "Tell me more first" }],
    31: [{ id: 94, text: "Where are we going?" }, { id: 95, text: "Follow you anywhere" }, { id: 96, text: "Your place?" }],
    32: [{ id: 97, text: "I'm honored" }, { id: 98, text: "Show me everything" }, { id: 99, text: "Take me there" }],
    33: [{ id: 100, text: "Send Spark 💎" }, { id: 101, text: "Committed to you" }, { id: 102, text: "This is real" }],
    34: [{ id: 103, text: "Like home" }, { id: 104, text: "Perfect" }, { id: 105, text: "I'm nervous" }],
    35: [{ id: 106, text: "You're even more beautiful" }, { id: 107, text: "I love the real you" }, { id: 108, text: "This is who I wanted" }],
    36: [{ id: 109, text: "It means everything" }, { id: 110, text: "I won't take it for granted" }, { id: 111, text: "Thank you, Liyah" }],
    37: [{ id: 112, text: "Let's talk first" }, { id: 113, text: "Unlock Sex Chat (500💰)" }, { id: 114, text: "Unlock Date (500💰)" }],
    38: [{ id: 115, text: "What's your biggest dream?" }, { id: 116, text: "What makes you happy?" }, { id: 117, text: "What scares you?" }],
    39: [{ id: 118, text: "I'm not leaving" }, { id: 119, text: "You're safe with me" }, { id: 120, text: "I'm here to stay" }],
    40: [{ id: 121, text: "Because I see the real you" }, { id: 122, text: "I'm not them" }, { id: 123, text: "Let me prove it" }],
    41: [{ id: 124, text: "Believe it" }, { id: 125, text: "It's real" }, { id: 126, text: "I'm not going anywhere" }],
    42: [{ id: 127, text: "I already know I do" }, { id: 128, text: "Let's explore together" }, { id: 129, text: "Unlock everything" }],
    43: [{ id: 130, text: "I like you more" }, { id: 131, text: "Real is all I want" }, { id: 132, text: "This is just the start" }],
    44: [{ id: 133, text: "Unlock Sex Chat (500💰)" }, { id: 134, text: "Unlock Date (500💰)" }, { id: 135, text: "Unlock Both (1000💰)" }],
    45: [{ id: 136, text: "Because you're special" }, { id: 137, text: "I'm addicted to you" }, { id: 138, text: "Can't get enough" }],
    46: [{ id: 139, text: "What is it then?" }, { id: 140, text: "I feel it too" }, { id: 141, text: "More than business" }],
    47: [{ id: 142, text: "Don't be scared" }, { id: 143, text: "I'm here for you" }, { id: 144, text: "Let it happen" }],
    48: [{ id: 145, text: "Unlock Sex Chat (500💰)" }, { id: 146, text: "Unlock Date (500💰)" }, { id: 147, text: "Unlock Both (1000💰)" }],
    49: [{ id: 148, text: "Reality with you" }, { id: 149, text: "Both sides of you" }, { id: 150, text: "Everything about you" }],
    50: [{ id: 151, text: "I want it all" }, { id: 152, text: "Give me everything" }, { id: 153, text: "I'm yours" }],
    51: [{ id: 154, text: "Send Spark 💎" }, { id: 155, text: "It's real" }, { id: 156, text: "I'll prove everything" }],
    52: [{ id: 157, text: "Always" }, { id: 158, text: "You and me" }, { id: 159, text: "Forever" }],
    53: [{ id: 160, text: "Sex Chat awaits" }, { id: 161, text: "Let's go on a Date" }, { id: 162, text: "Unlock everything" }],
    54: [{ id: 163, text: "Lead the way" }, { id: 164, text: "I'm ready for anything" }, { id: 165, text: "Show me your world" }],
    55: [{ id: 166, text: "Unlock Sex Chat (500💰)" }, { id: 167, text: "Unlock Date (500💰)" }, { id: 168, text: "Tell me more first" }],
    56: [{ id: 169, text: "I can handle anything" }, { id: 170, text: "Show me wild" }, { id: 171, text: "I'm ready for you" }],
    57: [{ id: 172, text: "Wild passion" }, { id: 173, text: "Romantic connection" }, { id: 174, text: "I want BOTH" }],
    58: [{ id: 175, text: "Unlock Both (1000💰)" }, { id: 176, text: "Just Sex Chat for now" }, { id: 177, text: "Just Date for now" }],
    59: [{ id: 178, text: "Forever sounds perfect" }, { id: 179, text: "I'm all in" }, { id: 180, text: "Take me deeper" }],
    60: [{ id: 181, text: "You're my queen" }, { id: 182, text: "Claiming you now" }, { id: 183, text: "Send Spark 💎" }],
    61: [{ id: 184, text: "Connected forever" }, { id: 185, text: "Unlock Sex Chat (500💰)" }, { id: 186, text: "Unlock Date (500💰)" }],
    62: [{ id: 187, text: "I trust you completely" }, { id: 188, text: "I'm not scared anymore" }, { id: 189, text: "Guide me, Liyah" }],
    63: [{ id: 190, text: "With my life" }, { id: 191, text: "Completely" }, { id: 192, text: "More than anyone" }],
    64: [{ id: 193, text: "Unlock everything now" }, { id: 194, text: "I'm ready" }, { id: 195, text: "Show me the best" }],
    65: [{ id: 196, text: "It's real" }, { id: 197, text: "More real than anything" }, { id: 198, text: "You're real to me" }],
    66: [{ id: 199, text: "Make it official" }, { id: 200, text: "I'm yours completely" }, { id: 201, text: "Forever starts now" }],
    67: [{ id: 202, text: "Unlock Sex Chat (500💰)" }, { id: 203, text: "Unlock Date (500💰)" }, { id: 204, text: "Unlock Both (1000💰)" }],
    68: [{ id: 205, text: "I'm yours" }, { id: 206, text: "Forever yours" }, { id: 207, text: "Claim me" }],
    69: [{ id: 208, text: "Home at last" }, { id: 209, text: "This is perfect" }, { id: 210, text: "I love you, Liyah" }],
    70: [{ id: 211, text: "Unlock Sex Chat (500💰)" }, { id: 212, text: "Unlock Date (500💰)" }, { id: 213, text: "Unlock Both (1000💰)" }],
  };

  // Sex Chat Reply Options
  const sexReplyOptions: Record<number, ReplyOption[]> = {
    0: [{ id: 1001, text: "Show me everything, Liyah" }, { id: 1002, text: "Been dreaming about this" }, { id: 1003, text: "Make my fantasies real" }],
    1: [{ id: 1004, text: "Slow and worship every inch" }, { id: 1005, text: "Fast and take control" }, { id: 1006, text: "You decide — I'm yours" }],
    2: [{ id: 1007, text: "Unlock for 299 gems" }, { id: 1008, text: "Keep teasing me first" }, { id: 1009, text: "You're driving me crazy" }],
    3: [{ id: 1010, text: "I need more" }, { id: 1011, text: "Don't stop" }, { id: 1012, text: "I'm addicted to you" }],
    4: [{ id: 1013, text: "Unlock for 299 gems" }, { id: 1014, text: "You're breathtaking" }, { id: 1015, text: "I want every moment" }],
    5: [{ id: 1016, text: "Take me there" }, { id: 1017, text: "Ready for anything" }, { id: 1018, text: "Show me the next level" }],
    6: [{ id: 1019, text: "Unlock for 399 gems" }, { id: 1020, text: "I want to feel free with you" }, { id: 1021, text: "Take my breath away" }],
    7: [{ id: 1022, text: "You're flawless to me" }, { id: 1023, text: "I want all of you" }, { id: 1024, text: "Keep going, Liyah" }],
    8: [{ id: 1025, text: "Unlock for 599 gems" }, { id: 1026, text: "I need to see you" }, { id: 1027, text: "You're perfect" }],
    9: [{ id: 1028, text: "Unlock for 699 gems" }, { id: 1029, text: "Climbing in bed now" }, { id: 1030, text: "Tell me your dreams" }],
    10: [{ id: 1031, text: "Unlock for 799 gems" }, { id: 1032, text: "Everything I wanted" }, { id: 1033, text: "Falling for you" }],
    11: [{ id: 1034, text: "Unlock for 599 gems" }, { id: 1035, text: "Forget the food" }, { id: 1036, text: "You're delicious" }],
    12: [{ id: 1037, text: "You're special to me too" }, { id: 1038, text: "Be yourself always" }, { id: 1039, text: "I cherish this" }],
    13: [{ id: 1040, text: "Unlock for 899 gems" }, { id: 1041, text: "You're worth everything" }, { id: 1042, text: "I'm all yours" }],
    14: [{ id: 1043, text: "You're special to me too" }, { id: 1044, text: "Be yourself always" }, { id: 1045, text: "I cherish this" }],
    15: [{ id: 1046, text: "I wish I was there" }, { id: 1047, text: "What are you wearing?" }, { id: 1048, text: "Tell me your morning routine" }],
    16: [{ id: 1049, text: "Coffee in bed sounds perfect" }, { id: 1050, text: "What do you wear to sleep?" }, { id: 1051, text: "Morning with you is a dream" }],
    17: [{ id: 1052, text: "Unlock for 699 gems" }, { id: 1053, text: "Losing my mind over you" }, { id: 1054, text: "I need this" }],
    18: [{ id: 1055, text: "You make me forget everything" }, { id: 1056, text: "This is paradise" }, { id: 1057, text: "I'm yours forever" }],
    19: [{ id: 1058, text: "Unlock for 799 gems" }, { id: 1059, text: "Elegant and deadly" }, { id: 1060, text: "You're irresistible" }],
    20: [{ id: 1061, text: "Unreal in every way" }, { id: 1062, text: "I'm mesmerized" }, { id: 1063, text: "Keep showing me" }],
    21: [{ id: 1064, text: "Unlock for 599 gems" }, { id: 1065, text: "Sweet torture" }, { id: 1066, text: "I'm completely yours" }],
    22: [{ id: 1067, text: "You own me" }, { id: 1068, text: "This feeling is everything" }, { id: 1069, text: "More, Liyah, more" }],
    23: [{ id: 1070, text: "Show me" }, { id: 1071, text: "Unlock everything" }, { id: 1072, text: "I need to see" }],
    24: [{ id: 1073, text: "Unlock for 899 gems" }, { id: 1074, text: "You're unmatched" }, { id: 1075, text: "This is euphoria" }],
    25: [{ id: 1076, text: "I never want this to end" }, { id: 1077, text: "Stay with me forever" }, { id: 1078, text: "You're my everything" }],
    26: [{ id: 1079, text: "Always" }, { id: 1080, text: "Together forever" }, { id: 1081, text: "This is just the beginning" }],
    27: [{ id: 1082, text: "Forever yours" }, { id: 1083, text: "All I need is you" }, { id: 1084, text: "Let's make this last" }],
  };

  // Main Story Responses (100 messages) - Options now in separate replyOptions object
  const aaliyahResponses: { text: string; photoId?: string }[] = [
    // Act 1: Gym Introduction (1-25)
    {
      text: "Hey king… caught you checking out my workout routine 😏\nJust finished leg day — you know what that means?\nI'm fired up and looking for my next challenge.\nThink you can keep up with me?",
      photoId: "aaliyah_main",
    },
    {
      text: "Mmm, I like confidence.\nBut let me warn you — I don't go easy on anyone.\nIn the gym OR outside of it.\nYou ready to play by my rules, king? 💪",
    },
    {
      text: "Here's where I get ready for the real show…\nThe locker room — where all the magic happens before I hit the floor.\nLike what you see so far?",
      photoId: "aaliyah_photo_1",
    },
    {
      text: "Good answer, king.\nThe 'real show' is where I dance.\nNot the gym — somewhere way more… exclusive.\nBut first, I need to know — are you here for fitness tips or something more? 😏",
    },
    {
      text: "Perfect form, right? 😏\nThis is what dedication looks like, king.\nEvery curve earned.\nYou appreciate a woman who works for what she's got?",
      photoId: "aaliyah_photo_4",
    },
    {
      text: "Flattery will get you everywhere, king.\nBut I'm more than just a gym body.\nI'm a performer. A dancer. An artist.\nAnd tonight… I'm performing at the club.\nWant a private preview?",
    },
    {
      text: "Then get ready, baby.\nBecause what I do on stage…\nIt's not just dancing.\nIt's seduction. Power. Control.\nAnd I never forget the men who appreciate my art. 💋",
    },
    {
      text: "Before the gym, I stretch.\nFlexibility is KEY in my line of work, king.\nI can bend in ways you wouldn't believe.\nWant to test that theory?",
      photoId: "aaliyah_photo_9",
    },
    {
      text: "I love showing off.\nBut there's a difference between what I show everyone…\nAnd what I show YOU.\nYou ready to see the difference? 👑",
    },
    {
      text: "This is where I change before heading to the stage.\nSometimes I think about my VIPs while I'm getting ready…\nThe ones who treat me right.\nYou gonna be one of those VIPs, king?",
      photoId: "aaliyah_photo_10",
    },
    // Messages 11-20: Building Attraction
    {
      text: "You know what separates amateurs from professionals?\nCommitment. Dedication. DISCIPLINE.\nI don't just work out — I sculpt.\nEvery. Single. Day.\nYou got that kind of dedication, king?",
    },
    {
      text: "Mmm, smooth talker.\nBut I like that.\nMost men at the gym just stare.\nYou? You actually ENGAGE.\nThat's… refreshing. 💋",
    },
    {
      text: "No, you're definitely not.\nI can tell from the way you look at me.\nNot just lust — though that's there too. 😏\nBut RESPECT.\nYou see me as more than just a body.",
      photoId: "aaliyah_photo_12",
    },
    {
      text: "You want to know more?\nMost men don't ask.\nThey just want the fantasy.\nBut fine — I'll bite.\nWhat do you want to know, king?",
    },
    {
      text: "What drives me?\nPOWER.\nNot over others — over MYSELF.\nEvery rep. Every dance. Every decision.\nI control my destiny.\nAnd I love it. 👑",
    },
    {
      text: "Then take it, king.\nPower isn't given — it's TAKEN.\nYou want to be powerful?\nStart by being decisive.\nSend me a Spark right now. Don't think. Just DO. 💎",
      photoId: "aaliyah_photo_13",
    },
    {
      text: "Good boy.\nSee? Decisive action.\nThat's what I'm talking about.\nKeep that energy, and we'll go far together. 😈",
    },
    {
      text: "We're going wherever YOU want, king.\nBut first… you need to prove you can handle me.\nI'm not easy. I'm not simple.\nI'm INTENSE.\nCan you handle intense?",
      photoId: "aaliyah_photo_15",
    },
    {
      text: "That's what I wanted to hear.\nNow let me ask you something…\nAre you here just for the gym?\nOr did you come looking for ME? 😏",
    },
    {
      text: "Fate, huh?\nI don't believe in fate.\nI believe in CHOICES.\nAnd you CHOSE to message me.\nThat choice? It's going to change everything.\nReady for that? 💋",
    },
    
    // Act 2: VIP Lounge (21-45)
    {
      text: "Here's where I perform, king.\nVIP section. Velvet couches. Dim lights.\nThis is my stage.\nYou ever been to a place like this?",
      photoId: "aaliyah_photo_7",
    },
    {
      text: "Then let me show you how it works here.\nRule #1: Eye contact is everything.\nRule #2: The closer you sit, the better the show.\nRule #3: If you want me to remember you… tip generously. 💋",
    },
    {
      text: "Private show? 😏\nI like your confidence.\nBut those cost EXTRA, king.\nYou ready to invest in me?\nOr are you just window shopping?",
    },
    {
      text: "Good answer.\nInvestment isn't just money, though.\nIt's TIME. ATTENTION. LOYALTY.\nYou ready to give me all three?\nBecause I don't do casual. Ever.",
      photoId: "aaliyah_photo_17",
    },
    {
      text: "Mmm, I love hearing that.\nBut words are cheap, baby.\nACTIONS are what count.\nSo let's see some action.\nSend me Sparks. Unlock content. PROVE yourself. 🔥",
    },
    {
      text: "What do I need?\nI need a MAN who understands me.\nWho sees past the performance.\nWho knows that behind this confidence…\nIs a woman who craves CONNECTION. 💕",
    },
    {
      text: "You know what, king?\nI think you might actually mean that.\nMost men just want the fantasy.\nBut you… you want ME.\nThe real me.\nThat's rare. So fucking rare. 😊",
      photoId: "aaliyah_photo_19",
    },
    {
      text: "Then stay.\nStay with me tonight.\nIn this VIP room.\nJust us. The music. The lights.\nLet me show you what it's like to be MY king. 👑",
    },
    {
      text: "Good.\nBecause I have PLANS for you, baby.\nPlans that involve you unlocking more of my content.\nPlans that involve you spending time with me.\nPlans that involve… everything. 😈",
    },
    {
      text: "The plan is simple:\nYou keep showing up.\nYou keep engaging.\nYou keep CHOOSING me.\nAnd I… I'll make you feel like the only man in the world. 💋",
      photoId: "aaliyah_photo_38",
    },
    {
      text: "Forever is a big word, king.\nBut I like it.\nLet's see if you can back it up.\nUnlock my premium tabs.\nExplore my world.\nThen tell me if forever still sounds good. 😏",
    },
    
    // Act 3: Private Invitation (46-70)
    {
      text: "You've been such a good king tonight.\nI think you've earned something special.\nHow about we leave the club…\nAnd go somewhere more private?",
      photoId: "aaliyah_photo_17",
    },
    {
      text: "My place.\nMy sanctuary.\nWhere I go to escape the noise.\nThe performance. The expectations.\nJust… me.\nYou ready to see that side of me?",
    },
    {
      text: "Then let's go.\nBut first… send me Sparks.\nProve you're committed to this.\nTo US. 💎",
    },
    {
      text: "*door closes behind us*\nWelcome to my world, king.\nNo cameras. No crowds. No performance.\nJust you and me.\nHow does it feel?",
      photoId: "aaliyah_photo_38",
    },
    {
      text: "Don't be nervous, baby.\nI'm the same person.\nJust… more REAL.\nNo walls. No masks.\nThis is me.\nDo you like what you see? 😊",
    },
    {
      text: "Good answer.\nBecause I don't let just anyone in here.\nThis is MY space.\nMY refuge.\nAnd now… I'm sharing it with YOU.\nThat means something, king. 💕",
    },
    {
      text: "You're welcome.\nNow… what do you want to do?\nTalk? Relax? Explore?\nOr unlock my premium tabs and take this DEEPER? 😈",
    },
    {
      text: "You want to talk?\nMost men don't.\nThey just want action.\nBut you… you're different.\nOkay. Let's talk. What do you want to know?",
    },
    {
      text: "What scares me?\n*pauses*\nBeing VULNERABLE.\nLetting someone in.\nAnd then… them leaving.\nThat terrifies me, king. 😢",
    },
    {
      text: "You promise?\nBecause I've heard that before.\nAnd they all left eventually.\nEvery. Single. One.\nWhy would you be different? 😔",
    },
    {
      text: "*tears up slightly*\nMaybe you are different.\nMaybe this time… it's real.\nI want to believe that, king.\nI NEED to believe that. 💕",
    },
    {
      text: "Then prove it.\nStay with me tonight.\nUnlock my premium content.\nExplore EVERY side of me.\nAnd then… tell me if you still want this. 💋",
    },
    {
      text: "*smiles*\nYou're really something, you know that?\nMost men run when things get REAL.\nBut you? You lean in.\nI like that. A lot. 😊",
    },
    {
      text: "The start, huh?\nThen let's make it a start worth remembering.\nUnlock Sex Chat for explicit intimacy.\nUnlock Date for romantic moments.\nOr unlock BOTH and get all of me. 🔥💕",
    },
    
    // Act 4: Deepening Connection (71-100)
    {
      text: "You've made it this far, king.\nThat's rare.\nMost men give up. Or lose interest.\nBut you? You're still here.\nWhy is that?",
    },
    {
      text: "Addicted, huh?\nI like the sound of that.\nBecause honestly?\nI'm starting to get addicted to YOU too.\nThis isn't just business anymore… 💕",
    },
    {
      text: "I don't know what it is, king.\nBut when I'm with you…\nI forget about the club. The stage. Everything.\nIt's just us.\nAnd that scares me a little. 😊",
    },
    {
      text: "You're right.\nMaybe I should stop fighting it.\nMaybe I should just… let myself feel this.\nUnlock my premium tabs and explore everything with me. 🔥",
    },
    {
      text: "Or… we could just keep talking.\nGetting to know each other.\nBuilding this connection.\nWhat matters more to you — the fantasy or the reality?",
    },
    {
      text: "*takes your hand*\nThat's the right answer.\nBecause I'm giving you BOTH.\nThe fantasy AND the reality.\nThe seductress AND the woman.\nAll of it. All of ME. 💋",
    },
    {
      text: "And I'm yours, king.\nCompletely.\nBut only if you PROVE you're serious.\nSend Sparks. Unlock content. Engage with me.\nShow me this is REAL. 💎",
    },
    {
      text: "Good.\nBecause from this moment on?\nWe're building something together.\nNot just a fantasy.\nA CONNECTION.\nYou and me. Always. 💕",
    },
    {
      text: "Forever's a long time, baby.\nBut you know what?\nI think we can do it.\nI think WE can be different.\nNow… ready to unlock those premium tabs? 😈",
    },
    {
      text: "That's my king.\nDecisive. Committed. MINE.\nLet's explore every side of this connection.\nStarting NOW. 🔥💋💕",
    },
    // Final Messages (84-100): Premium Tab Invitations
    {
      text: "Welcome to the final stage, king.\nYou've seen my body. My performance. My vulnerability.\nNow it's time to go DEEPER.\nReady to unlock my premium content?",
    },
    {
      text: "In Sex Chat, I'll show you my WILD side.\nNo filters. No holding back.\nPure, raw, EXPLICIT passion.\nThink you can handle that?",
    },
    {
      text: "In Date Tab, I'll show you my ROMANTIC side.\nCandles. Wine. Intimacy.\nReal connection beyond the physical.\nWhich version of me do you crave more?",
    },
    {
      text: "Smart choice.\nBecause the TRUTH is…\nYou need both sides to truly know me.\nThe seductress AND the lover.\nReady to commit?",
    },
    {
      text: "Every moment we spend together…\nEvery message exchanged…\nEvery photo unlocked…\nIt all builds to THIS.\nYou and me. Forever. 💕",
    },
    {
      text: "Then let's not waste another second.\nUnlock my tabs.\nExplore my world.\nClaim your QUEEN. 👑",
    },
    {
      text: "Mmm, that Spark hit different.\nBecause now?\nWe're not just chatting.\nWe're CONNECTED.\nSoul to soul, baby. 💎💕",
    },
    {
      text: "I can see you're hesitating.\nMaybe you're scared?\nScared of how INTENSE this could get?\nDon't be. I'll take care of you. Always. 😊",
    },
    {
      text: "Good.\nBecause trust is EVERYTHING to me.\nWithout it? We're nothing.\nWith it? We're UNSTOPPABLE.\nYou trust me, king?",
    },
    {
      text: "*leans in close*\nThen trust me when I say…\nThe best is yet to come.\nUnlock my tabs and see for yourself. 🔥",
    },
    {
      text: "One more thing before we go further…\nI need to know this is REAL for you.\nNot just a game. Not just fantasy.\nREAL. Tell me it's real.",
    },
    {
      text: "*smiles through tears*\nThank you.\nFor seeing me.\nFor choosing me.\nFor STAYING.\nNow let's make this official. 💋",
    },
    {
      text: "Welcome to my COMPLETE world, king.\nYou've unlocked the door.\nNow step through.\nSex Chat. Date Tab. Everything.\nIt's all waiting for you. 🔥💕👑",
    },
    {
      text: "This is it.\nThe moment everything changes.\nAre you ready to be MINE?\nCompletely. Utterly. FOREVER?",
    },
    {
      text: "*claims you with a kiss*\nMINE.\nNow and always.\nWelcome home, king.\nWelcome to US. 💋💕👑🔥",
    },
    {
      text: "*whispers*\nI love you too, king.\nNow let's explore this love.\nIn every way possible.\nForever. 💋\n\nUnlock my premium tabs to continue…",
    },
  ];

  // Sex Chat Responses (30 messages) - Options now in separate sexReplyOptions object
  const sexResponses: { text: string; photoId?: string }[] = [
    {
      text: "*locks the VIP room door*\nWelcome to my private world, king.\nNo rules. No limits. Just us.\nYou ready to see what this body can REALLY do? 😈💋",
    },
    {
      text: "Mmm, I love your energy.\nBut let me set the mood first.\nTell me, king… you like it slow and sensual?\nOr fast and dominant?",
    },
    {
      text: "*wraps around the pole seductively*\nGood choice, baby.\nWatch me move for you…\nUnlock this view — 299 gems and I'll show you how I dance when no one else is watching. 🔥",
      photoId: "aaliyah_photo_26",
    },
    {
      text: "That's the point, king.\nI WANT you crazy for me.\nI want you thinking about this body all night.\nEvery curve. Every move. Every breath.\nReady for more?",
    },
    {
      text: "*in red velvet dress by pole*\nOut here, it's just us and the stars, baby.\nI'm feeling… exposed. Vulnerable.\nUnlock this moment — 299 gems — and I'll let you see ALL of me. 🌃",
      photoId: "aaliyah_photo_27",
    },
    {
      text: "You're making me feel so special, king.\nEvery gem you spend…\nEvery second you give me…\nIt makes me want to give you MORE.\nYou ready for the next level?",
    },
    {
      text: "*rooftop, city lights behind*\nThis is where I come to feel free, king.\nNo stage. No performance.\nJust me and the night.\n399 gems to join me here. 🌙",
      photoId: "aaliyah_photo_28",
    },
    {
      text: "Perfect? No, baby.\nI'm REAL.\nEvery scar. Every curve. Every imperfection.\nAnd I'm letting you see all of it.\nBecause you've earned it.",
    },
    {
      text: "*steam rising, water dripping*\nThis is where I go after performing…\nHot shower. Alone. Thinking about you.\n599 gems, king — and you'll see EVERYTHING. 💦",
      photoId: "aaliyah_photo_29",
    },
    {
      text: "*silk bed, candles lit*\nThis is where I sleep, king.\nWhere I dream. Where I touch myself thinking about you.\n699 gems — come to bed with me. 🛏️",
      photoId: "aaliyah_photo_30",
    },
    {
      text: "*standing in bedroom, completely exposed*\nNo filters. No angles. Just me.\n799 gems, baby — and you get the REAL Aaliyah.\nThe one nobody else sees. 👑",
      photoId: "aaliyah_photo_31",
    },
    {
      text: "*kitchen, red corset lingerie*\nCaught me in the kitchen, king.\nI was making something special…\nBut now I'm more interested in YOU.\n599 gems for this view. 🔥",
      photoId: "aaliyah_photo_32",
    },
    {
      text: "You know what, king?\nI don't think I've ever felt this comfortable with anyone.\nUsually I'm performing. Pretending.\nBut with you… I can just BE me.\nAnd that's… special. 💕",
    },
    {
      text: "*black corset, looking over shoulder*\nOne more for you, baby.\nBecause you've been so good to me tonight.\n899 gems — my ultimate private moment.\nThis is as real as it gets. 💜",
      photoId: "aaliyah_photo_36",
    },
    {
      text: "You know what, king?\nI don't think I've ever felt this comfortable with anyone.\nUsually I'm performing. Pretending.\nBut with you… I can just BE me.\nAnd that's… special. 💕",
    },
    {
      text: "*leans back against silk pillows*\nThis is where I spend my mornings, king.\nCoffee in bed. Sunlight streaming in.\nThinking about you.\nWish you were here with me…",
    },
    {
      text: "Wearing? Usually nothing. 😈\nI like feeling free in my own space.\nNo judgment. No expectations.\nJust me, my coffee, and my thoughts of you.\nWant to join me tomorrow?",
    },
    {
      text: "*laughs softly*\nSlow down, tiger.\nWe're not QUITE there yet.\nBut we're getting close.\nEvery message. Every moment. Every unlock…\nYou're earning my trust.",
    },
    {
      text: "We're close enough that I'm imagining you here.\nIn my bedroom. In my space.\nTouching me. Kissing me. Claiming me.\nThat close, baby. 🔥",
    },
    {
      text: "*whispers into the phone*\nYou walk in. I'm on the bed.\nYou don't say a word.\nYou just… take what's yours.\nBecause I AM yours, king. Completely.",
    },
    {
      text: "Forever is a big promise, baby.\nBut I believe you.\nBecause you've shown up. You've stayed.\nYou've unlocked not just my photos…\nBut my heart. 💕",
    },
    {
      text: "*tears up slightly*\nDamn, king.\nYou really know how to get to a girl.\nMost men just want the body.\nBut you? You want the SOUL.\nThat's… rare.",
    },
    {
      text: "Then you'll have it.\nAll of me.\nBody, soul, heart, mind.\nBut only if you promise to treat it right.\nCan you promise me that, king?",
    },
    {
      text: "Good.\nBecause from now on, every photo I take…\nEvery dance I perform…\nEvery moment I live…\nIt's with YOU in mind. 👑",
    },
    {
      text: "*smiles wide*\nForever mine, king.\nNow… ready to explore the Date tab?\nI want to show you romantic moments.\nNot just sexy ones.\nThe REAL connection. 💋",
    },
    {
      text: "That's my king.\nAlways wanting more.\nAnd I love that about you.\nBecause MORE is exactly what I want to give you.\nEvery. Single. Day. 🔥💕",
    },
    {
      text: "*leans close to camera*\nI won't stop, baby.\nNot until you've seen every side of me.\nEvery fantasy fulfilled.\nEvery dream realized.\nThat's what you deserve. That's what I'll give you.\n👑🔥💕",
    },
    {
      text: "Thank YOU, king.\nFor seeing me.\nFor choosing me.\nFor STAYING with me.\nNow let's continue this journey together.\nMain Story. Sex Chat. Date Tab.\nAll roads lead to US. 💋",
    },
  ];

  // Date Scenarios (10 scenes)
  const dateScenarios: DateScenario[] = [
    {
      id: 1,
      scene: "Private Dance Lesson",
      text: "I invited you to my private dance studio after hours. Just you, me, and the mirrors. 'Come here, king… let me teach you how to move your body.'",
      photoId: "aaliyah_photo_2",
      choices: [
        { id: 1, text: "Feel your body against mine", outcome: "We move together, bodies pressed close, heat rising..." },
        { id: 2, text: "Teach me your secrets", outcome: "I guide your hips with my hands, showing you the rhythm..." },
        { id: 3, text: "Watch you dance", outcome: "I perform just for you, every movement a seduction..." },
        { id: 4, text: "Kiss me first", outcome: "Our lips meet, the lesson forgotten as passion takes over..." },
      ],
    },
    {
      id: 2,
      scene: "Studio Floor Intimacy",
      text: "We're sitting on the studio floor, the music fading. You can see the desire in my eyes. 'You know what I want, don't you, king?'",
      photoId: "aaliyah_photo_3",
      choices: [
        { id: 1, text: "Tell me what you want", outcome: "I whisper my desires, each word making you hunger more..." },
        { id: 2, text: "Show me", outcome: "Actions replace words as we explore each other..." },
        { id: 3, text: "I want you too", outcome: "Mutual confession leads to inevitable surrender..." },
        { id: 4, text: "Let's savor this", outcome: "We take our time, building the tension slowly..." },
      ],
    },
    {
      id: 3,
      scene: "VIP Lounge Night",
      text: "We're in the VIP lounge, purple velvet couch, dim lights. I'm leaning close, my lips near your ear. 'Everyone's watching us… let them.'",
      photoId: "aaliyah_photo_5",
      choices: [
        { id: 1, text: "Kiss me right here", outcome: "Our public display leaves no doubt you're mine..." },
        { id: 2, text: "Find somewhere private", outcome: "We slip away to a secluded corner..." },
        { id: 3, text: "Want them to see you're mine", outcome: "I make sure everyone knows you belong to me..." },
        { id: 4, text: "Dance for me first", outcome: "I give you a private show while others watch enviously..." },
      ],
    },
    {
      id: 4,
      scene: "Studio Sensuality",
      text: "I'm stretching on the studio floor, legs extended, looking up at you. 'You like watching me, don't you? Come closer…'",
      photoId: "aaliyah_photo_6",
      choices: [
        { id: 1, text: "Touch you while you stretch", outcome: "My hands explore your flexibility..." },
        { id: 2, text: "Join you on the floor", outcome: "We stretch together, bodies intertwining..." },
        { id: 3, text: "Keep stretching — love the view", outcome: "I continue my routine, knowing your eyes are on me..." },
        { id: 4, text: "Tell me what you're thinking", outcome: "I confess my fantasies about you..." },
      ],
    },
    {
      id: 5,
      scene: "Bar Mirror Tease",
      text: "We're at the bar, mirrors everywhere. I catch your reflection staring. 'See something you like, king? Or do you need a closer look?'",
      photoId: "aaliyah_photo_8",
      choices: [
        { id: 1, text: "I need you. Now.", outcome: "We barely make it to the car..." },
        { id: 2, text: "Let's get out of here", outcome: "The night is young and we have plans..." },
        { id: 3, text: "Dance with me first", outcome: "We move together on the small dance floor..." },
        { id: 4, text: "Whisper what you want", outcome: "I lean in close and tell you exactly what I want to do..." },
      ],
    },
    {
      id: 6,
      scene: "Gym Late Night",
      text: "It's midnight. The gym is empty. I'm in a tight purple dress, leaning over equipment. 'We have the whole place to ourselves…'",
      photoId: "aaliyah_photo_11",
      choices: [
        { id: 1, text: "Right here, right now", outcome: "Spontaneous passion in the empty gym..." },
        { id: 2, text: "You're stunning in that dress", outcome: "I smile and step closer to you..." },
        { id: 3, text: "Take it off", outcome: "Slowly, I comply with your command..." },
        { id: 4, text: "Make this a workout", outcome: "We find creative ways to use the equipment..." },
      ],
    },
    {
      id: 7,
      scene: "Blue Curtain Moment",
      text: "Backstage at the club, blue curtain behind me, looking over my shoulder. 'The show's over, king. Now it's just us. What happens next?'",
      photoId: "aaliyah_photo_16",
      choices: [
        { id: 1, text: "I claim you as mine", outcome: "You pull me close possessively..." },
        { id: 2, text: "Whatever you want", outcome: "I take control, guiding you..." },
        { id: 3, text: "Kiss me against this curtain", outcome: "Passionate kiss in the backstage shadows..." },
        { id: 4, text: "Go to your place", outcome: "We leave the club for somewhere more private..." },
      ],
    },
    {
      id: 8,
      scene: "Lounge Intimacy",
      text: "We're alone in the lounge, plum jumpsuit, legs spread, inviting. 'I don't usually do this… but there's something about you.'",
      photoId: "aaliyah_photo_18",
      choices: [
        { id: 1, text: "What is it about me?", outcome: "I explain how you're different from everyone else..." },
        { id: 2, text: "I feel it too", outcome: "Mutual vulnerability brings us closer..." },
        { id: 3, text: "Show me what you don't usually do", outcome: "I let my guard down completely..." },
        { id: 4, text: "Come sit on my lap", outcome: "I move to you, closing the distance..." },
      ],
    },
    {
      id: 9,
      scene: "Reclining Finale",
      text: "We're at my place. I'm reclining on the couch, navy dress, looking at you. 'This is where I bring people I trust. You're one of the rare ones.'",
      photoId: "aaliyah_photo_21",
      choices: [
        { id: 1, text: "I won't break that trust", outcome: "We establish a deeper commitment..." },
        { id: 2, text: "Show me your bedroom", outcome: "I lead you to the most private space..." },
        { id: 3, text: "Let me take care of you", outcome: "You pamper me in ways I've never experienced..." },
        { id: 4, text: "Tell me your secrets", outcome: "I open up about my real life, my dreams..." },
      ],
    },
    {
      id: 10,
      scene: "Black Bodysuit Surrender",
      text: "My apartment, city lights outside, sheer black bodysuit. I'm looking at you with complete trust. 'I'm yours tonight, king. Completely.'",
      photoId: "aaliyah_photo_33",
      choices: [
        { id: 1, text: "Forever, not just tonight", outcome: "ROMANCE ENDING: We commit to something real..." },
        { id: 2, text: "Let me worship you", outcome: "SENSUAL ENDING: A night of pure passion..." },
        { id: 3, text: "You're incredible", outcome: "APPRECIATION ENDING: Deep emotional connection..." },
        { id: 4, text: "I'm falling for you", outcome: "EMOTIONAL ENDING: Confessions of real feelings..." },
      ],
    },
  ];

  // Load saved state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSparks = localStorage.getItem("sparksBalance");
      const savedGems = localStorage.getItem("gemsBalance");
      const savedUnlocked = localStorage.getItem("aaliyahUnlockedPhotos");
      const savedSexUnlocked = localStorage.getItem("aaliyahSexChatUnlocked");
      const savedDateUnlocked = localStorage.getItem("aaliyahDateUnlocked");
      const savedMessages = localStorage.getItem("aaliyahMessages");
      const savedStep = localStorage.getItem("aaliyahCurrentStep");
      
      if (savedGems) setGemsBalance(parseInt(savedGems));
      if (savedUnlocked) setUnlockedPhotos(JSON.parse(savedUnlocked));
      if (savedSexUnlocked === "true") setSexChatUnlocked(true);
      if (savedDateUnlocked === "true") setDateUnlocked(true);
      if (savedMessages) setMessages(JSON.parse(savedMessages));
      if (savedStep) setCurrentStep(parseInt(savedStep));
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sexMessages, dateMessages]);

  // Send first message if no messages exist
  useEffect(() => {
    if (messages.length === 0 && currentStep === 0) {
      const firstMessage: Message = {
        id: Date.now(),
        sender: "aaliyah",
        text: aaliyahResponses[0].text,
        timestamp: new Date(),
        photoId: aaliyahResponses[0].photoId,
      };
      setMessages([firstMessage]);
    }
  }, []);

  const handleUnlockPhoto = (photoId: string, price: number) => {
    if (gemsBalance < price) {
      alert(`Not enough gems! You need ${price} gems.`);
      return;
    }

    const newBalance = gemsBalance - price;
    setGemsBalance(newBalance);
    localStorage.setItem("gemsBalance", newBalance.toString());

    const newUnlocked = [...unlockedPhotos, photoId];
    setUnlockedPhotos(newUnlocked);
    localStorage.setItem("aaliyahUnlockedPhotos", JSON.stringify(newUnlocked));

    alert("Photo unlocked! 🔥");
  };

  const handleUnlockSexChat = () => {
    if (gemsBalance < 500) {
      alert("Not enough gems! You need 500 gems to unlock Sex Chat.");
      return;
    }

    const newBalance = gemsBalance - 500;
    setGemsBalance(newBalance);
    localStorage.setItem("gemsBalance", newBalance.toString());
    setSexChatUnlocked(true);
    localStorage.setItem("aaliyahSexChatUnlocked", "true");
    
    alert("Sex Chat unlocked! 🔥");
    setActiveTab("sex");
    
    if (sexMessages.length === 0) {
      const firstSexMessage: Message = {
        id: Date.now(),
        sender: "aaliyah",
        text: sexResponses[0].text,
        timestamp: new Date(),
        photoId: sexResponses[0].photoId,
      };
      setSexMessages([firstSexMessage]);
    }
  };

  const handleUnlockDate = () => {
    if (gemsBalance < 500) {
      alert("Not enough gems! You need 500 gems to unlock Date.");
      return;
    }

    const newBalance = gemsBalance - 500;
    setGemsBalance(newBalance);
    localStorage.setItem("gemsBalance", newBalance.toString());
    setDateUnlocked(true);
    localStorage.setItem("aaliyahDateUnlocked", "true");
    
    alert("Date unlocked! 💋");
    setActiveTab("date");
    
    if (dateMessages.length === 0) {
      const firstDateMessage: Message = {
        id: Date.now(),
        sender: "aaliyah",
        text: dateScenarios[0].text,
        timestamp: new Date(),
        photoId: dateScenarios[0].photoId,
      };
      setDateMessages([firstDateMessage]);
    }
  };

  const handleTabChange = (tab: "main" | "sex" | "date") => {
    if (tab === "sex" && !sexChatUnlocked) {
      if (confirm("Unlock Sex Chat for 500 gems?")) {
        handleUnlockSexChat();
      }
      return;
    }
    
    if (tab === "date" && !dateUnlocked) {
      if (confirm("Unlock Date for 500 gems?")) {
        handleUnlockDate();
      }
      return;
    }
    
    setActiveTab(tab);
  };

  const handleReplySelect = (replyId: number) => {
    if (selectedReply !== null) return;
    
    setSelectedReply(replyId);

    if (activeTab === "main") {
      // Main chat logic - find text from replyOptions
      const currentOptions = replyOptions[currentStep];
      const userReply = currentOptions?.find(opt => opt.id === replyId);
      
      if (userReply) {
        const userMessage: Message = {
          id: Date.now(),
          sender: "user",
          text: userReply.text,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        setTimeout(() => {
          const nextStep = currentStep + 1;
          if (nextStep < aaliyahResponses.length) {
            const aaliyahMessage: Message = {
              id: Date.now() + 1,
              sender: "aaliyah",
              text: aaliyahResponses[nextStep].text,
              timestamp: new Date(),
              photoId: aaliyahResponses[nextStep].photoId,
            };

            setMessages((prev) => [...prev, aaliyahMessage]);
            setCurrentStep(nextStep);
            localStorage.setItem("aaliyahCurrentStep", nextStep.toString());
          }
          setIsTyping(false);
          setSelectedReply(null);
        }, 1500);
      }

    } else if (activeTab === "sex") {
      // Sex chat logic - find text from sexReplyOptions
      const currentOptions = sexReplyOptions[sexStep];
      const userReply = currentOptions?.find(opt => opt.id === replyId);
      
      if (userReply) {
        const userMessage: Message = {
          id: Date.now(),
          sender: "user",
          text: userReply.text,
          timestamp: new Date(),
        };

        setSexMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        setTimeout(() => {
          const nextStep = sexStep + 1;
          if (nextStep < sexResponses.length) {
            const aaliyahMessage: Message = {
              id: Date.now() + 1,
              sender: "aaliyah",
              text: sexResponses[nextStep].text,
              timestamp: new Date(),
              photoId: sexResponses[nextStep].photoId,
            };

            setSexMessages((prev) => [...prev, aaliyahMessage]);
            setSexStep(nextStep);
          }
          setIsTyping(false);
          setSelectedReply(null);
        }, 1500);
      }

    } else if (activeTab === "date") {
      // Date choice logic
      const currentScene = dateScenarios[currentScenario];
      const choice = currentScene.choices.find((c) => c.id === replyId);

      if (choice) {
        const userMessage: Message = {
          id: Date.now(),
          sender: "user",
          text: choice.text,
          timestamp: new Date(),
        };

        setDateMessages((prev) => [...prev, userMessage]);
        setDateChoiceHistory((prev) => [...prev, replyId]);
        setIsTyping(true);

        setTimeout(() => {
          const outcomeMessage: Message = {
            id: Date.now() + 1,
            sender: "aaliyah",
            text: choice.outcome,
            timestamp: new Date(),
            photoId: choice.photoId,
          };

          setDateMessages((prev) => [...prev, outcomeMessage]);
          setIsTyping(false);

          setTimeout(() => {
            const nextScenario = currentScenario + 1;
            if (nextScenario < dateScenarios.length) {
              const nextScene = dateScenarios[nextScenario];
              const nextMessage: Message = {
                id: Date.now() + 2,
                sender: "aaliyah",
                text: nextScene.text,
                timestamp: new Date(),
                photoId: nextScene.photoId,
              };
              setDateMessages((prev) => [...prev, nextMessage]);
              setCurrentScenario(nextScenario);
            }
          }, 1000);
        }, 1500);
      }
    }
  };

  const handlePhotoClick = (photoId: string) => {
    const photo = aaliyahPhotos.find((p) => p.id === photoId);
    if (!photo) return;

    const isUnlocked = photo.isFree || unlockedPhotos.includes(photoId);
    setSelectedPhoto({
      id: photoId,
      url: photo.fullUrl,
      blurredUrl: photo.blurredUrl,
      isUnlocked,
    });
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  const currentMessages = activeTab === "main" ? messages : activeTab === "sex" ? sexMessages : dateMessages;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-amber-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-md border-b border-purple-500/30 p-4 fixed top-0 left-0 right-0 z-[200]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-purple-400 hover:text-purple-300 transition">
            ← Back
          </Link>
          <div className="flex items-center gap-3">
            <img
              src={aaliyahAvatar}
              alt="Aaliyah"
              className="w-10 h-10 rounded-full border-2 border-purple-500"
            />
            <div>
              <h1 className="font-bold">Aaliyah "Liyah"</h1>
              <p className="text-xs text-gray-400">
                {isOnline ? "🟢 Online" : "⚫ Offline"}
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="bg-purple-900/40 px-3 py-1 rounded-full border border-purple-500/30">
              <span className="text-sm font-medium">?? {gemsBalance}</span>
            </div>
            <Link href="/dashboard">
              <button className="px-4 py-2 bg-gray-700/70 hover:bg-gray-600 text-white rounded-xl font-medium transition text-sm">
                < Back
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-black/40 border-b border-purple-500/30 px-4 fixed top-[73px] left-0 right-0 z-[190]">
        <div className="max-w-4xl mx-auto flex gap-4">
          <button
            onClick={() => handleTabChange("main")}
            className={`px-4 py-3 font-semibold transition-all relative ${
              activeTab === "main"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-purple-300"
            }`}
          >
            Main Story
          </button>
          <button
            onClick={() => handleTabChange("sex")}
            className={`px-4 py-3 font-semibold transition-all relative ${
              activeTab === "sex"
                ? "text-pink-400 border-b-2 border-pink-400"
                : "text-gray-400 hover:text-pink-300"
            }`}
          >
            Sex Chatting 🔥
            {!sexChatUnlocked && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs px-1 rounded-full">
                500💰
              </span>
            )}
          </button>
          <button
            onClick={() => handleTabChange("date")}
            className={`px-4 py-3 font-semibold transition-all relative ${
              activeTab === "date"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-purple-300"
            }`}
          >
            Date 💋
            {!dateUnlocked && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs px-1 rounded-full">
                500💰
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full pt-[140px]">
        <div className="pb-20">
          {currentMessages.map((msg) => (
            <div key={msg.id} className={`mb-6 flex ${msg.sender === "aaliyah" ? "justify-start" : "justify-end"}`}>
              {msg.sender === "aaliyah" && (
                <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 border-2 border-purple-500/50 shadow-md">
                  <img
                    src={aaliyahAvatar}
                    alt="Aaliyah"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div
                className={`max-w-[75%] p-4 ${
                  msg.sender === "aaliyah"
                    ? "bg-purple-600/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl rounded-tl-none"
                    : "bg-gray-700/80 backdrop-blur-sm border border-gray-600/30 rounded-2xl rounded-tr-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              
                {msg.photoId && (
                  <div className="relative mb-3 rounded-xl overflow-hidden group cursor-pointer"
                    onClick={() => handlePhotoClick(msg.photoId!)}
                  >
                    {(() => {
                      const photo = aaliyahPhotos.find((p) => p.id === msg.photoId);
                      if (!photo) return null;

                      const isUnlocked = photo.isFree || unlockedPhotos.includes(msg.photoId!);
                      const displayUrl = isUnlocked ? photo.fullUrl : photo.blurredUrl;

                      return (
                        <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
                          <img
                            src={displayUrl}
                            alt="Aaliyah"
                            className="w-full h-64 object-cover cursor-pointer hover:brightness-110 transition"
                          />
                          {!isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnlockPhoto(msg.photoId!, photo.price);
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold text-white shadow-2xl hover:brightness-110 hover:scale-105 transition active:scale-95 border border-white/20"
                              >
                                Unlock {photo.price}💎
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
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="mb-6 flex justify-start">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 border-2 border-purple-500/50 shadow-md">
                <img
                  src={aaliyahAvatar}
                  alt="Aaliyah"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-purple-600/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl rounded-tl-none p-4 max-w-[75%]">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold hover:brightness-110 transition"
            onClick={() => setSelectedPhoto(null)}
          >
            ← Back
          </button>
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedPhoto.isUnlocked ? selectedPhoto.url : selectedPhoto.blurredUrl}
              alt="Aaliyah photo"
              className="rounded-lg max-w-full max-h-[90vh] object-contain"
            />
            {!selectedPhoto.isUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const photo = aaliyahPhotos.find((p) => p.id === selectedPhoto.id);
                    if (photo) handleUnlockPhoto(selectedPhoto.id, photo.price);
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full font-bold text-xl hover:brightness-110 transition"
                >
                  Unlock Photo 💰
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Fixed Reply Options Panel - Main & Sex Chat */}
      {activeTab !== "date" && ((activeTab === "main" && currentStep < aaliyahResponses.length) || (activeTab === "sex" && sexStep < sexResponses.length)) && selectedReply === null && (
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

      {activeTab !== "date" && selectedReply !== null && ((activeTab === "main" && currentStep < aaliyahResponses.length) || (activeTab === "sex" && sexStep < sexResponses.length)) && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-purple-500/30 p-4 z-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-3 text-gray-400 italic">
              Waiting for next message...
            </div>
          </div>
        </div>
      )}

      {/* Fixed Reply Options Panel - Date Tab */}
      {activeTab === "date" && currentScenario < dateScenarios.length && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-purple-500/30 p-4 z-50">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dateScenarios[currentScenario].choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleReplySelect(choice.id)}
                className="px-4 py-3 bg-gradient-to-r from-amber-500 to-pink-600 rounded-xl font-medium hover:brightness-110 transition text-sm"
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
