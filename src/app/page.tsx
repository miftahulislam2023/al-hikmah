import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hind_Siliguri } from 'next/font/google';

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['300', '400', '500', '600', '700'],
});

export default function Home() {
  return (
    <main className={`flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 bg-gradient-to-br  from-blue-300  ${hindSiliguri.className} overflow-x-hidden relative`}>
      {/* Floating educational elements - made more playful */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[8%] left-[2%] w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-yellow-300 to-yellow-400 opacity-90 rounded-2xl rotate-12 animate-float shadow-lg" style={{ animationDelay: '0s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">🧮</div>
        </div>
        <div className="absolute top-[15%] left-[75%] w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-300 to-blue-400 opacity-90 rounded-2xl -rotate-12 animate-float shadow-lg" style={{ animationDelay: '1.5s' }}>
          <div className="flex items-center justify-center h-full text-2xl md:text-3xl">💻</div>
        </div>
        <div className="absolute top-[12%] right-[3%] w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-300 to-green-400 opacity-90 rounded-2xl rotate-45 animate-float shadow-lg" style={{ animationDelay: '2.3s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">📱</div>
        </div>
        <div className="absolute top-[20%] left-[10%] w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-300 to-purple-400 opacity-90 rounded-2xl -rotate-12 animate-float shadow-lg" style={{ animationDelay: '3.1s' }}>
          <div className="flex items-center justify-center h-full text-lg md:text-xl">🚀</div>
        </div>
        <div className="absolute top-[18%] right-[8%] w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-300 to-pink-400 opacity-90 rounded-2xl rotate-12 animate-float shadow-lg" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">⚛️</div>
        </div>
        <div className="absolute top-[25%] right-[15%] w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-300 to-red-400 opacity-90 rounded-2xl -rotate-45 animate-float shadow-lg" style={{ animationDelay: '2.7s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">🔍</div>
        </div>
        <div className="absolute top-[10%] left-[25%] w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-300 to-indigo-400 opacity-90 rounded-2xl rotate-45 animate-float shadow-lg" style={{ animationDelay: '4.2s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">🎮</div>
        </div>
        <div className="absolute top-[5%] right-[28%] w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-cyan-300 to-cyan-400 opacity-90 rounded-2xl -rotate-12 animate-float shadow-lg" style={{ animationDelay: '1.9s' }}>
          <div className="flex items-center justify-center h-full text-lg md:text-xl">⚡</div>
        </div>
        <div className="absolute top-[15%] left-[40%] w-11 h-11 md:w-14 md:h-14 bg-gradient-to-br from-amber-300 to-amber-400 opacity-90 rounded-2xl rotate-12 animate-float shadow-lg" style={{ animationDelay: '3.5s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">🔥</div>
        </div>

        {/* Added more icons - middle section */}
        <div className="absolute top-[35%] left-[8%] w-11 h-11 md:w-13 md:h-13 bg-gradient-to-br from-emerald-300 to-emerald-400 opacity-90 rounded-2xl rotate-12 animate-float shadow-lg" style={{ animationDelay: '2.1s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">🔧</div>
        </div>
        <div className="absolute top-[40%] right-[5%] w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-300 to-orange-400 opacity-90 rounded-2xl -rotate-12 animate-float shadow-lg" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">📊</div>
        </div>
        <div className="absolute top-[45%] left-[60%] w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-300 to-teal-400 opacity-90 rounded-2xl rotate-45 animate-float shadow-lg" style={{ animationDelay: '3.7s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">🧩</div>
        </div>
        <div className="absolute top-[50%] left-[20%] w-11 h-11 md:w-13 md:h-13 bg-gradient-to-br from-blue-200 to-indigo-300 opacity-90 rounded-2xl -rotate-12 animate-float shadow-lg" style={{ animationDelay: '1.2s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">💡</div>
        </div>
        <div className="absolute top-[55%] right-[25%] w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-rose-300 to-rose-400 opacity-90 rounded-2xl rotate-12 animate-float shadow-lg" style={{ animationDelay: '2.8s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">🏆</div>
        </div>

        {/* Added more icons - bottom section */}
        <div className="absolute top-[65%] left-[15%] w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-200 to-purple-300 opacity-90 rounded-2xl rotate-45 animate-float shadow-lg" style={{ animationDelay: '1.8s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">📘</div>
        </div>
        <div className="absolute top-[70%] right-[12%] w-11 h-11 md:w-13 md:h-13 bg-gradient-to-br from-sky-300 to-sky-400 opacity-90 rounded-2xl -rotate-12 animate-float shadow-lg" style={{ animationDelay: '3.3s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">🌐</div>
        </div>
        <div className="absolute top-[75%] left-[30%] w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-200 to-amber-300 opacity-90 rounded-2xl rotate-12 animate-float shadow-lg" style={{ animationDelay: '0.9s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">⚙️</div>
        </div>
        <div className="absolute top-[80%] right-[30%] w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-200 to-green-300 opacity-90 rounded-2xl -rotate-45 animate-float shadow-lg" style={{ animationDelay: '2.4s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">💼</div>
        </div>
        <div className="absolute top-[85%] left-[50%] w-11 h-11 md:w-13 md:h-13 bg-gradient-to-br from-pink-200 to-pink-300 opacity-90 rounded-2xl rotate-12 animate-float shadow-lg" style={{ animationDelay: '1.7s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">🎯</div>
        </div>
        <div className="absolute top-[90%] right-[20%] w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-cyan-200 to-cyan-300 opacity-90 rounded-2xl rotate-45 animate-float shadow-lg" style={{ animationDelay: '3.9s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">🚴</div>
        </div>
        <div className="absolute top-[95%] left-[35%] w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-indigo-200 to-indigo-300 opacity-90 rounded-2xl -rotate-12 animate-float shadow-lg" style={{ animationDelay: '2.5s' }}>
          <div className="flex items-center justify-center h-full text-xl md:text-2xl">🔍</div>
        </div>
      </div>
      {/* Hero Section with animated elements */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center mt-8 md:mt-16 mb-8 text-center relative">

        <div className="relative bg-white/40 backdrop-blur-md px-8 py-6 rounded-2xl shadow-xl mb-2 transform hover:scale-105 transition-transform duration-300">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-indigo-900 mb-4">আল-হিকমাহ একাডেমি</h1>
          <p className="text-lg md:text-2xl text-indigo-800 max-w-3xl px-4 font-medium">আপনার শিক্ষা যাত্রা শুরু করুন আমাদের অনলাইন প্লাটফর্মে</p>
        </div>
      </div>      {/* Course Details Section - Center of page with fun design */}
      <div className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-8 mb-10 relative z-10 border-4 border-indigo-200">
        {/* Decorative floating elements */}
        <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 opacity-95 rounded-full flex items-center justify-center transform rotate-12 border-4 border-white shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
          <span className="text-3xl">🚀</span>
        </div>
        <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 opacity-95 rounded-full flex items-center justify-center transform -rotate-12 border-4 border-white shadow-lg animate-float" style={{ animationDelay: '1.2s' }}>
          <span className="text-3xl">💻</span>
        </div>
        <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-500 opacity-95 rounded-full flex items-center justify-center transform -rotate-12 border-4 border-white shadow-lg animate-float" style={{ animationDelay: '2.3s' }}>
          <span className="text-3xl">🎮</span>
        </div>
        <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 opacity-95 rounded-full flex items-center justify-center transform rotate-12 border-4 border-white shadow-lg animate-float" style={{ animationDelay: '3.7s' }}>
          <span className="text-3xl">🤖</span>
        </div>

        <div className="pt-8 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            আল-হিকমাহ একাডেমি কর্তৃক পরিচালিত, মাধ্যমিক ও উচ্চ মাধ্যমিক স্কুল ও কলেজ ছাত্র-ছাত্রীদের জন্য কোডিং ও প্রোগ্রামিং ল্যাংগুয়েজ কোর্স
          </h2>

          <div className="text-indigo-900">
            <p className="font-bold text-xl mb-4 text-center bg-indigo-100 py-2 px-4 rounded-full inline-block">কোর্স সমূহের সংক্ষিপ্ত বিবরণ</p>

            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-3 flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg">
                <span className="text-2xl mr-2">🎯</span> ১. পরিচিতি
              </h3>
              <p className="mb-4 text-lg">
                বর্তমান AI এর যুগে প্রযুক্তিবিষয়ক জ্ঞান বিশেষত প্রোগ্রামিং জানা শুধু একটি দক্ষতা নয়, এটি ভবিষ্যতের জন্য একটি শক্তিশালী হাতিয়ার। আমাদের স্কুল এবং কলেজ লেভেলে যথাক্রমে ১২-সেমিস্টার এবং ৮-সেমিস্টারের ডিজিটাল লিটারেসি এবং প্রোগ্রামিং কোর্স দুটি বিশেষভাবে স্কুল ও কলেজ পড়ুয়া শিক্ষার্থীদের জন্য ডিজাইন করা হয়েছে, যা তাদের এই প্রযুক্তিনির্ভর প্রতিযোগিতামূলক যুগে অনেকখানি এগিয়ে রাখবে।
              </p>
            </div>

            <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-3 flex items-center bg-purple-600 text-white py-2 px-4 rounded-lg">
                <span className="text-2xl mr-2">🤔</span> ২. কেন কোডিং ও প্রোগ্রামিং ভাষা শিখবেন?
              </h3>
              <p className="mb-4 text-lg">
                কোডিং শেখা মানে হলো ডিজিটাল দুনিয়ার গঠন ও কাজ করার নিয়ম বোঝা। এটি লজিক্যাল ও ক্রিটিক্যাল থিংকিং এবং সৃজনশীলতাকে বিকশিত করে। পাশাপাশি প্রোগ্রামিং ভাষাগুলো শিখে শিক্ষার্থীরা ওয়েবসাইট, অ্যাপস ও প্রযুক্তিনির্ভর বিভিন্ন সমাধান তৈরি করতে পারবে, যা ভবিষ্যতের পড়াশোনা ও কর্মজীবনে সহায়ক হবে।
              </p>
            </div>

            <div className="mb-8 bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-3 flex items-center bg-green-600 text-white py-2 px-4 rounded-lg">
                <span className="text-2xl mr-2">🌟</span> ৩. আপনি কী কী দক্ষতা অর্জন করবেন?
              </h3>
              <ul className="list-none pl-2 mb-4 space-y-2 text-lg">
                <li className="flex items-center"><span className="bg-green-200 rounded-full p-1 mr-2 text-xl">👨‍💻</span> C, C++, Java, Javascript সহ বিভিন্ন প্রোগ্রামিং ভাষা</li>
                <li className="flex items-center"><span className="bg-blue-200 rounded-full p-1 mr-2 text-xl">🌐</span> HTML, CSS, JavaScript, React ও Flutter দিয়ে ওয়েব ও মোবাইল অ্যাপ তৈরি</li>
                <li className="flex items-center"><span className="bg-purple-200 rounded-full p-1 mr-2 text-xl">🗄️</span> MySQL ও PostgreSQL দিয়ে ডেটাবেস ব্যবস্থাপনা</li>
                <li className="flex items-center"><span className="bg-yellow-200 rounded-full p-1 mr-2 text-xl">🔄</span> Git ও GitHub দিয়ে ভার্সন কন্ট্রোল ও টিম-ওয়ার্ক</li>
                <li className="flex items-center"><span className="bg-red-200 rounded-full p-1 mr-2 text-xl">🎨</span> UI/UX ডিজাইন ও প্রজেক্ট বাস্তবায়ন</li>
                <li className="flex items-center"><span className="bg-indigo-200 rounded-full p-1 mr-2 text-xl">⚙️</span> Node.js ও Express.js দিয়ে API তৈরি</li>
                <li className="flex items-center"><span className="bg-cyan-200 rounded-full p-1 mr-2 text-xl">🤖</span> Python দিয়ে AI, Machine Learning সহ আরো অনেক কিছু</li>
              </ul>
            </div>

            <div className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-3 flex items-center bg-yellow-600 text-white py-2 px-4 rounded-lg">
                <span className="text-2xl mr-2">📚</span> ৪. কোর্স সময়কাল ও সেমিস্টার কাঠামো
              </h3>
              <div className="flex flex-col md:flex-row gap-4 text-lg">
                <div className="bg-white/80 rounded-xl p-3 shadow-sm flex-1">
                  <p className="font-medium mb-2">দুইটি কোর্স যথাক্রমে ২ ও ৩ বছর মেয়াদি, প্রতি সেমিস্টার ৩ মাস করে।</p>
                </div>
                <div className="bg-white/80 rounded-xl p-3 shadow-sm flex-1">
                  <p className="font-medium mb-2">মাধ্যমিক/স্কুল স্তর: শ্রেণি ৭–১০ (বয়স ১২–১৬)</p>
                  <p className="bg-blue-100 p-1 rounded-md inline-block">মোট ১২টি সেমিস্টার</p>
                </div>
                <div className="bg-white/80 rounded-xl p-3 shadow-sm flex-1">
                  <p className="font-medium mb-2">উচ্চমাধ্যমিক/কলেজ স্তর: শ্রেণি ১০–১২ (বয়স ১৬–১৮)</p>
                  <p className="bg-purple-100 p-1 rounded-md inline-block">মোট ৮টি সেমিস্টার</p>
                </div>
              </div>
              <p className="mt-4 text-lg bg-yellow-100 p-2 rounded-lg text-center">তবে সকল বয়সী শিক্ষার্থীদের জন্য উভয় কোর্স উন্মুক্ত থাকবে।</p>
            </div>

            <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-3 flex items-center bg-red-600 text-white py-2 px-4 rounded-lg">
                <span className="text-2xl mr-2">💰</span> ৫. কোর্স ফি
              </h3>
              <p className="mb-4 text-lg">উচ্চমানের শিক্ষা সবার জন্য সহজলভ্য করতে আমাদের ফি রাখা হয়েছে অত্যন্ত কম:</p>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="bg-white/80 rounded-xl p-4 shadow-sm flex-1 border-2 border-blue-200 text-center transform hover:scale-105 transition-transform duration-300">
                  <div className="font-bold text-lg mb-2 bg-blue-600 text-white py-1 rounded-lg">মাধ্যমিক/স্কুল স্তর (৭–১০)</div>
                  <div className="text-2xl font-bold text-blue-800">প্রতি সেমিস্টার</div>
                  <div className="text-4xl font-bold text-purple-800 my-2">মাত্র ১৯৯ টাকা</div>
                </div>
                <div className="bg-white/80 rounded-xl p-4 shadow-sm flex-1 border-2 border-purple-200 text-center transform hover:scale-105 transition-transform duration-300">
                  <div className="font-bold text-lg mb-2 bg-purple-600 text-white py-1 rounded-lg">উচ্চ মাধ্যমিক/কলেজ স্তর (১০–১২)</div>
                  <div className="text-2xl font-bold text-purple-800">প্রতি সেমিস্টার</div>
                  <div className="text-4xl font-bold text-purple-800 my-2">মাত্র ২৯৯ টাকা</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-3 flex items-center bg-cyan-600 text-white py-2 px-4 rounded-lg">
                  <span className="text-2xl mr-2">🕒</span> ৬. ক্লাসের সময়
                </h3>
                <div className="bg-white/80 rounded-xl p-3 shadow-sm text-lg">
                  <p className="font-medium">সপ্তাহে দুইদিন ক্লাস:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-blue-100 px-3 py-1 rounded-lg">শুক্রবার</span>
                    <span className="bg-blue-100 px-3 py-1 rounded-lg">শনিবার</span>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded-lg mt-3 text-center">
                    প্রতিটি ক্লাস দুই ঘন্টা
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-4 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-3 flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg">
                  <span className="text-2xl mr-2">👨‍🏫</span> ৭. পাঠ্যক্রম নির্মাতা
                </h3>
                <div className="bg-white/80 rounded-xl p-3 shadow-sm text-lg">
                  <p className="mb-2">বাংলাদেশের বিভিন্ন বিশ্ববিদ্যালয়ের শিক্ষকদের তত্ত্বাবধানে:</p>
                  <ul className="space-y-1">
                    <li className="bg-indigo-50 p-1 rounded">বিউবিটি (BUBT) এর CSE বিভাগের Assistant Professor, Md. Masudul Islam</li>
                    <li className="bg-indigo-50 p-1 rounded">আইআইইউএসটি (IIUST) এর CSE ডিপার্টমেন্ট এর প্রধান (ভারপ্রাপ্ত) Md. Julkar Nayeem</li>
                    <li className="bg-indigo-50 p-1 rounded">লেকচারার Md. Rabiul Islam প্রমুখ</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-3 flex items-center bg-emerald-600 text-white py-2 px-4 rounded-lg">
                  <span className="text-2xl mr-2">👨‍🎓</span> ৮. শিক্ষকবৃন্দ
                </h3>
                <div className="bg-white/80 rounded-xl p-3 shadow-sm text-lg">
                  <p>দেশসেরা বিশ্ববিদ্যালয় থেকে মেধাবী শিক্ষার্থীরা:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-green-100 px-2 py-1 rounded-lg text-sm">বুয়েট (BUET)</span>
                    <span className="bg-green-100 px-2 py-1 rounded-lg text-sm">রুয়েট (RUET)</span>
                    <span className="bg-green-100 px-2 py-1 rounded-lg text-sm">কুয়েট (KUET)</span>
                    <span className="bg-green-100 px-2 py-1 rounded-lg text-sm">চুয়েট (CUET)</span>
                  </div>
                  <p className="mt-2">এছাড়াও খণ্ডকালীন শিক্ষক হিসেবে থাকবেন বিভিন্ন বড় বড় টেক কোম্পানির Industry experts এবং বিশ্ববিদ্যালয়ের শিক্ষকবৃন্দ।</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-3 flex items-center bg-amber-600 text-white py-2 px-4 rounded-lg">
                  <span className="text-2xl mr-2">🎓</span> ৯. স্কলারশিপ সুযোগ
                </h3>
                <div className="bg-white/80 rounded-xl p-3 shadow-sm text-lg">
                  <p>মেধাবী শিক্ষার্থীদের জন্য রয়েছে বিদেশি বিভিন্ন বিশ্ববিদ্যালয়ে স্কলারশিপের সুযোগ সৃষ্টির জন্য আমাদের একাডেমি কাজ করবে। যা তাদের উচ্চশিক্ষা ও আন্তর্জাতিক ক্যারিয়ার গঠনের পথ প্রশস্ত করবে।</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-3 flex items-center bg-pink-600 text-white py-2 px-4 rounded-lg">
                <span className="text-2xl mr-2">🏆</span> ১০. ক্যাপস্টোন প্রজেক্ট ও প্রদর্শনী
              </h3>
              <div className="bg-white/80 rounded-xl p-3 shadow-sm text-lg">
                <p>প্রতিটি সেমিস্টারে প্রোজেক্ট থাকার পাশাপাশি শেষ সেমিস্টারে শিক্ষার্থীরা একটি ক্যাপস্টোন প্রজেক্ট তৈরি করবে যা তাদের অর্জিত সব জ্ঞানকে কাজে লাগিয়ে বাস্তব কিছু তৈরি করার সুযোগ দেবে। এই প্রজেক্টগুলো পাবলিক প্রদর্শনীতে উপস্থাপন করা হবে। এছাড়াও কর্মক্ষেত্র সৃষ্টিতে আমাদের একাডেমি ভূমিকা রাখবে।</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA buttons - Fun and colorful */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10 mb-6">
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg px-8 py-6 w-full sm:w-auto rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-white">
            <Link href="/signin">
              <span className="flex items-center justify-center">
                <span className="mr-2 text-xl">🚀</span> সাইন ইন করুন
              </span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-white text-lg px-8 py-6 w-full sm:w-auto rounded-full shadow-lg border-2 border-indigo-400 text-indigo-600 hover:bg-indigo-50 transform hover:scale-105 transition-all duration-300">
            <Link href="/signup">
              <span className="flex items-center justify-center">
                <span className="mr-2 text-xl">✨</span> রেজিস্ট্রেশন করুন
              </span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer - positioned at bottom with fun style */}
      <div className="w-full text-center pb-4 pt-2 mt-auto">
        <div className="text-xs md:text-sm text-indigo-900 px-6 mx-auto bg-white/50 backdrop-blur-md py-4 rounded-2xl max-w-sm border-2 border-indigo-200 shadow-lg">
          <p className="font-medium">আল-হিকমাহ একাডেমি</p>
          <p className="mb-2">
            <a href="https://www.facebook.com/alhikmahacademybd"
              className="text-indigo-600 hover:text-indigo-800 underline break-words font-medium"
              target="_blank" rel="noopener noreferrer">
              facebook.com/alhikmahacademybd
            </a>
          </p>
          <p>© {new Date().getFullYear()} আল-হিকমাহ একাডেমি। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </main>
  );
}
