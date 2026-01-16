import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Send, Info, CheckCircle, Copy } from 'lucide-react';
import { THEME, PRIMARY_COLOR } from '../constants';

const EnquiryView: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [requirements, setRequirements] = useState('');

  // Stores start/end time for each date key (ISO string YYYY-MM-DD)
  const [dateTimes, setDateTimes] = useState<Record<string, { start: string; end: string }>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Helper to generate dates between start and end
  const getDatesInRange = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return [];
    const dates = [];
    const start = new Date(startStr);
    const end = new Date(endStr);

    // Safety check for user sanity (e.g. max 14 days for this demo)
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 30) return []; // Limit to avoid performance issues
    if (start > end) return [];

    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current).toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const dates = getDatesInRange(startDate, endDate);

  // Initialize time slots when dates change, preserving existing values if possible
  useEffect(() => {
    if (dates.length === 0) return;

    setDateTimes(prev => {
      const newTimes: Record<string, { start: string; end: string }> = {};
      dates.forEach(date => {
        if (prev[date]) {
          newTimes[date] = prev[date];
        } else {
          // Default business hours
          newTimes[date] = { start: '09:00', end: '17:00' };
        }
      });
      return newTimes;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const handleTimeChange = (date: string, field: 'start' | 'end', value: string) => {
    setDateTimes(prev => ({
      ...prev,
      [date]: { ...prev[date], [field]: value }
    }));
  };

  const applyFirstToAll = () => {
    if (dates.length === 0) return;
    const firstDate = dates[0];
    const { start, end } = dateTimes[firstDate];

    const newTimes: Record<string, { start: string; end: string }> = {};
    dates.forEach(date => {
      newTimes[date] = { start, end };
    });
    setDateTimes(newTimes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in text-center p-6">
        <div className={`h-20 w-20 ${THEME.bgLight} rounded-full flex items-center justify-center mb-6`}>
          <CheckCircle className={`h-10 w-10 ${THEME.text}`} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Enquiry Submitted!</h2>
        <p className="text-slate-600 max-w-md mb-8">
          Thank you for reaching out. We have received your requirements and our team will check venue availability and get back to you shortly.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setStartDate('');
            setEndDate('');
            setRequirements('');
            setDateTimes({});
          }}
          className={`px-6 py-3 ${THEME.bg} text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm`}
        >
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Enquiry & Assistance</h2>
        <p className="text-slate-500">Not sure which venue fits best? Tell us your schedule and requirements, and we'll help you book.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8">

        {/* Date Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <Calendar className={`h-5 w-5 mr-2 ${THEME.text}`} />
            Event Dates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Start Date</label>
              <input
                type="date"
                required
                className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20 focus:border-[${PRIMARY_COLOR}] outline-none transition-all`}
                value={startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">End Date</label>
              <input
                type="date"
                required
                className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20 focus:border-[${PRIMARY_COLOR}] outline-none transition-all`}
                value={endDate}
                min={startDate || new Date().toISOString().split('T')[0]}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Time Schedule */}
        {dates.length > 0 && (
          <div className="space-y-4 animate-slide-down">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-2">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                <Clock className={`h-5 w-5 mr-2 ${THEME.text}`} />
                Time Schedule
              </h3>
              {dates.length > 1 && (
                <button
                  type="button"
                  onClick={applyFirstToAll}
                  className={`text-sm ${THEME.text} hover:opacity-80 font-medium flex items-center`}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Apply first day's time to all
                </button>
              )}
            </div>

            <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
              {dates.map((date, index) => (
                <div key={date} className={`p-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 ${index !== dates.length - 1 ? 'border-b border-slate-200' : ''}`}>
                  <div className="font-medium text-slate-700">
                    {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500 w-8">Start</span>
                    <input
                      type="time"
                      required
                      className={`flex-1 px-3 py-1.5 border border-slate-300 rounded-md focus:border-[${PRIMARY_COLOR}] focus:ring-1 focus:ring-[${PRIMARY_COLOR}] outline-none text-sm`}
                      value={dateTimes[date]?.start || ''}
                      onChange={(e) => handleTimeChange(date, 'start', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500 w-8">End</span>
                    <input
                      type="time"
                      required
                      className={`flex-1 px-3 py-1.5 border border-slate-300 rounded-md focus:border-[${PRIMARY_COLOR}] focus:ring-1 focus:ring-[${PRIMARY_COLOR}] outline-none text-sm`}
                      value={dateTimes[date]?.end || ''}
                      onChange={(e) => handleTimeChange(date, 'end', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requirements */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <Info className={`h-5 w-5 mr-2 ${THEME.text}`} />
            Additional Requirements
          </h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Describe your event needs</label>
            <textarea
              className={`w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[${PRIMARY_COLOR}]/20 focus:border-[${PRIMARY_COLOR}] outline-none transition-all resize-none`}
              placeholder="E.g., We need a projector, sound system, and seating for 50 people. Prefer a venue near the cafeteria."
              required
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />
            <p className="text-xs text-slate-500 text-right">
              The more details you provide, the better we can assist you.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              flex items-center px-8 py-3 rounded-lg text-white font-medium shadow-sm transition-all
              ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : `${THEME.bg} hover:opacity-90 hover:shadow-md`}
            `}
          >
            {isSubmitting ? 'Sending...' : (
              <>
                Submit Enquiry
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnquiryView;