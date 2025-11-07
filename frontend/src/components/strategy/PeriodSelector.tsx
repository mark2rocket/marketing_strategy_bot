import React, { useState, useEffect } from 'react';
import { PeriodType } from '../../types';

interface PeriodSelectorProps {
  value: {
    periodType: PeriodType;
    year: number;
    quarter?: number;
    month?: number;
  };
  onChange: (value: {
    periodType: PeriodType;
    year: number;
    quarter?: number;
    month?: number;
  }) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  value,
  onChange,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const [periodType, setPeriodType] = useState<PeriodType>(value.periodType);
  const [year, setYear] = useState(value.year);
  const [quarter, setQuarter] = useState(value.quarter);
  const [month, setMonth] = useState(value.month);

  useEffect(() => {
    onChange({
      periodType,
      year,
      quarter: periodType === 'quarterly' ? quarter : undefined,
      month: periodType === 'monthly' ? month : undefined,
    });
  }, [periodType, year, quarter, month]);

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {/* Period Type Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          기간 단위
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriodType('yearly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              periodType === 'yearly'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            연간
          </button>
          <button
            onClick={() => setPeriodType('quarterly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              periodType === 'quarterly'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            분기
          </button>
          <button
            onClick={() => setPeriodType('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              periodType === 'monthly'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            월간
          </button>
        </div>
      </div>

      {/* Year Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          연도
        </label>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:border-primary-500 focus:ring-2 focus:ring-primary-500
                     transition-colors"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </select>
      </div>

      {/* Quarter Selector (conditional) */}
      {periodType === 'quarterly' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            분기
          </label>
          <select
            value={quarter || 1}
            onChange={(e) => setQuarter(parseInt(e.target.value))}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:border-primary-500 focus:ring-2 focus:ring-primary-500
                       transition-colors"
          >
            <option value={1}>1분기</option>
            <option value={2}>2분기</option>
            <option value={3}>3분기</option>
            <option value={4}>4분기</option>
          </select>
        </div>
      )}

      {/* Month Selector (conditional) */}
      {periodType === 'monthly' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            월
          </label>
          <select
            value={month || 1}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:border-primary-500 focus:ring-2 focus:ring-primary-500
                       transition-colors"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
