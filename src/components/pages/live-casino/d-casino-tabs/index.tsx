import React from 'react';

interface DCasinoTabsProps {
  tabs: any[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

const DCasinoTabs = ({ tabs, activeTab, onTabChange }: DCasinoTabsProps) => {
  return (
    <div className="casino-container">
      <div className="casino-grid">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`casino-card ${activeTab === tab.id ? 'active' : 'inactive'}`}
          >
            <span className={`casino-label ${activeTab === tab.id ? 'label-active' : 'label-inactive'}`}>
              {tab.name}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .casino-container {
          flex: 1 1 0%;
          overflow: hidden auto;
          padding: 16px;
        }
        .casino-grid {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(2, 1fr); /* Desktop design match */
        }
        .casino-card {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          height: 80px;
          border-radius: 16px;
          padding: 16px;
          border: 1px solid transparent;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .inactive {
          background-color: rgba(7, 141, 238, 0.08);
          color: rgb(145, 158, 171);
          border-color: rgba(7, 141, 238, 0.3);
        }
          .active {
         background-color: rgba(7, 141, 238, 0.15);
          border-color: rgba(7, 141, 238);
        }
        .casino-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          text-align: center;
          width: 100%;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .label-active { font-weight: 700; }
        .label-inactive { font-weight: 400; }
        .casino-card:hover:not(.active) {
          background-color: rgba(7, 141, 238, 0.15);
        }
      `}</style>
    </div>
  );
};

export default DCasinoTabs;