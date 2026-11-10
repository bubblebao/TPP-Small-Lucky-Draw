import React from 'react';
import { X, Calendar, MapPin, Clock, Award, ShieldAlert } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-2 border-gray-200 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b-2 border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#FFF5EB] via-white to-[#FFF0F3]">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-[#FFF9E6] text-[#D97706] border-2 border-[#FFEAA7] shadow-sm">
              <Award size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#2C3E50]">เงื่อนไขและกติกาการจับรางวัล</h2>
              <p className="text-xs text-[#698A9A] font-semibold">Small Lucky Draw - The Pavilions Phuket</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {/* Event Details Card */}
          <div className="bg-[#F0F7F9] border-2 border-[#CBE3E7] rounded-2xl p-4 flex flex-wrap gap-4 justify-between items-center text-xs shadow-sm">
            <div className="flex items-center space-x-2 text-gray-700 font-semibold">
              <MapPin size={16} className="text-[#E07A5F]" />
              <span>สถานที่: <strong className="text-[#2C3E50]">Board Room</strong></span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 font-semibold">
              <Calendar size={16} className="text-[#E07A5F]" />
              <span>วันพุธที่ 11 พฤศจิกายน 2569</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 font-semibold">
              <Clock size={16} className="text-[#E07A5F]" />
              <span>เวลา 14:30 – 17:00 น.</span>
            </div>
          </div>

          {/* 4 Conditions */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#E07A5F] uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert size={16} />
              เงื่อนไขการรับรางวัล (Conditions)
            </h3>

            <div className="space-y-3">
              <div className="bg-[#FFF9F2] border-2 border-[#FFE8D6] p-4 rounded-2xl flex items-start space-x-3.5 shadow-sm">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#FF8E53] text-white flex items-center justify-center font-black text-xs shadow-sm">1</span>
                <div className="text-xs text-gray-700 space-y-1">
                  <p className="font-extrabold text-[#2C3E50] text-sm">All staff are entitled to have small lucky draw for 1 piece.</p>
                  <p className="text-gray-500 font-medium">พนักงานทุกคนมีสิทธิ์จับรางวัลเล็ก คนละ 1 รางวัล</p>
                </div>
              </div>

              <div className="bg-[#FFF9F2] border-2 border-[#FFE8D6] p-4 rounded-2xl flex items-start space-x-3.5 shadow-sm">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#FF8E53] text-white flex items-center justify-center font-black text-xs shadow-sm">2</span>
                <div className="text-xs text-gray-700 space-y-1">
                  <p className="font-extrabold text-[#2C3E50] text-sm">Staff is unable to exchange the gift from the center. However, they can change between themselves.</p>
                  <p className="text-gray-500 font-medium">พนักงานไม่สามารถแลกของขวัญจากกองกลางได้ หากจะแลกให้แลกระหว่างพนักงานด้วยกันเอง</p>
                </div>
              </div>

              <div className="bg-[#FFF9F2] border-2 border-[#FFE8D6] p-4 rounded-2xl flex items-start space-x-3.5 shadow-sm">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#FF8E53] text-white flex items-center justify-center font-black text-xs shadow-sm">3</span>
                <div className="text-xs text-gray-700 space-y-1">
                  <p className="font-extrabold text-[#2C3E50] text-sm">Staff who is busy during that time can appoint any one to draw the gift for them.</p>
                  <p className="text-gray-500 font-medium">หากพนักงานไม่สามารถมาจับรางวัลได้ด้วยตนเอง ให้ส่งตัวแทนมา โดยฝ่ายบุคคล (HR) จะบันทึกไว้ในแบบฟอร์มและถ่ายรูปไว้เป็นหลักฐาน</p>
                </div>
              </div>

              <div className="bg-[#FFF9F2] border-2 border-[#FFE8D6] p-4 rounded-2xl flex items-start space-x-3.5 shadow-sm">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#FF8E53] text-white flex items-center justify-center font-black text-xs shadow-sm">4</span>
                <div className="text-xs text-gray-700 space-y-1">
                  <p className="font-extrabold text-[#2C3E50] text-sm">HR and Staff Committee will assist to take care this event and record all the gift numbers in the registration form.</p>
                  <p className="text-gray-500 font-medium">ฝ่ายบุคคลและคณะกรรมการจะช่วยกันดูแลการจับรางวัลและบันทึกหมายเลขรางวัลลงในแบบฟอร์มลงทะเบียน</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-[#FF8E53] hover:bg-[#FF7733] text-white font-black text-xs transition-all shadow-md active:scale-95"
          >
            รับทราบและปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
