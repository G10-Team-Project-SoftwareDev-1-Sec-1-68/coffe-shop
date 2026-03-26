"use client";
import * as React from "react";
import { Ticket, Gift, Coffee } from "lucide-react";

const REWARDS_DATA = [
  {
    id: 1,
    icon: Ticket,
    titleTh: "ส่วนลด 50 บาท",
    descTh: "คูปองส่วนลดแทนเงินสด ใช้ได้กับทุกเมนู",
    points: 50,
  },
  {
    id: 2,
    icon: Coffee,
    titleTh: "เครื่องดื่มฟรี 1 แก้ว",
    descTh: "เลือกเมนูไหนก็ได้ในหมวด Classic",
    points: 120,
  },
  {
    id: 3,
    icon: Gift,
    titleTh: "Premium Product",
    descTh: "Limited Edition — แก้ว KAFUNG Collection",
    points: 200,
  },
];

export default function RewardItems({ userPoints = 0, onRedeemSuccess }) {
  const [redeeming, setRedeeming] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  const handleRedeem = async (item) => {
    if (userPoints < item.points) return;
    setRedeeming(item.id);
    
    try {
      const res = await fetch("/api/profile/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rewardId: item.id.toString(),
          pointsNeeded: item.points,
          rewardTitle: item.titleTh,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast(data.error || "แลกรางวัลไม่สำเร็จ");
        return;
      }

      setToast(`แลก "${item.titleTh}" สำเร็จ! ใช้ ${item.points} แต้ม`);
      if (onRedeemSuccess) onRedeemSuccess();
    } catch (err) {
      setToast("เกิดข้อผิดพลาดในการแลกรางวัล");
    } finally {
      setTimeout(() => setRedeeming(null), 500);
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-coffee-dark font-black text-2xl italic uppercase mb-6 px-1 tracking-tight">
        ของรางวัลแนะนำ
      </h2>

      {REWARDS_DATA.map((item) => {
        const canRedeem = userPoints >= item.points;
        const isLoading = redeeming === item.id;

        return (
          <div
            key={item.id}
            className={`bg-white rounded-[2.5rem] p-6 shadow-lg flex justify-between items-center border transition-all
              ${canRedeem
                ? "border-coffee-dark/5 active:scale-95"
                : "border-coffee-dark/5 opacity-60"
              }`}
          >
            <div className="flex items-center gap-6 overflow-hidden">
              {/* ไอคอน */}
              <div className={`p-5 rounded-[1.8rem] border border-black/5 flex items-center justify-center min-w-[85px] min-h-[85px] flex-shrink-0
                ${canRedeem ? "bg-[#EAEAEA] text-coffee-gold" : "bg-gray-100 text-gray-400"}`}>
                <item.icon size={40} strokeWidth={2.5} />
              </div>

              {/* รายละเอียด */}
              <div className="flex flex-col justify-center overflow-hidden">
                <h4 className="text-coffee-dark font-black text-2xl italic tracking-tighter leading-none mb-1">
                  {item.titleTh}
                </h4>
                <p className="text-muted-foreground text-[12px] font-bold italic leading-snug mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.descTh}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={`font-black text-xl italic leading-none ${canRedeem ? "text-coffee-gold" : "text-gray-400"}`}>
                    ใช้ {item.points}
                  </span>
                  <span className={`font-bold text-sm italic uppercase ${canRedeem ? "text-coffee-gold" : "text-gray-400"}`}>
                    แต้ม
                  </span>
                </div>
              </div>
            </div>

            {/* ปุ่มแลก */}
            <button
              onClick={() => handleRedeem(item)}
              disabled={!canRedeem || isLoading}
              className={`flex-shrink-0 ml-4 p-3.5 rounded-full font-black text-sm uppercase italic tracking-wider px-8 transition-all shadow-md
                ${canRedeem
                  ? "bg-coffee-dark text-white hover:bg-coffee-gold hover:text-coffee-dark"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
            >
              {isLoading ? "..." : canRedeem ? "แลก" : "แต้มไม่พอ"}
            </button>
          </div>
        );
      })}

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 bg-coffee-dark text-white font-bold text-sm italic px-6 py-3 rounded-full shadow-2xl animate-bounce whitespace-nowrap">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}