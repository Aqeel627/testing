export function LensLine() {
  return (
    <div id="lensLine.tsx">
    <div className="absolute left-1/2 -translate-x-1/2 w-[90%] bottom-[1px] pointer-events-none">
      <div className="relative w-full h-full">
        {/* Outer horizontal glow - very wide and soft */}
        <div
          className="absolute left-1/2 top-1/2 h-[20px] w-full -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(30, 100, 200, 0.1) 15%, rgba(59, 130, 246, 0.2) 50%, rgba(30, 100, 200, 0.1) 85%, transparent 100%)",
            filter: "blur(20px)",
          }}
        />

        {/* Main wide horizontal streak */}
        {/* <div
          className="absolute left-1/2 top-1/2 h-[20px] w-full -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(30, 100, 200, 0.15) 10%, rgba(59, 130, 246, 0.3) 50%, rgba(30, 100, 200, 0.15) 90%, transparent 100%)",
            filter: "blur(8px)",
          }}
        /> */}

        {/* Medium horizontal streak */}
        <div
          className="absolute left-1/2 top-1/2 h-[1px] w-[85%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 20%, rgba(100, 180, 255, 0.6) 50%, rgba(59, 130, 246, 0.3) 80%, transparent 100%)",
            filter: "blur(4px)",
          }}
        />

        {/* Sharp horizontal line */}
        <div
          className="absolute left-1/2 top-1/2 h-[2px] w-[70%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(100, 180, 255, 0.4) 25%, rgba(150, 210, 255, 0.9) 50%, rgba(100, 180, 255, 0.4) 75%, transparent 100%)",
            filter: "blur(1px)",
          }}
        />

        {/* Very sharp center line */}
        <div
          className="absolute left-1/2 top-1/2 h-[1px] w-[95%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(16, 127, 231, 0.6) 30%, rgba(104, 205, 249, 1) 50%, rgba(16, 127, 231, 0.6) 70%, transparent 100%)",
          }}
        />

        {/* Center bright glow area */}
        {/* <div
          className="absolute left-1/2 top-1/2 h-[80px] w-[120px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse, rgba(100, 180, 255, 0.4) 0%, rgba(59, 130, 246, 0.2) 40%, transparent 70%)",
            filter: "blur(10px)",
          }}
        /> */}

        {/* Center bright core glow */}
        {/* <div
          className="absolute left-1/2 top-1/2 h-[30px] w-[60px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(200, 230, 255, 0.9) 0%, rgba(150, 200, 255, 0.5) 40%, transparent 70%)",
            filter: "blur(4px)",
          }}
        /> */}

        {/* White hot center */}
        <div
          className="absolute left-1/2 top-1/2 h-[2px] w-[12px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(104, 205, 249, 1) 0%, rgba(104, 205, 249, 0.8) 50%, transparent 100%)",
            filter: "blur(2px)",
            boxShadow:
              "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(150, 200, 255, 0.6), 0 0 60px rgba(100, 180, 255, 0.4)",
          }}
        />

        {/* Tiny white core */}
        <div
          className="absolute left-1/2 top-1/2 h-[1px] w-[12px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#68cdf9]"
          style={{
            boxShadow:
              "0 0 10px rgba(104, 205, 249, 1), 0 0 20px rgba(104, 205, 249, 0.9)",
          }}
        />
      </div>
    </div>
    </div>
  );
}
