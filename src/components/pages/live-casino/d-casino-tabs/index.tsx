interface DCasinoTabsProps {
  tabs: any[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

const DCasinoTabs = ({ tabs, activeTab, onTabChange }: DCasinoTabsProps) => {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
      <div className="grid grid-cols-2 gap-2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center justify-center cursor-pointer h-[80px] rounded-2xl p-4 border transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              activeTab === tab.id
                ? " bg-[var(--casino-tab-nonactive-bg)] border-[var(--casino-tab-nonactive-border)]  hover:bg-[var(--casino-tab-active-bg)]"
                : "bg-[var(--casino-tab-active-bg)] text-[var(--casino-tab-nonactive-text)] border-[var(--casino-tab-active-border)]"
            }`}
          >
            <span
              className={`text-[0.75rem] text-center w-full overflow-hidden line-clamp-2 ${
                activeTab === tab.id ? "font-bold" : "font-normal"
              }`}
            >
              {tab.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DCasinoTabs;