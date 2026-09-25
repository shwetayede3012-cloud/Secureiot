import React from 'react';

interface TopographicalContoursProps {
  className?: string;
  opacity?: number;
}

export const TopographicalContours: React.FC<TopographicalContoursProps> = ({
  className = '',
  opacity = 0.85,
}) => {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 1000 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover scale-110"
        preserveAspectRatio="xMinYMid slice"
      >
        <defs>
          <linearGradient id="contourGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#4c1d95" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="glowLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#18181b" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Outer gentle contour curves matching Crisis24 topographic lines */}
        <path
          d="M-50 120 C 180 80, 290 220, 480 180 C 680 140, 780 260, 950 200 C 1050 160, 1150 240, 1200 280"
          stroke="#262930"
          strokeWidth="1.2"
        />
        <path
          d="M-40 180 C 190 140, 310 300, 520 240 C 720 180, 810 340, 990 270 C 1080 230, 1160 300, 1220 350"
          stroke="#2d313a"
          strokeWidth="1.2"
        />
        <path
          d="M-30 250 C 210 200, 340 370, 560 310 C 750 250, 840 410, 1020 340 C 1110 300, 1180 370, 1240 420"
          stroke="url(#glowLine)"
          strokeWidth="1.3"
        />
        <path
          d="M-20 320 C 230 270, 370 440, 600 380 C 780 320, 870 480, 1050 410 C 1140 370, 1200 440, 1260 490"
          stroke="#252830"
          strokeWidth="1.2"
        />
        <path
          d="M-10 390 C 250 340, 400 510, 640 450 C 810 390, 900 550, 1080 480 C 1170 440, 1220 510, 1280 560"
          stroke="#2a2d36"
          strokeWidth="1.2"
        />

        {/* Central tight contour elevation ring representing risk epicenter */}
        <path
          d="M 120 460 C 220 380, 420 400, 480 490 C 530 570, 460 670, 340 680 C 220 690, 80 620, 70 530 C 60 470, 80 430, 120 460 Z"
          stroke="#323640"
          strokeWidth="1.2"
        />
        <path
          d="M 170 480 C 240 420, 390 430, 430 500 C 470 560, 420 630, 320 640 C 230 650, 140 590, 130 520 C 125 475, 140 450, 170 480 Z"
          stroke="url(#contourGrad)"
          strokeWidth="1.4"
        />
        <path
          d="M 220 505 C 260 465, 360 470, 390 515 C 420 560, 380 605, 310 610 C 250 615, 190 570, 185 530 C 180 500, 195 485, 220 505 Z"
          stroke="#282c33"
          strokeWidth="1.2"
        />
        
        {/* Subtle sweeping lower contour bands */}
        <path
          d="M-50 490 C 200 470, 460 640, 700 580 C 890 530, 1000 660, 1180 600 C 1250 580, 1300 620, 1340 660"
          stroke="#21242a"
          strokeWidth="1"
        />
        <path
          d="M-50 570 C 190 550, 490 710, 740 650 C 930 600, 1040 730, 1220 670 C 1280 650, 1330 690, 1360 720"
          stroke="#1d2026"
          strokeWidth="1"
        />
        <path
          d="M-50 650 C 180 630, 520 780, 780 720 C 970 670, 1080 790, 1250 740"
          stroke="#1a1c22"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};
