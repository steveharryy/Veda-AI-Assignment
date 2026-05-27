import React, { useState } from 'react';
import { useAssignmentStore } from '../store/useAssignmentStore';
import { SAMPLE_PAPERS } from '../utils/samplePapers';
import { 
  Search, 
  SlidersHorizontal, 
  MoreVertical, 
  Eye, 
  Trash2, 
  Plus, 
  RefreshCw
} from 'lucide-react';
import { Dropdown, message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

interface AssignmentsListProps {
  onStartWizard: () => void;
  onViewPaper: () => void;
}

export const AssignmentsList: React.FC<AssignmentsListProps> = ({ onStartWizard, onViewPaper }) => {
  const { 
    assignments, 
    deleteAssignment, 
    clearAssignments, 
    resetAssignments, 
    setGeneratedPaper 
  } = useAssignmentStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssignments = assignments.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string, title: string) => {
    deleteAssignment(id);
    message.success(`"${title}" deleted successfully`);
  };

  const handleView = (item: any) => {
    const sample = SAMPLE_PAPERS[item.id];
    if (sample) {
      setGeneratedPaper(sample);
    }
    onViewPaper();
  };

  const handleMenuClick = (key: string, item: any) => {
    if (key === 'view') {
      handleView(item);
    } else if (key === 'delete') {
      handleDelete(item.id, item.title);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full select-none pb-24">
      <div className="flex justify-between items-center no-print">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Assignments</h1>
          <p className="text-neutral-500 text-[13px] mt-0.5">
            Manage and create assignments for your classes.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={clearAssignments}
            className="text-[12px] text-neutral-500 hover:text-red-500 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:border-red-200 transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear List
          </button>
          
          {assignments.length === 0 && (
            <button
              onClick={resetAssignments}
              className="text-[12px] text-neutral-500 hover:text-black px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:border-neutral-400 transition-all flex items-center gap-1.5 animate-pulse"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset List
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full no-print">
        <button className="h-[48px] px-5 bg-white border border-neutral-100 rounded-full flex items-center gap-2 text-neutral-600 hover:text-black font-semibold text-[14px] shadow-sm hover:shadow active:scale-95 transition-all">
          <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
          <span>Filter By</span>
        </button>

        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search Assignment"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[48px] pl-11 pr-5 bg-white border border-neutral-100 rounded-full text-[14px] outline-none shadow-sm focus:border-neutral-900 focus:shadow-md transition-all placeholder:text-neutral-400"
          />
        </div>
      </div>

      {filteredAssignments.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-2"
        >
          <AnimatePresence mode="popLayout">
            {filteredAssignments.map((item) => {
              const menuItems = [
                {
                  key: 'view',
                  label: 'View Assignment',
                  icon: <Eye className="w-4 h-4" />,
                },
                {
                  key: 'delete',
                  label: 'Delete',
                  danger: true,
                  icon: <Trash2 className="w-4 h-4" />,
                },
              ];

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="bg-white rounded-[24px] p-6 border border-neutral-100 shadow-sm flex flex-col justify-between h-[164px] card-shadow relative overflow-hidden group hover:border-neutral-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-4">
                    <h3 
                      onClick={() => handleView(item)}
                      className="text-lg font-bold text-neutral-900 tracking-tight leading-snug cursor-pointer group-hover:text-orange-600 transition-colors"
                    >
                      {item.title}
                    </h3>

                    <Dropdown 
                      menu={{ 
                        items: menuItems, 
                        onClick: ({ key }) => handleMenuClick(key, item) 
                      }} 
                      trigger={['click']} 
                      placement="bottomRight"
                    >
                      <button className="w-8 h-8 rounded-full hover:bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-black transition-colors">
                        <MoreVertical className="w-[18px] h-[18px]" />
                      </button>
                    </Dropdown>
                  </div>

                  <div className="flex justify-between items-end border-t border-neutral-50 pt-4 mt-auto">
                    <div className="text-[12px] text-neutral-500">
                      Assigned on : <span className="font-medium text-neutral-700">{item.assignedDate}</span>
                    </div>
                    
                    <div className="text-[12px] text-neutral-700 font-semibold bg-neutral-50 px-3 py-1 rounded-full border border-neutral-100">
                      Due : {item.dueDate}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[24px] border border-neutral-100 shadow-sm mt-6">
          <p className="text-neutral-500 text-[14px]">No assignments match your search query.</p>
        </div>
      )}

      <div className="fixed bottom-8 left-1/2 sm:left-[calc(50%+140px)] -translate-x-1/2 z-40 no-print">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartWizard}
          className="bg-black hover:bg-neutral-800 text-white font-semibold text-[15px] h-[52px] px-8 rounded-full flex items-center justify-center gap-2.5 shadow-2xl shadow-black/30 border border-neutral-900 active:scale-95 transition-all"
        >
          <Plus className="w-[18px] h-[18px]" />
          <span>Create Assignment</span>
        </motion.button>
      </div>
    </div>
  );
};
